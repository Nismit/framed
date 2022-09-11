precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
float TAU = PI * 2.0;

#include ./utils/hsv2rgb.frag;
#include ./utils/cubicInOut.frag;

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

float squareSDF(vec2 p, float scale) {
  p = abs(p);
  float f1 = max(p.x, p.y) - scale;
  float f2 = max(p.x, p.y) - scale + 0.005;
  return max(f1, -f2);
}

float sdBox( vec2 p, vec2 b ) {
  vec2 d = abs(p)-b;
  return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float opRound( vec2 p, vec2 b, float r ) {
  return sdBox(p, b) - r;
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;
  // p *= 2.;

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = float(time) / 300.0;

  p = fract(p * 3.5) - 0.5;

  p *= (loop + 0.9);

  // p *= fract(p) * loop2 - 0.5;

  vec3 col;
  vec3 background = vec3(0.949,0.706,0.682);
  float thick = 0.05;
  float scale = 1.0;

  vec2 p2 = p * rotation(radians(360.0 * loop2));
  float dist = opRound(p2, vec2(0.18), 0.127);
  col += mix(vec3(1.), background, smoothstep(0.04, thick, dist));

  // for(int i = 0; i < 10; i++) {
  //   vec2 p2 = p * rotation(radians(360.0 * loop2));
  //   float dist = opRound(p2, vec2(0.18), 0.127);
  //   if (i == 0) {
  //     col += mix(vec3(1.), background, smoothstep(0.04, thick, dist));
  //     // col += mix(vec3(1.), background, dist);
  //   } else {
  //     // col += mix(vec3(1.), vec3(0.), smoothstep(0.022, thick, dist));
  //     // col += mix(vec3(1.), vec3(0.), dist);
  //   }
  //   scale -= 0.1;
  // }

  gl_FragColor = vec4(col, 1.0);
}
