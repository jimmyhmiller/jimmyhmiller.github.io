/** Paint material and lighting beneath real DOM content. Text is never drawn
 * here; text relief only shapes the height map under the DOM's own glyphs. */
// Surfaces per draw. Each draw (the viewport, or one baked tile) only receives
// the surfaces within shadow reach of it, so a page may hold any number.
export const MAX_PAPER_SURFACES = 32;
// Shadow reach beyond a draw's edges, in scene points (1280 per canvas width).
export const SHADOW_MARGIN = 182;
import sceneShader from './shaders/paper-scene.frag';
import kernelShader from './shaders/paper-kernels.glsl';
import geometryShader from './shaders/paper-geometry.frag';
import microShader from './shaders/paper-micro.frag';

/** The renderer's code, for fingerprinting what it has drawn. */
export const rendererSource = () => [sceneShader, kernelShader, geometryShader, microShader, PaperScene.toString()].join('\n');

// Shader sources are bundled as strings (see next.config.js `asset/source`),
// so the renderer needs no runtime fetches and works on every route.
export class PaperScene {
  constructor(canvas, inset, sheet, settings, theme, options = {}) {
    Object.assign(this, { canvas, inset, sheet, settings, theme, options });
    this.gl = canvas.getContext('webgl2', { alpha: options.transparentBase === true, antialias: false, preserveDrawingBuffer: false });
    this.frame = 0;
    this.destroyed = false;
    this.resize = new ResizeObserver(() => this.schedule());
    if (options.autoObserve !== false) this.resize.observe(canvas.parentElement);
    this.surfaceElements = new Set((options.surfaces?.map(s => s.element) ?? [inset, sheet]).filter(Boolean));
    if (options.autoObserve !== false) for (const element of this.surfaceElements) this.resize.observe(element);
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      if (this.destroyed) return;
      // Context loss already invalidates GPU objects; do not delete stale handles
      // through the restored context. Rebuild all maps and programs from scratch.
      this.forgetResources();
      canvas.dataset.state = 'lost';
      options.onState?.('lost');
    });
    canvas.addEventListener('webglcontextrestored', () => {
      this.init().catch(error => options.onError?.(error));
    });
    this.visibilityChanged = () => {
      if (document.hidden) { cancelAnimationFrame(this.frame); this.frame = 0; }
      else this.schedule({ transient: this.paused === true });
    };
    document.addEventListener('visibilitychange', this.visibilityChanged);
    this.ready = this.init();
  }

  async init() {
    const gl = this.gl;
    if (!gl) {
      this.canvas.dataset.state = 'unavailable';
      throw Error('WebGL 2 is required for calculated paper lighting');
    }
    const [fragment, kernels, geometry, micro] = [sceneShader, kernelShader, geometryShader, microShader];
    if (this.destroyed) return;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw Error(message);
      }
      return shader;
    };
    // One triangle covering the target, from a real buffer on attribute 0:
    // drawing with no enabled attribute 0 is emulated, slowly, by desktop GL
    // on macOS (Firefox warns about it).
    const vertexSource = `#version 300 es
      layout(location = 0) in vec2 corner;
      void main() {
        gl_Position = vec4(corner, 0., 1.);
      }`;
    const program = source => {
      const vertex = compile(gl.VERTEX_SHADER, vertexSource);
      const fragment = compile(gl.FRAGMENT_SHADER, source.replace('// MATERIAL_KERNELS', kernels).replaceAll('MAX_PAPER_SURFACES', String(MAX_PAPER_SURFACES)));
      const result = gl.createProgram();
      gl.attachShader(result, vertex);
      gl.attachShader(result, fragment);
      gl.linkProgram(result);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(result, gl.LINK_STATUS)) {
        const message = gl.getProgramInfoLog(result);
        gl.deleteProgram(result);
        throw Error(message);
      }
      return result;
    };
    this.releaseResources();
    this.vertexArray = gl.createVertexArray();
    this.vertexBuffer = gl.createBuffer();
    gl.bindVertexArray(this.vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.program = program(fragment);
    this.geometryProgram = program(geometry);
    this.microProgram = program(micro);
    const uniforms = (program, names) => Object.fromEntries(names.map(name => [name, gl.getUniformLocation(program, name)]));
    this.uniforms = uniforms(this.program, [
      'resolution', 'viewport', 'worldOffset', 'surfaceRects[0]', 'surfaceProperties[0]',
      'surfaceCount', 'pigments[0]', 'lights[0]', 'lightKinds', 'lightRepeat', 'lightCount', 'depth', 'grain',
      'geometryMap', 'microMap', 'geometryResolution', 'geometryPadding',
      'pixelsPerPoint', 'useMicroCache', 'microRows', 'maximumElevation', 'surfaceEffects[0]', 'effectOrigins[0]', 'effectRandomness[0]', 'inkStructure', 'transparentBase', 'microOriginX'
    ]);
    this.geometryUniforms = uniforms(this.geometryProgram, [
      'mapResolution', 'pixelsPerPoint', 'padding', 'rectangle', 'properties', 'material'
    ]);
    this.microUniforms = uniforms(this.microProgram, ['pixelsPerPoint', 'tileWorldY', 'tileSlotY', 'tileOriginX']);
    this.geometryUniforms.textMask = gl.getUniformLocation(this.geometryProgram, 'textMask');
    this.geometryUniforms.useTextMask = gl.getUniformLocation(this.geometryProgram, 'useTextMask');
    this.uniforms.textRaise = gl.getUniformLocation(this.program, 'textRaise');
    this.cacheMicro = !!gl.getExtension('EXT_color_buffer_float') && this.options.cacheMicro !== false;
    this.stats = { draws: 0, geometryBuilds: 0, microTiles: 0 };
    this.draw();
    this.canvas.dataset.state = 'ready';
    this.options.onState?.('ready');
  }

  setSurfaces(surfaces) {
    const elements = new Set(surfaces.map(surface => surface.element));
    for (const element of this.surfaceElements) if (!elements.has(element)) this.resize.unobserve(element);
    if (this.options.autoObserve !== false) for (const element of elements) if (!this.surfaceElements.has(element)) this.resize.observe(element);
    this.surfaceElements = elements;
    this.options.surfaces = surfaces;
  }

  schedule({ transient = false } = {}) {
    if (!transient) this.options.onInvalidate?.();
    if (!this.frame && !this.destroyed && !this.paused && !document.hidden) this.frame = requestAnimationFrame(this.frameCallback);
  }

  // At most one frame in flight: while the GPU is still drawing the last one,
  // wait a display frame instead of queueing another. Queued frames are what
  // turns a slow frame into input lag on a large or fast (120Hz) display.
  frameCallback = () => {
    this.frame = 0;
    if (this.destroyed || this.paused || document.hidden) return;
    if (this.busy()) {
      this.frame = requestAnimationFrame(this.frameCallback);
      return;
    }
    this.draw();
  };

  /** Whether the GPU is still drawing the last frame. */
  busy() {
    const gl = this.gl;
    return !!this.inFlight && !gl.isContextLost() && gl.getSyncParameter(this.inFlight, gl.SYNC_STATUS) !== gl.SIGNALED;
  }

  // While someone drags a light, draw at one device pixel per CSS pixel: a
  // quarter of the work on a retina display. Shadows are soft enough not to
  // show it. Letting go redraws at full resolution, or with `redraw: false`
  // only invalidates, for an owner that bakes a full-resolution copy instead.
  setInteractive(interactive, { redraw = true } = {}) {
    if (this.interactive === interactive) return;
    this.interactive = interactive;
    if (redraw || interactive) this.schedule();
    else this.options.onInvalidate?.();
  }

  /**
   * A surface's face as [left, top, width, height] relative to `bounds`
   * (client coordinates), in units of `scale` CSS pixels.
   */
  surfaceRect(surface, bounds, scale) {
    const rectangle = element => {
      const r = element.getBoundingClientRect();
      return [(r.left - bounds.left) / scale, (r.top - bounds.top) / scale, r.width / scale, r.height / scale];
    };
    const rect = rectangle(surface.element);
    if (surface.bounds) {
      const r = surface.bounds(surface.element.getBoundingClientRect());
      rect.splice(0, 4, (r.left - bounds.left) / scale, (r.top - bounds.top) / scale, r.width / scale, r.height / scale);
    }
    if (surface.clip) {
      const clip = rectangle(surface.clip), right = Math.min(rect[0] + rect[2], clip[0] + clip[2]), bottom = Math.min(rect[1] + rect[3], clip[1] + clip[3]);
      rect[0] = Math.max(rect[0], clip[0]); rect[1] = Math.max(rect[1], clip[1]);
      rect[2] = Math.max(0, right - rect[0]); rect[3] = Math.max(0, bottom - rect[1]);
    }
    const inset = Math.min((surface.inset ?? 0) / scale, Math.max(0, (Math.min(rect[2], rect[3]) - 1 / scale) / 2));
    rect[0] += inset; rect[1] += inset; rect[2] -= inset * 2; rect[3] -= inset * 2;
    return rect;
  }

  // Everything a draw of the client-space region `bounds`, at `width` ×
  // `height` device pixels, depends on besides the page's text relief. Baked tiles are
  // fingerprinted from these (baked-background.js), so anything a draw reads
  // belongs here.
  inputs(bounds, width, height) {
    const { settings, theme } = this;
    const scale = bounds.width / 1280;
    const logicalHeight = bounds.height / scale;
    const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
    const surfaces = this.options.surfaces ?? [
      { element: this.inset, height: 4, color: theme.floor, relief: .22, radius: 2 },
      { element: this.sheet, height: 30, color: settings.paper === 0 ? theme.paper : ['', '#f2f0e9', '#eee9dd', '#e7ddc9'][settings.paper], relief: settings.relief, radius: .7 }
    ];
    // Outer stack faces form exposed borders. Only the final face receives ink
    // or the background override; each nested DOM paper keeps its own outline.
    const topFaces = new Set(surfaces.filter((surface, i) => !surfaces.slice(i + 1).some(next => next.element === surface.element)));
    // Keep the surfaces within shadow reach of this draw, in page order.
    const reach = SHADOW_MARGIN * scale;
    const drawn = surfaces.filter(surface => {
      const r = surface.element.getBoundingClientRect();
      return r.bottom > bounds.top - reach && r.top < bounds.bottom + reach && r.right > bounds.left - reach && r.left < bounds.right + reach;
    });
    if (drawn.length > MAX_PAPER_SURFACES) {
      throw Error(`${drawn.length} paper surfaces fall within one ${Math.round(bounds.height)}px draw; the renderer supports ${MAX_PAPER_SURFACES} per draw`);
    }
    const rectangles = new Float32Array(MAX_PAPER_SURFACES * 4), properties = new Float32Array(MAX_PAPER_SURFACES * 3), pigments = new Float32Array((MAX_PAPER_SURFACES + 1) * 3);
    pigments.set(rgb(theme.desk));
    const effects = new Float32Array(MAX_PAPER_SURFACES * 4);
    const effectOrigins = new Float32Array(MAX_PAPER_SURFACES * 4);
    const effectRandomness = new Float32Array(MAX_PAPER_SURFACES * 4);
    drawn.forEach((surface, i) => {
      const rect = this.surfaceRect(surface, bounds, scale);
      rectangles.set(rect, i * 4);
      properties.set([surface.height, surface.relief ?? settings.relief,
        Math.min(surface.radius ?? .7, rect[2] / 2, rect[3] / 2)], i * 3);
      pigments.set(rgb(surface.color), (i + 1) * 3);
      // Treat the whole DOM section, including paper layers assigned to descendants.
      let effect = this.options.effects?.get(surface.element);
      let effectRoot = surface.element;
      if (!effect && this.options.effects) for (const [root, candidate] of this.options.effects) {
        if (root.contains(surface.element)) { effect = candidate; effectRoot = root; break; }
      }
      if (effect && topFaces.has(surface)) {
        if (effect.stock) pigments.set(rgb(effect.stock), (i + 1) * 3);
        effects.set([effect.kind, effect.amount, effect.reach, effect.shift], i * 4);
        effectRandomness.set(effect.randomness ?? [91, 0, .5, 0], i * 4);
        const focus = effect.focus.getBoundingClientRect();
        const area = effectRoot.getBoundingClientRect();
        effectOrigins.set([(focus.left + focus.width / 2 - bounds.left) / scale,
          (focus.top + focus.height / 2 - bounds.top) / scale, area.width / scale, area.height / scale], i * 4);
      }
    });
    // Measure in the document's coordinate system. scrollY can include an elastic
    // offset even when the sticky canvas and content have bounced together.
    // Their relative bounds cancel that shared motion without moving the texture.
    const documentTop = this.options.documentSpace
      ? (this.options.documentRoot ?? document.documentElement).getBoundingClientRect().top
      : bounds.top;
    const worldY = this.options.documentSpace ? (bounds.top - documentTop) / scale : 0;
    const lightHeight = this.options.lightSpace ? this.options.lightSpace.height / scale : logicalHeight;
    const sources = new Float32Array(16);
    settings.lights.forEach((light, i) => sources.set([
      light.x * 1280, light.y * lightHeight - (this.options.lightSpace ? worldY : 0),
      light.height * (bounds.width <= 650 ? Math.max(1, lightHeight / 850) : 1), light.intensity
    ], i * 4));
    return {
      width, height, scale, logicalHeight, worldY, drawn, rectangles, properties, pigments, effects, effectOrigins, effectRandomness, sources,
      lightKinds: new Float32Array([0, 1, 2, 3].map(i => settings.lights[i]?.type === 'distributed' ? 1 : 0)),
      lightRepeat: new Float32Array([lightHeight, worldY]),
      lightCount: settings.lights.length,
      depth: settings.depth * settings.paperHeight,
      grain: settings.grain,
      elevation: Math.max(12, ...drawn.map(surface => surface.height)),
      transparentBase: this.options.transparentBase ? 1 : 0,
      inkStructure: new Float32Array(this.options.inkStructure ?? [0, 0]),
    };
  }

  draw() {
    if (!this.program || this.destroyed || this.gl.isContextLost()) return;
    const { gl, canvas, uniforms } = this;
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio, this.interactive ? 1 : 2);
    const width = Math.round(bounds.width * dpr), height = Math.round(bounds.height * dpr);
    if (!width || !height) return;
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const frame = this.inputs(bounds, width, height);
    const { scale, logicalHeight, worldY, drawn, rectangles, properties } = frame;
    const rectangle = element => {
      const r = element.getBoundingClientRect();
      return [(r.left - bounds.left) / scale, (r.top - bounds.top) / scale, r.width / scale, r.height / scale];
    };
    this.drawSurfaces = drawn;
    const pixelsPerPoint = canvas.width / 1280;
    const text = this.prepareTextMask(bounds);
    this.prepareGeometry(rectangles, properties, drawn.length, pixelsPerPoint, text);
    this.prepareMicro(pixelsPerPoint, worldY);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.disable(gl.SCISSOR_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(this.program);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.viewport, 1280, logicalHeight);
    gl.uniform2f(uniforms.worldOffset, 0, worldY);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.geometryTarget.texture);
    gl.uniform1i(uniforms.geometryMap, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.microTarget?.texture ?? this.geometryTarget.texture);
    gl.uniform1i(uniforms.microMap, 1);
    gl.uniform2f(uniforms.geometryResolution, this.geometryTarget.width, this.geometryTarget.height);
    gl.uniform1f(uniforms.geometryPadding, this.geometryPadding);
    gl.uniform1f(uniforms.pixelsPerPoint, pixelsPerPoint);
    gl.uniform1i(uniforms.useMicroCache, this.cacheMicro ? 1 : 0);
    gl.uniform1f(uniforms.microRows, this.microTarget?.height ?? 1);
    gl.uniform1f(uniforms.microOriginX, this.microOriginX ?? 0);
    gl.uniform4fv(uniforms['surfaceRects[0]'], rectangles);
    gl.uniform3fv(uniforms['surfaceProperties[0]'], properties);
    gl.uniform1i(uniforms.surfaceCount, drawn.length);
    gl.uniform1f(uniforms.textRaise, text?.raise ?? 0);
    gl.uniform3fv(uniforms['pigments[0]'], frame.pigments);
    gl.uniform4fv(uniforms['surfaceEffects[0]'], frame.effects);
    gl.uniform4fv(uniforms['effectOrigins[0]'], frame.effectOrigins);
    gl.uniform4fv(uniforms['effectRandomness[0]'], frame.effectRandomness);
    gl.uniform1i(uniforms.transparentBase, frame.transparentBase);
    gl.uniform2fv(uniforms.inkStructure, frame.inkStructure);
    gl.uniform4fv(uniforms['lights[0]'], frame.sources);
    gl.uniform4fv(uniforms.lightKinds, frame.lightKinds);
    gl.uniform2fv(uniforms.lightRepeat, frame.lightRepeat);
    gl.uniform1i(uniforms.lightCount, frame.lightCount);
    gl.uniform1f(uniforms.depth, frame.depth);
    gl.uniform1f(uniforms.grain, frame.grain);
    gl.uniform1f(uniforms.maximumElevation, frame.elevation + (text?.raise ?? 0));
    if (this.options.renderBounds) {
      const r = rectangle(this.options.renderBounds), padding = 182;
      const left = Math.max(0, Math.floor((r[0] - padding) * pixelsPerPoint));
      const right = Math.min(canvas.width, Math.ceil((r[0] + r[2] + padding) * pixelsPerPoint));
      const top = Math.max(0, Math.floor((r[1] - padding) * pixelsPerPoint));
      const bottom = Math.min(canvas.height, Math.ceil((r[1] + r[3] + padding) * pixelsPerPoint));
      // Clear the prior overlay position, then shade only its possible coverage.
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.SCISSOR_TEST); gl.scissor(left, canvas.height - bottom, Math.max(0, right-left), Math.max(0, bottom-top));
    }
    gl.bindVertexArray(this.vertexArray);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.SCISSOR_TEST);
    if (this.inFlight) gl.deleteSync(this.inFlight);
    this.inFlight = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    this.stats.draws++;
  }

  createTarget(width, height, floating = false) {
    const gl = this.gl;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, floating ? gl.RGBA16F : gl.RG8, width, height, 0,
      floating ? gl.RGBA : gl.RG, floating ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.deleteFramebuffer(framebuffer);
      gl.deleteTexture(texture);
      throw Error('Paper material framebuffer is unavailable');
    }
    return { width, height, texture, framebuffer };
  }

  deleteTarget(target) {
    if (!target) return;
    this.gl.deleteFramebuffer(target.framebuffer);
    this.gl.deleteTexture(target.texture);
  }

  // Geometry map size: the canvas plus every possible shadow sample beyond it.
  geometrySize(pixelsPerPoint) {
    const margin = Math.ceil(SHADOW_MARGIN * pixelsPerPoint);
    return { margin, width: this.canvas.width + margin * 2, height: this.canvas.height + margin * 2 };
  }

  // Rasterize this draw's text relief into a mask the size of the geometry map:
  // red holds the signed relief (128 = none), alpha the glyph coverage.
  prepareTextMask(bounds) {
    const source = this.options.textRelief;
    if (!source || source.empty) return null;
    const pixelsPerPoint = this.canvas.width / 1280;
    const { margin, width, height } = this.geometrySize(pixelsPerPoint);
    const signature = source.signature();
    const key = JSON.stringify([signature, width, height, bounds.left, bounds.top, bounds.width]);
    if (this.textKey === key) return this.textState;
    this.textMaskCanvas ??= document.createElement('canvas');
    const mask = this.textMaskCanvas;
    if (mask.width !== width) mask.width = width;
    if (mask.height !== height) mask.height = height;
    const context = mask.getContext('2d');
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height);
    const k = this.canvas.width / bounds.width;
    context.setTransform(k, 0, 0, k, margin - bounds.left * k, margin - bounds.top * k);
    const reach = margin / k;
    const raise = source.draw(context, { top: bounds.top - reach, bottom: bounds.bottom + reach });
    const gl = this.gl;
    this.textTexture ??= gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.textTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Row 0 of the geometry map is the bottom of the page; flip the canvas to match.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, mask);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    this.textKey = key;
    this.textState = { texture: this.textTexture, raise, key };
    return this.textState;
  }

  prepareGeometry(rectangles, properties, count, pixelsPerPoint, text) {
    const gl = this.gl;
    const { margin, width, height } = this.geometrySize(pixelsPerPoint);
    if (!this.geometryTarget || this.geometryTarget.width !== width || this.geometryTarget.height !== height) {
      this.deleteTarget(this.geometryTarget);
      this.geometryTarget = this.createTarget(width, height);
      this.geometryKey = null;
    }
    const key = JSON.stringify([width, height, ...rectangles, ...properties.filter((_, i) => i % 3 !== 1), count, text?.key ?? null]);
    if (this.geometryKey === key) return;
    this.geometryKey = key;
    this.geometryPadding = margin / pixelsPerPoint;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.geometryTarget.framebuffer);
    gl.viewport(0, 0, width, height);
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(12 / 255, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.geometryProgram);
    const u = this.geometryUniforms;
    gl.uniform2f(u.mapResolution, width, height);
    gl.uniform1f(u.pixelsPerPoint, pixelsPerPoint);
    gl.uniform1f(u.padding, this.geometryPadding);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, text?.texture ?? null);
    gl.uniform1i(u.textMask, 0);
    gl.uniform1i(u.useTextMask, text ? 1 : 0);
    gl.enable(gl.SCISSOR_TEST);
    for (let i = 0; i < count; i++) {
      const r = rectangles.subarray(i * 4, i * 4 + 4);
      const left = Math.max(0, Math.floor(r[0] * pixelsPerPoint + margin));
      const right = Math.min(width, Math.ceil((r[0] + r[2]) * pixelsPerPoint + margin));
      const top = Math.max(0, Math.floor(r[1] * pixelsPerPoint + margin));
      const bottom = Math.min(height, Math.ceil((r[1] + r[3]) * pixelsPerPoint + margin));
      if (right <= left || bottom <= top) continue;
      gl.scissor(left, height - bottom, right - left, bottom - top);
      gl.uniform4fv(u.rectangle, r);
      gl.uniform3fv(u.properties, properties.subarray(i * 3, i * 3 + 3));
      gl.uniform1f(u.material, i + 1);
      gl.bindVertexArray(this.vertexArray);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.disable(gl.SCISSOR_TEST);
    this.stats.geometryBuilds++;
  }

  prepareMicro(pixelsPerPoint, worldY) {
    if (!this.cacheMicro) return;
    const gl = this.gl;
    const tileHeight = 256;
    let left = 0, right = this.canvas.width, top = 0, bottom = this.canvas.height;
    if (this.options.renderBounds) {
      const canvas = this.canvas.getBoundingClientRect(), r = this.options.renderBounds.getBoundingClientRect();
      const dpr = this.canvas.width / canvas.width;
      // Only actual material pixels need texture. Transparent shadow pixels
      // bypass microdetail in the final shader, so cache the panel alone.
      left = Math.max(0, Math.floor((r.left - canvas.left) * dpr) - 1);
      right = Math.min(this.canvas.width, Math.ceil((r.right - canvas.left) * dpr) + 1);
      top = Math.max(0, Math.floor((r.top - canvas.top) * dpr) - 1);
      bottom = Math.min(this.canvas.height, Math.ceil((r.bottom - canvas.top) * dpr) + 1);
    }
    const width = Math.max(1, right - left);
    const height = (Math.ceil(Math.max(1, bottom - top) / tileHeight) + 1) * tileHeight;
    if (!this.microTarget || this.microTarget.width !== width || this.microTarget.height !== height) {
      this.deleteTarget(this.microTarget);
      this.microTarget = this.createTarget(width, height, true);
      this.microSlots = new Map();
    }
    if (this.microOriginX !== left) this.microSlots.clear();
    this.microOriginX = left;
    const first = Math.floor((worldY * pixelsPerPoint + top) / tileHeight);
    const last = Math.floor((worldY * pixelsPerPoint + bottom) / tileHeight);
    const slots = height / tileHeight;
    const u = this.microUniforms;
    for (let tile = first; tile <= last; tile++) {
      const slot = ((tile % slots) + slots) % slots;
      if (this.microSlots.get(slot) === tile) continue;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.microTarget.framebuffer);
      gl.viewport(0, 0, width, height);
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(0, slot * tileHeight, width, tileHeight);
      gl.useProgram(this.microProgram);
      gl.uniform1f(u.pixelsPerPoint, pixelsPerPoint);
      gl.uniform1f(u.tileWorldY, tile * tileHeight);
      gl.uniform1f(u.tileSlotY, slot * tileHeight);
      gl.uniform1f(u.tileOriginX, left);
      gl.bindVertexArray(this.vertexArray);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      this.microSlots.set(slot, tile);
      this.stats.microTiles++;
    }
    gl.disable(gl.SCISSOR_TEST);
  }

  forgetResources() {
    this.inFlight = null;
    this.vertexArray = null;
    this.vertexBuffer = null;
    this.textTexture = null;
    this.textKey = null;
    this.program = null;
    this.geometryProgram = null;
    this.microProgram = null;
    this.geometryTarget = null;
    this.microTarget = null;
    this.geometryKey = null;
  }

  releaseResources() {
    for (const name of ['program', 'geometryProgram', 'microProgram']) {
      if (this[name]) this.gl.deleteProgram(this[name]);
      this[name] = null;
    }
    this.deleteTarget(this.geometryTarget);
    this.deleteTarget(this.microTarget);
    this.geometryTarget = null;
    this.microTarget = null;
    this.geometryKey = null;
    if (this.textTexture) this.gl.deleteTexture(this.textTexture);
    this.textTexture = null;
    this.textKey = null;
    if (this.inFlight) this.gl.deleteSync(this.inFlight);
    this.inFlight = null;
    if (this.vertexArray) this.gl.deleteVertexArray(this.vertexArray);
    if (this.vertexBuffer) this.gl.deleteBuffer(this.vertexBuffer);
    this.vertexArray = null;
    this.vertexBuffer = null;
  }

  suspend() {
    this.paused = true;
    cancelAnimationFrame(this.frame); this.frame = 0;
    this.deleteTarget(this.geometryTarget); this.deleteTarget(this.microTarget);
    this.geometryTarget = null; this.microTarget = null; this.geometryKey = null;
    if (this.textTexture) this.gl.deleteTexture(this.textTexture);
    this.textTexture = null; this.textKey = null; this.textMaskCanvas = null;
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    this.resize.disconnect();
    document.removeEventListener('visibilitychange', this.visibilityChanged);
    this.releaseResources();
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
