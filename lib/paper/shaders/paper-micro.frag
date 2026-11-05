#version 300 es
precision highp float;
precision highp int;
out vec4 result;
uniform float pixelsPerPoint;
uniform float tileWorldY;
uniform float tileSlotY;
uniform float tileOriginX;
// MATERIAL_KERNELS
void main(){
 vec2 p=vec2(gl_FragCoord.x+tileOriginX,tileWorldY+gl_FragCoord.y-tileSlotY)/pixelsPerPoint;
 vec2 uv=p/1.1;
 int seed=14483;
 float t=.25;
 float h=tex_height(uv.x,uv.y,seed);
 vec2 micro=vec2(tex_height(uv.x+t,uv.y,seed)-tex_height(uv.x-t,uv.y,seed),tex_height(uv.x,uv.y+t,seed)-tex_height(uv.x,uv.y-t,seed))/(2.*t*1.1);
 result=vec4(micro,h,1.);
}
