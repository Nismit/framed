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


  float loop = (float(time) / 300.0);
  float loop2 = (sin(TAU * (time  / 300.0))/2.0) + 0.5;


  p *= rotation(radians(45.0 * loop2));
  vec2 zoom = scale(vec2(loop2 + 0.4)) * p;

  // p = fract(p * 2.5);

  float grid = 4.;
  vec2 ip = floor(zoom * grid);

  // float angle = 45.0;
  // float edge = 2.71;
  // float brightness = 0.9;

  // vec3 col = vec3(1.);
  // col *= mix(col, vec3(1.), (cos(vec3(ip.x) / angle * PI + vec3(ip.y) / edge) + loop2));
  // col *= mix(col, vec3(0.984,0.592,0.557), (cos(vec3(ip.x) / angle * PI + vec3(ip.y) * edge) + loop2));
  // col /= brightness;


  float angle = 45.0;
  float edge = 1.812;
  float brightness = 0.9;
  vec3 col = vec3(0.984,0.592,0.557) * cos(vec3(ip.x) / angle * PI + vec3(ip.y) / edge) + loop2;


  // float angle = 45.0;
  // float edge = 5.01;
  // float brightness = 0.9;

  // vec3 col = vec3(0.812,0.882,0.871) * (cos(vec3(ip.x) / angle * PI + vec3(ip.y) - edge) + loop2) - 0.25;
  // col += mix(col, vec3(0.984,0.592,0.557), (cos(vec3(ip.x) / angle * PI + vec3(ip.y) + edge) + loop2 * 0.5));
  // // col /= brightness;

  gl_FragColor = vec4(col, 1.0);
}
