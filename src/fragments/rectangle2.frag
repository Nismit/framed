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
  p *= rotation(radians(45.0));

  p = fract(p * 2.5);

  float loop = (float(time) / 300.0);
  float loop2 = (sin(TAU * (time  / 300.0))/2.0) + 0.5;

  vec3 col;
  vec3 background = vec3(0.,0.239,0.357);
  float thick = 0.5;

  float squareDist = length((floor(p) + vec2(0.5)) - vec2(6.0));
  float dist = 2.0 * min(min(p.x, 1.0 - p.x), min(p.y, 1.0 - p.y));

  float edge = fract(squareDist) * (loop2 + 0.1);
  float val = fract(dist * 3.);
  val = mix(val, 1.0 - val, step(1., edge));
  edge = pow(abs(1.0 - edge), 2.0);
  val = smoothstep(edge, edge, 0.8 * val);

  vec3 pantoneGrey = vec3(0.576,0.584,0.592);
  vec3 pantoneYellow = vec3(0.961,0.875,0.302);

  col += mix(pantoneYellow, pantoneGrey, val);
  col *= 0.9;

  gl_FragColor = vec4(col, 1.0);
}
