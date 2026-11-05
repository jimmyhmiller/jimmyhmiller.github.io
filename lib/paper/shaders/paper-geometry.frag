#version 300 es
precision highp float;
out vec4 result;
uniform vec2 mapResolution;
uniform float pixelsPerPoint;
uniform float padding;
uniform vec4 rectangle;
uniform vec3 properties;
uniform float material;
void main(){
 vec2 p=vec2(gl_FragCoord.x,mapResolution.y-gl_FragCoord.y)/pixelsPerPoint-padding;
 float radius=properties.z;
 vec2 q=abs(p-rectangle.xy-rectangle.zw*.5)-(rectangle.zw*.5-radius);
 float distance=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
 if(distance>=0.)discard;
 result=vec4(properties.x/255.,material/255.,0.,1.);
}
