#version 300 es
precision highp float;
precision highp int;
out vec4 result;
uniform vec2 resolution;
uniform vec2 viewport;
uniform vec4 surfaceRects[MAX_PAPER_SURFACES];
uniform vec3 surfaceProperties[MAX_PAPER_SURFACES]; // elevation, texture relief, corner radius
uniform vec3 pigments[MAX_PAPER_SURFACES+1];
uniform vec4 surfaceEffects[MAX_PAPER_SURFACES];
uniform vec4 effectOrigins[MAX_PAPER_SURFACES];
uniform vec4 effectRandomness[MAX_PAPER_SURFACES];
uniform vec2 inkStructure;
uniform bool transparentBase;
uniform int surfaceCount;
uniform vec2 worldOffset;
uniform vec4 lights[4];
uniform vec4 lightKinds;
uniform vec2 lightRepeat; // reference viewport height, page-space Y offset
uniform int lightCount;
uniform float depth;
uniform float grain;
uniform float maximumElevation;
// MATERIAL_KERNELS
uniform sampler2D geometryMap;
uniform sampler2D microMap;
uniform vec2 geometryResolution;
uniform float geometryPadding;
uniform float pixelsPerPoint;
uniform bool useMicroCache;
uniform float microRows;
uniform float microOriginX;
vec2 geometryAt(vec2 p){
 ivec2 q=ivec2(floor((p+geometryPadding)*pixelsPerPoint));
 q.y=int(geometryResolution.y)-1-q.y;
 q=clamp(q,ivec2(0),ivec2(geometryResolution)-1);
 return round(texelFetch(geometryMap,q,0).rg*255.);
}
float heightAt(vec2 p){return geometryAt(p).r;}
// Conservative segment bounds skip ray work where no taller material can block it.
float rayMaximum(vec2 p,vec2 end){
 vec2 lo=min(p,end),hi=max(p,end);
 float maximum=12.;
 for(int i=0;i<MAX_PAPER_SURFACES;i++){
  if(i>=surfaceCount)break;
  vec4 r=surfaceRects[i];
  if(all(greaterThanEqual(hi,r.xy))&&all(lessThanEqual(lo,r.xy+r.zw)))maximum=max(maximum,surfaceProperties[i].x);
 }
 return maximum*depth;
}
// Each distributed rig repeats the original point lights along the page.
// Neighboring stations crossfade with zero endpoint slope and constant energy.
// Only two nearby copies are evaluated, regardless of document length.
vec4 sourceAt(vec2 p,int index,int sampleIndex){
 vec4 source=lights[index];
 if(lightKinds[index]>.5){
  float spacing=lightRepeat.x*.5;
  float cell=(p.y+lightRepeat.y)/spacing;
  float blend=smoothstep(0.,1.,fract(cell));
  int row=int(floor(cell))-1+sampleIndex;
  source.x+=(tex_hash(row,index,20913)-.5)*102.4;
  source.y+=float(row)*spacing+(tex_hash(row,index,8311)-.5)*spacing*.12;
  source.w*=sampleIndex==0?1.-blend:blend;
 }else{
  if(sampleIndex>0)source.w=0.;
 }
 return source;
}
float visibility(vec2 p,float z,vec4 source){
 if(z>=maximumElevation*depth)return 1.;

 vec2 delta=source.xy-p;
 float horizontal=sqrt(dot(delta,delta)+.001);
 vec2 direction=delta/horizontal;
 float slope=source.z/horizontal;
 float reach=clamp(64.*depth/slope,1.,180.);
 float maximum=rayMaximum(p,p+direction*(reach+.6));
 if(maximum<=z+.125)return 1.;
 float unit=1.;
 for(int step=1;step<=32;step++){
  float d=.6+reach*float(step*step)/1024.;
  float penumbra=.75+d*.55;
  if(slope>.55&&z+d*slope-maximum>=penumbra)break;
  float obstacle=heightAt(p+direction*d)*depth;
  if(obstacle>z+.125){unit=min(unit,clamp((z+d*slope-obstacle+penumbra)/(2.*penumbra),0.,1.));if(unit==0.)break;}
 }
 return unit*unit*(3.-2.*unit);
}
vec3 greenInk(vec3 stock,vec2 p,int material){
 if(material==0)return stock;
 vec4 effect=surfaceEffects[material-1];
 if(effect.x<.5||effect.y<=0.)return stock;
 vec4 origin=effectOrigins[material-1];
 vec2 local=p-origin.xy;
 vec4 variation=effectRandomness[material-1];
 int seed=int(round(variation.x));
 float rowSize=mix(2.,8.,effect.w)*pow(9.,variation.z-.5);
 int row=int(floor(local.y/rowSize));
 float noise=tex_hash(row,31,seed);
 float packet=tex_hash(int(floor(float(row)/3.)),13,seed+137);
 float pair=mod(float(row),2.)<1.?1.:-1.;
 vec2 displaced=local+vec2((noise-.5)*46.*effect.w,pair*rowSize*(1.+floor(noise*3.))*effect.w);
 displaced+=vec2((packet-.5)*180.,(noise-.5)*rowSize*16.)*variation.y;
 vec2 q=displaced;
 float distance=length(q)/max(1.,min(origin.z,origin.w));
 float envelope=1.-smoothstep(.18,effect.z,distance);
 if(inkStructure.y>0.){
  // Irregular lobes and detached packets push the same halo into broken islands.
  float angle=atan(q.y,q.x);
  float lobes=1.+inkStructure.y*(sin(angle*5.+float(seed)*.013)*.3+sin(angle*11.+packet*6.)*.18);
  envelope=1.-smoothstep(.18,effect.z,distance*lobes);
  vec2 island=q-vec2((packet-.5)*effect.z,(noise-.5)*.8)*min(origin.z,origin.w);
  float detached=1.-smoothstep(.05,effect.z*.42,length(island)/max(1.,min(origin.z,origin.w)));
  envelope=max(envelope*(1.-inkStructure.y*.25),detached*inkStructure.y);
 }
 float ink=0.;
 if(effect.x<1.5){
  // A radial ink field whose neighboring scan rows exchange source positions.
  ink=floor(envelope*12.+noise*.65)/12.;
  ink*=mix(.65,1.,step(.18,noise));
 }else if(effect.x<2.5){
  // Broken scanlines: the radius controls their density rather than a clean fade.
  float line=step(.36,fract(local.y/rowSize));
  ink=line*step(noise,envelope)*(.3+.7*envelope);
 }else{
  // Two misregistered radial screens, printed as fine rings and stippled ink.
  float ring=step(.68,fract(distance*18.+(noise-.5)*effect.w));
  float dots=step(.52,tex_hash(int(floor(local.x/2.)),int(floor(local.y/2.)),seed+622));
  ink=envelope*(.2+.65*ring+.15*dots);
 }
 float fleck=tex_hash(int(floor(local.x/2.)),int(floor(local.y/2.)),seed+983);
 ink*=mix(1.,smoothstep(.15+variation.w*.6,.3+variation.w*.6,fleck),variation.w);
 float tear=tex_hash(int(floor(local.x/mix(28.,85.,packet))),int(floor(float(row)/2.)),seed+1709);
 ink*=mix(1.,smoothstep(inkStructure.x*.65,inkStructure.x*.65+.12,tear),inkStructure.x);
 return mix(stock,vec3(0.,.8,.533333333),clamp(ink*effect.y,0.,1.));
}
void main(){
 // Use the geometry map's pixel scale for both viewport and baked tiles.
 vec2 p=vec2(gl_FragCoord.x,resolution.y-gl_FragCoord.y)/pixelsPerPoint;
 vec2 geometry=geometryAt(p);
 float z=geometry.r;
 int material=int(geometry.g);
 // Transparent overlay pixels contain only occlusion; material texture and
 // diffuse lighting cannot contribute to their black shadow color.
 if(transparentBase&&material==0){
  float weight=0.,visible=0.;
  for(int i=0;i<4;i++){
   if(i>=lightCount)break;
   for(int sampleIndex=0;sampleIndex<2;sampleIndex++){
    vec4 source=sourceAt(p,i,sampleIndex);if(source.w<=0.)continue;
    weight+=source.w;visible+=source.w*visibility(p,z*depth,source);
   }
  }
  result=vec4(0.,0.,0.,weight>0.?(1.-visible/weight)*.47:0.);return;
 }
 vec2 uv=(p+worldOffset)/1.1;
 int seed=14483; // round(0.221 * 65535), the native pressed-paper seed.
 float h;
 vec2 micro;
 if(useMicroCache){
  vec2 worldPixel=(p+worldOffset)*pixelsPerPoint;
  ivec2 q=ivec2(floor(worldPixel.x)-microOriginX,int(mod(floor(worldPixel.y),microRows)));
  vec3 detail=texelFetch(microMap,q,0).rgb;
  micro=detail.xy;h=detail.z;
 }else{
  h=tex_height(uv.x,uv.y,seed);
  float t=.25;
  micro=vec2(tex_height(uv.x+t,uv.y,seed)-tex_height(uv.x-t,uv.y,seed),tex_height(uv.x,uv.y+t,seed)-tex_height(uv.x,uv.y-t,seed))/(2.*t*1.1);
 }
 micro*=material==0?.18:surfaceProperties[material-1].y;
 vec2 pixel=vec2(1./pixelsPerPoint);
 vec2 gradient=vec2(heightAt(p+vec2(pixel.x,0.))-heightAt(p-vec2(pixel.x,0.)),heightAt(p+vec2(0.,pixel.y))-heightAt(p-vec2(0.,pixel.y)))*depth+micro*grain;
 float n=sqrt(1.+dot(gradient,gradient));
 float total=0.,diffuseSum=0.,directSum=0.;
 for(int i=0;i<4;i++){
  if(i>=lightCount)break;
  for(int sampleIndex=0;sampleIndex<2;sampleIndex++){
   vec4 source=sourceAt(p,i,sampleIndex);if(source.w<=0.)continue;
   vec2 delta=source.xy-p;
   float norm=sqrt(dot(delta,delta)+.001+source.z*source.z);
   float diffuse=.8+.2*clamp((source.z-dot(gradient,delta))/(n*norm),0.,1.);
   float visible=visibility(p,z*depth,source);
   total+=source.w;diffuseSum+=source.w*diffuse;directSum+=source.w*diffuse*visible;
  }
 }
 float diffuse=total>0.?diffuseSum/total:1.;
 float shade=1.07*(.53*diffuse+.47*directSum/max(1.,total)+grain*.4*h);
 vec3 pigment=greenInk(pigments[material],p,material);
 result=vec4(floor(clamp(pigment*shade*255.,0.,255.))/255.,1.);
}
