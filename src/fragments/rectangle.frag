precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
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

float EaseInOutQuad(float x) {
  //x < 0.5f ? 2 * x* x : 1 - pow(-2 * x + 2,2) /2;
  float inValue = 2.0 * x  *x;
  float outValue = 1.0- pow(-2.0 * x + 2.0,2.0) / 2.0;
  float inStep = step(inValue,0.5) * inValue;
  float outStep = step(0.5 , outValue ) * outValue;

  return inStep + outStep;
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

float opOnion(float sdf, float r) {
  return abs(sdf) - r;
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;
  p *= rotation(radians(45.0));

  // p = fract(p * 2.0) - 0.5;

  float loop = (float(time) / 300.0);
  float loop2 = (sin(TAU * (time  / 300.0))/2.0) + 0.5;

  vec3 col;
  vec3 background = vec3(0.,0.239,0.357);
  float thick = 0.01;

  col += mix(vec3(0.188,0.388,0.557), background, smoothstep(0., thick, squareSDF(p, (loop2 - 1.0) + 0.5)));
  col += mix(vec3(0.188,0.388,0.557), vec3(0.), smoothstep(0., thick, squareSDF(p, (loop2 - 1.0) + 0.7)));
  col += mix(vec3(0.82,0.286,0.357), vec3(0.), smoothstep(0., thick, squareSDF(p, (loop2 - 1.0) + 1.0)));
  col += mix(vec3(0.,0.475,0.549), vec3(0.), smoothstep(0., thick, squareSDF(p, (loop2 + 0.15))));
  col += mix(vec3(0.82,0.286,0.357), vec3(0.), smoothstep(0., thick, squareSDF(p, (loop2 - 0.5) + 0.9)));
  col += mix(vec3(0.929,0.682,0.286), vec3(0.), smoothstep(0., thick, squareSDF(p, (loop2 - 0.5) + 1.1)));

  gl_FragColor = vec4(col, 1.0);
}
