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

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;
  vec3 col = vec3(0.);
  float d = 0.;
  float easing = cubicInOut( float(time) / 300.0 );
  p *= rotation(radians(360.0 * easing));

  int N = 3;

  float a = atan(p.x, p.y) + PI;
  float r = TWO_PI/float(N);



  d = cos(floor(.5 + a/r) * r - a)*length(p);

  col = vec3(1.0 - smoothstep(.2, .21, d));

  gl_FragColor = vec4(col, 1.);
}
