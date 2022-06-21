precision highp float;
uniform float time;
uniform vec2 resolution;
uniform vec2 seed;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

// https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb_smooth( in vec3 c ) {
  vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing
	return c.z * mix( vec3(1.0), rgb, c.y);
}

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

float circleSDF(vec2 p) {
  return length(p - .5) * 1.2;
}

float stroke(float x, float s, float w) {
  float d = step(s, x+w*.5) - step(s, x-w*.5);
  return clamp(d, 0., 1.);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;
  vec3 col = vec3(0.);
  float d = 0.;
  float easing = cubicInOut( float(time) / 300.0 );
  // p *= rotation(radians(360.0 * easing));

  vec2 p1 = p * rotation(radians(360.0 * easing));

  int N = 3;
  float a = atan(p1.x, p1.y) + PI;
  float r = TWO_PI/float(N);

  d = cos(floor(.5 + a/r) * r - a)*length(p1);
  float d2 = cos(floor(.5 + a/r) * r - a)*length(p1);
  col = vec3(1.0 - smoothstep(.2, .21, d));
  col += vec3(step(.15, d2) - 1.0);

  col += stroke(circleSDF(p + 0.5), .5, .05);
  vec2 p2 = p * rotation(radians(45.0));
  float sdf1 = .5 + (p2.x - p2.y) * .5;
  float sdf2 = .5 + (p2.x - p2.y) * .5;
  col += stroke(sdf1, .1, .1);
  col += stroke(sdf2, .9, .1);

  gl_FragColor = vec4(col, 1.);
}
