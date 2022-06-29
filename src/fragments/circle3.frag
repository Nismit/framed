precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
float TAU = PI * 2.0;

#include ./utils/hsv2rgb.frag;
#include ./utils/cubicInOut.frag;

float circularOut(float t) {
  return sqrt((2.0 - t) * t);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
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
