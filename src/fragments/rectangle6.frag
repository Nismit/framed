precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
float TAU = PI * 2.0;

#include ./utils/hsv2rgb.frag;
#include ./utils/cubicInOut.frag;

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = float(time) / 300.0;
  float rotate = radians(360.0 * loop2);

  // https://www.shadertoy.com/view/tdcGDf
  float a = atan(p.y,p.x);

  // modified distance metric
  float r = length(p)*cos(mod(a+.785, 1.57)-0.785);

  // index texture by (animated inverse) radius and angle
  vec2 uv = vec2(1.0/r + 0.1 * loop2, a + loop2 / 1.9 + .5/r);

  // pattern: stripes
  vec2 gv = fract(5.*uv/3.14)-.5;
  float d = abs(abs(gv.x+gv.y)-.5);
  float f = smoothstep(.01, -.01, d-.25);

  vec3 palette = hsv2rgb(vec3(0.5870,0.6087,0.2065));
  vec3 blue1 = vec3(0.016,0.467,0.749);
  vec3 blue2 = vec3(0.682,0.827,0.949);

  // color fetch: palette
  vec3 col = .2 + (.5 * sin(f + blue1));

  // lighting: light at end of the tunnel
  col = 0.5 + (col / r) / 5.;

  gl_FragColor = vec4(col, 1.0);
}
