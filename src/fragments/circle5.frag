precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
float TAU = PI * 2.0;

mat2 scale(vec2 _scale) {
  return mat2(_scale.x, 0.0, 0.0 ,_scale.y);
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

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;

  vec2 p2 = p * 3.0;
  p2 = fract(p2);

  vec3 color = palette(p.y, vec3(0.8, 0.5, 0.4), vec3(0.2, 0.4, 0.2),	vec3(2.0, 0.3, 1.0),	vec3(0.00, 0.25, 0.25));
  vec3 color2 = palette(p.x, vec3(1.0, 1.0, 1.0), vec3(0.2, 0.4, 1.0),	vec3(2.0, 0.3, 0.1),	vec3(0.00, 0.25, 0.25));

  // vec3 col = vec3(0.74, 0.95, 1.00);
  vec3 col = vec3(0.);
  col += clamp(0.0, 1.0, circleSDF(p2, loop));
  col *= mix(color, color2, loop);

  gl_FragColor = vec4(col, 1.0);
}
