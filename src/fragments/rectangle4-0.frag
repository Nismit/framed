precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
float TAU = PI * 2.0;

#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))

#include ./utils/hsv2rgb.frag;
#include ./utils/cubicInOut.frag;

float noise( in vec2 p ) {
  return sin(p.x) * sin(p.y);
}

float random(vec2 co) {
  float a = 12.9898;
  float b = 78.233;
  float c = 43758.5453;
  float dt= dot(co.xy ,vec2(a,b));
  float sn= mod(dt,3.14);
  return fract(sin(sn) * c);
}

float random2 (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.98,78.2)))* 4.5);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop = (float(time) / 300.0);
  float loop2 = (sin(TAU * (time  / 300.0))/2.0) + 0.5;

  vec2 id = floor(p * 3.0);
  // vec2 rand3 = floor(p) * vec2(random(p) * 10.);

  // Need to random access each cell
  // Ref: https://www.shadertoy.com/view/MsXSzM
  float rand = 1.0 - mod(0.1, 1.0);
  rand = min(max(rand * 0.8, 0.1), 2.0);

  vec2 r = fract(p * 3.0);
  r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
  // float s = rand * 1.0 - pow(min(1.0, 10.0 * dot(r, r)), 2.0);
  // float s = 1.0 - pow(min(1.0, 3.0 * distance(vec2(0.), r)), 2.0);
  float s = rand * 1.0 - pow(min(1.0, 3.0 * distance(vec2(0.), r)), 2.0);

  vec3 col = vec3(0.984,0.592,0.557) * s;

  gl_FragColor = vec4(col, 1.0);
}
