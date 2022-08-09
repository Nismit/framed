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

  vec3 col = vec3(0.004,0.275,0.149);

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = float(time) / 300.0;
  float easing = cubicInOut( float(time) / 300.0 );
  p *= rotation(radians(180.0 * loop));

  // vec2 p1 = p * rotation(radians(180.0 * loop));
  vec2 p1 = p * scale(vec2(1.0 * loop));
  vec2 p2 = p * scale(vec2(1.0 * (loop - 0.15) - .1));
  vec2 p3 = p * scale(vec2(1.0 * loop));

  int N = 5;
  float scale = .4;
  float width = .005;
  float a = atan(p1.x, p1.y) + PI;
  float r = TWO_PI/float(N);

  float d = cos(floor(.5 + a/r) * r - a) * length(p1);
  float pentagon = step(scale, d) + (1. - step((scale - width), d));
  // col = vec3(1.0 - smoothstep(.1, .11, d));
  // col += smoothstep(1., 0., d);
  col = mix(vec3(0.851,0.702,0.255), col, pentagon);

  scale -= .1;
  float d2 = cos(floor(.5 + a/r) * r - a) * length(p2);
  float pentagon2 = step(scale, d2) + (1. - step((scale - width), d2));
  col = mix(vec3(0.925,0.855,0.631), col, pentagon2);

  // scale -= .1;
  float d5 = cos(floor(.5 + a/r) * r - a) * length(p1);
  float pentagon5 = step(scale, d5) + (1. - step((scale - width), d5));
  col = mix(vec3(0.957,0.863,0.584), col, pentagon5);

  scale -= .1;
  float d3 = cos(floor(.5 + a/r) * r - a) * length(p2);
  float pentagon3 = step(scale, d) + (1. - step((scale - width), d));
  col = mix(vec3(0.925,0.835,0.553), col, pentagon3);

  scale -= .1;
  float d4 = cos(floor(.5 + a/r) * r - a) * length(p3);
  float pentagon4 = step(scale, d4) + (1. - step((scale - width), d4));
  col = mix(vec3(0.973,0.922,0.769), col, pentagon4);
  // col += step(0.4, d);
  // col += 1. - step(.38, d);

  gl_FragColor = vec4(col, 1.);
}
