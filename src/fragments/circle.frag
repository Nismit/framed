precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

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

float circleSDF(vec2 p) {
  return length(p - .5) * 1.2;
}

float circle2(vec2 p, vec2 center, float radius, float width) {
  float r = length(p - center);
  float smooth1 = smoothstep(r - width/2.0 - 1.0, 1.0 + r - width/2.0, radius);
  float smooth2 = smoothstep(r + width/2.0 - 1.0, 1.0 + r + width/2.0, radius);
  return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
}

float circle3(vec2 uv, vec2 center, float radius, float width)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    d = normalize(d);
    float theta = 180.0*(atan(d.y,d.x)/PI);
    return smoothstep(2.0, 2.1, abs(mod(theta+2.0,45.0)-2.0)) *
        mix( 0.5, 1.0, step(45.0, abs(mod(theta, 180.0)-90.0)) ) *
        (SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius));
}

float stroke(float x, float s, float w) {
  float d = step(s, x+w*.5) - step(s, x-w*.5);
  return clamp(d, 0., 1.);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  vec3 col = vec3(0.);
  float d = 0.;

  float loop = sin(TWO_PI * (time - 0.75)/300.0)/2.0 + 0.5;
  float easing = cubicInOut( loop );
  float easing2 = EaseInOutQuad( loop );

  vec2 p1 = p * rotation(radians(360.0 * easing));

  int N = 3;
  float a = atan(p1.x, p1.y) + PI;
  float r = TWO_PI/float(N);

  vec3 blue = vec3(0.74,0.95,1.00);

  vec2 zoom = scale(vec2(easing2 - 1.0)) * p;
  vec2 zoom2 = scale(vec2(easing2 - 1.1)) * p;
  vec2 zoom3 = scale(vec2(easing - 0.5)) * p;

  col += stroke(circleSDF(zoom3 + 0.5), .12, .008) * blue;
  col += stroke(circleSDF(zoom3 + 0.5), .18, .008) * blue;
  col += stroke(circleSDF(zoom3 + 0.5), .15, .008) * blue;
  col += stroke(circleSDF(zoom2 + 0.5), .15, .01);
  col += stroke(circleSDF(zoom + 0.5), .18, .01);
  col += stroke(circleSDF(zoom + 0.5), .20, .01);


  gl_FragColor = vec4(col, 1. - length(p));
}
