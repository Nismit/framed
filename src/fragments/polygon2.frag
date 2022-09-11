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

float polygon(vec2 p, float scale, float width, int polygon) {
  float a = atan(p.x, p.y) + PI;
  float r = TWO_PI / float(polygon);
  float d = cos(floor(.5 + a/r) * r - a) * length(p);
  // return step(scale, d) + (1. - step((scale - width), d));
  // Inner Polygon
  // return smoothstep(0., scale, d) + (1. - smoothstep(1., (scale - width), d));
  // Outer Polygon + diff?
  return smoothstep(1., scale, d) - smoothstep(0., (scale - width), d);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  vec3 col = vec3(1.);

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = float(time) / 300.0;
  float easing = cubicInOut( float(time) / 300.0 );
  // p *= rotation(radians(180.0 * loop));
  p *= rotation(radians(90.0));

  // vec2 p1 = p * rotation(radians(180.0 * loop));
  // vec2 p1 = p;
  vec2 p1 = p * scale(vec2(1.0 * loop));
  vec2 p2 = p * scale(vec2(1.0 * (loop - 1.0) - .1));
  vec2 p3 = p * scale(vec2(1.0 * loop));

  // int N = 6;
  // float scale = .4;
  // float width = .005;
  // float a = atan(p1.x, p1.y) + PI;
  // float r = TWO_PI/float(N);

  // float d = cos(floor(.5 + a/r) * r - a) * length(p1);
  // float pentagon = step(scale, d) + (1. - step((scale - width), d));


  float o = polygon(p1, .4, .1, 6);
  vec3 v = mix(mix(vec3(1.), vec3(0.), o), vec3(0.), length(p) - 0.3);
  // vec3(0.851,0.702,0.255)
  col = mix(smoothstep(vec3(0.851,0.702,0.255), col, v), vec3(0.), o);

  float o2 = polygon(p2, .4, .1, 6);
  vec3 v2 = mix(mix(vec3(0.43), vec3(0.), o2), vec3(0.2), length(p) * 0.5);
  col = mix(smoothstep(vec3(0.475,0.682,0.949), vec3(0.), v2), col, o2);


  gl_FragColor = vec4(col, 1.);
}
