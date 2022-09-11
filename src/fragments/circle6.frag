precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
float TAU = PI * 2.0;

#include ./utils/hsv2rgb.frag;
#include ./utils/cubicInOut.frag;

mat2 scale(vec2 _scale) {
  return mat2(_scale.x, 0.0, 0.0 ,_scale.y);
}

float noise( in vec2 p ) {
  return sin(p.x) * sin(p.y);
}
float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

float circleSDF(vec2 p, float anim) {
  vec2 d = p - vec2(0.5);
  d *= scale(vec2(0.5)) * (anim + 0.5);
  // float r = length(d);
  float r = length(p);
  float size = 0.01; // 0 - 0.5 | 0.6 overrap
  // return 1.0 - smoothstep(size, size + (size*0.001), dot(d, d) * 2.) * step(0.01, r) * step(r, 0.48);
  return 1.0 - smoothstep(size, size + (size*0.001), dot(d, d) * 2.);
}

vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d ) {
  return a + b*cos( 6.28318*(c*t+d) );
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float smoothFactor = 1./resolution.y * 5. * 2.;

  // float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = (time / 300.0);
  // float loop3 = sin(TAU * ((time - 0.75) / 300.0))/2.0 + 0.5;
  float loop4 = (sin(TAU * ((time - 55.0) / 300.0))/2.0) + 0.5;
  vec3 col;

  vec3 color = palette(p.y, vec3(0.8, 0.5, 0.5), vec3(0.1, 0.1, 0.1),	vec3(0.3, 0.22, 1.0),	vec3(0.12, 0.25, 0.25));
  vec3 color2 = palette(p.x, vec3(1.0, 1.0, 1.0), vec3(0.2, 0.4, 1.0),	vec3(2.0, 0.3, 0.1),	vec3(0.00, 0.25, 0.25));

  vec2 grid = p * 10.0;
  vec2 id = ceil(grid);

  grid.y -= loop2 * 3. * (rand(vec2(id.x)) * 0.93 + .5);
  grid.y += ceil(mod(id.x, 3.)) * 0.3 * loop2;
  // grid.y = 0.5;
  vec2 subgrid = fract(grid) - 0.5;

  grid = ceil(grid);
  float g = length(subgrid);

  float circle = rand(grid) * 0.5;
  circle *= step(0.1, circle);
  float circleFill = smoothstep(circle, circle-smoothFactor, g);
  circle *= 0.9;
  circleFill -= smoothstep(circle, circle-smoothFactor, g);

  col = mix(hsv2rgb(vec3(0.6, 0.583, 0.18)), color, circleFill * loop4);

  gl_FragColor = vec4(col, 1.0);
}
