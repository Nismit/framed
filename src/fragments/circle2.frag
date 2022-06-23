precision highp float;
uniform float time;
uniform vec2 resolution;
uniform vec2 seed;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))

mat2 scale(vec2 _scale) {
  return mat2(_scale.x, 0.0, 0.0 ,_scale.y);
}

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

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
  vec2 p = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;

  vec3 col = vec3(0.);
  float d = 0.;
  float easing = cubicInOut( float(time) / 300.0 );
  float easing2 = EaseInOutQuad( sin(PI * (time/300.0)) );

  vec2 p1 = p * rotation(radians(360.0 * easing));

  int N = 3;
  float a = atan(p1.x, p1.y) + PI;
  float r = TWO_PI/float(N);

  vec3 blue = vec3(0.74,0.95,1.00);

  // vec2 zoom = scale(vec2(easing - 1.0)) * p;
  // vec2 zoom2 = scale(vec2(easing - 1.1)) * p;
  // vec2 zoom3 = scale(vec2(easing - 0.5)) * p;
  // vec2 zoom4 = scale(vec2(easing - 0.3)) * p;
  // vec2 zoom5 = scale(vec2(easing)) * p;

  vec2 zoom = scale(vec2(easing - (1.0 + 0.181))) * p;
  vec2 zoom2 = scale(vec2(easing - (1.0 + 0.18))) * p;
  vec2 zoom3 = scale(vec2(easing - (1.0 + 0.038))) * p;
  vec2 zoom4 = scale(vec2(easing - (1.0 + 0.08149))) * p;
  vec2 zoom5 = scale(vec2(easing - 1.0)) * p;

  col += stroke(circleSDF(zoom3 + 0.5), .1, .001) * blue;
  col += stroke(circleSDF(zoom2 + 0.5), .148, .001);
  col += stroke(circleSDF(zoom + 0.5), .028, .001);
  col += stroke(circleSDF(zoom + 0.5), .238, .001);
  col += stroke(circleSDF(zoom4 + 0.5), .22, .001);
  col += stroke(circleSDF(zoom3 + 0.5), .17, .001);
  col += stroke(circleSDF(zoom4 + 0.5), .05, .001);
  col += stroke(circleSDF(zoom5 + 0.5), .08, .001);
  // col += stroke(circleSDF(zoom2 + 0.5), .02, .001);

  gl_FragColor = vec4(col, easing2);
}
