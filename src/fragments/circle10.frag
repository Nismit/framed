precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
float TAU = PI * 2.0;

#include ./utils/hsv2rgb.frag;
#include ./utils/cubicInOut.frag;

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop = (float(time) / 300.0);
  float loop2 = (sin(TAU * (time  / 300.0))/2.0) + 0.5;
  // float loop3 = (float(time) / 300.0) * exp(float(time)/300.0);

  vec2 ps = p * 50.0;
  ps = fract(ps) - 0.5;

  float s = (sin(loop2 * 9.0 - length(p * 2.4) * 5.0) * 0.35);
  float m = smoothstep(s, s - 0.01, length(ps)) + s;

  vec3 col = vec3(0.463,0.843,0.769) * m;

  gl_FragColor = vec4(col, 1.0);
}
