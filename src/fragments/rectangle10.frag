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

float boxSDF(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.)) + min(max(d.x, d.y), 0.);
}

float squareSDF(vec2 p, float scale) {
  p = abs(p);
  float f1 = max(p.x, p.y) - scale;
  float f2 = max(p.x, p.y) - scale + 0.005;
  return max(f1, -f2);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = float(time) / 300.0;

  vec2 pr = p * rotation(radians(180.0 * loop));
  vec2 pr2 = p * rotation(radians(90.0 * loop));

  vec3 col = vec3(0.008,0.286,0.349);

  float d = step(0., boxSDF(pr, vec2(clamp(loop * 1.1, 0., 1.2))));
  col = mix(vec3(0.012,0.396,0.549), vec3(0.008,0.286,0.349), d);

  float d3 = step(0., boxSDF(pr, vec2(clamp((loop * 0.9) - 0.1, 0., .9))));
  col = mix(vec3(0.949,0.718,0.02), col, d3);

  float d2 = step(0., boxSDF(pr, vec2(clamp(loop - 0.5, 0., 1.))));
  col = mix(vec3(0.533,0.91,0.949), col, d2);

  float d4 = step(0., boxSDF(pr, vec2(clamp((loop * 0.8) - 0.3, 0., .8))));
  col = mix(vec3(0.949,0.529,0.02), col, d4);

  float d5 = step(0., boxSDF(pr2, vec2(clamp((loop * 0.7) - 0.4, 0., .7))));
  col = mix(vec3(0.651,0.125,0.078), col, d5);

  gl_FragColor = vec4(col, 1.0);
}
