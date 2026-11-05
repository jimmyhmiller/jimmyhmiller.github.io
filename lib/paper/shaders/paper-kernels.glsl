// Generated from lib/paper/src/texture.coil. Do not edit.
float tex_hash(int x,int y,int seed) {
  uint a=((uint(x) * uint(374761393)) ^ (uint(y) * uint(668265263)) ^ (uint(seed) * uint(1274126177)));
  uint b=((a ^ (a >> uint(13))) * uint(1274126177));
  return (float(((b ^ (b >> uint(16))) & uint(65535))) / 65535.0);
}
float tex_fract(float x) {
  return (x - floor(x));
}
float tex_abs(float x) {
  return ((x < 0.0)?(0.0 - x):x);
}
float tex_min(float x,float y) {
  return ((x < y)?x:y);
}
float tex_max(float x,float y) {
  return ((x > y)?x:y);
}
float tex_smooth(float x) {
  float t=tex_max(0.0,tex_min(1.0,x));
  return ((t * t) * (3.0 - (2.0 * t)));
}
float tex_mix(float a,float b,float t) {
  return (a + ((b - a) * t));
}
float tex_noise(float x,float y,int seed) {
  int ix=int(floor(x));
  int iy=int(floor(y));
  float u=tex_smooth(tex_fract(x));
  float v=tex_smooth(tex_fract(y));
  return (tex_mix(tex_mix(tex_hash(ix,iy,seed),tex_hash((ix + 1),iy,seed),u),tex_mix(tex_hash(ix,(iy + 1),seed),tex_hash((ix + 1),(iy + 1),seed),u),v) - 0.5);
}
float tex_height(float x,float y,int seed) {
  float u=(x + (1.4 * tex_noise((x / 5.0),(y / 5.0),(seed + 7))));
  float v=(y + (1.4 * tex_noise((x / 5.0),(y / 5.0),(seed + 13))));
  float ridge=(1.0 - tex_smooth((4.5 * tex_abs(tex_noise((u / 1.7),(v / 0.85),seed)))));
  return (((0.22 * ridge) - 0.11) + ((0.13 * tex_noise((x * 2.1),(y * 2.1),(seed + 19))) + (0.045 * tex_noise((x / 7.0),(y / 7.0),(seed + 29)))));
}
