precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
float TAU = PI * 2.0;

#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))

#include ./utils/hsv2rgb.frag;
#include ./utils/cubicInOut.frag;

mat2 scale(vec2 _scale) {
  return mat2(_scale.x, 0.0, 0.0 ,_scale.y);
}

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

float stroke(float x, float s, float w) {
  float d = step(s, x+w*.5) - step(s, x-w*.5);
  return clamp(d, 0., 1.);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  vec3 col = vec3(0.);
  float d = 0.;
  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float easing = cubicInOut( float(time) / 300.0 );
  // p *= rotation(radians(360.0 * easing));

  vec2 p1 = p * rotation(radians(360.0 * loop));

  int N = 5;
  float a = atan(p1.x, p1.y) + PI;
  float r = TWO_PI/float(N);

  d = cos(floor(.5 + a/r) * r - a)*length(p1);
  float d2 = cos(floor(.5 + a/r) * r - a)*length(p1);
  col = vec3(1.0 - smoothstep(.2, .21, d));
  col += vec3(step(.15, d2) - 1.0);

  gl_FragColor = vec4(col, 1.);
}
