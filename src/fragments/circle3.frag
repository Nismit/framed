precision highp float;
uniform float time;
uniform vec2 resolution;
uniform vec2 seed;

#define PI 3.14159265359
float TAU = PI * 2.0;

// https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb_smooth( in vec3 c ) {
  vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing
	return c.z * mix( vec3(1.0), rgb, c.y);
}

float circularOut(float t) {
  return sqrt((2.0 - t) * t);
}

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;

  float easing = circularOut( float(time) / 300.0 );
  float easing2 = cubicInOut( sin(PI * (time/150.0)) );

  float r = length(p) * 2.0;
  vec3 col = vec3(0.74,0.95,1.00);

  float a = r*r;
  float b = sin(r * 0.8 - 1.6);
  float c = sin(r - 0.01);
  // float s = sin(a - (float(time) / 150.0) * 3.0 + b) * c;
  // float s = sin(a - (float(time) / 300.0) * 3.0 + b) * c;
  // float s = sin(a - (float(time) / 300.0) * 3.0) * c;
  // float s = sin(a - float(time) / 300.0 * 3.0);
  float s = sin(a - loop * 3.0 + b) * c;

  col *= abs(1.0 / (s * 10.)) - 0.01;

  gl_FragColor = vec4(col, 1.0);
}
