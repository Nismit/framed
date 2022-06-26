precision highp float;
uniform float time;
uniform vec2 resolution;
uniform vec2 seed;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
float TAU = PI * 2.0;

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

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
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
  vec2 c = resolution.xy/2.0;
  vec3 col = vec3(0.);
  float d = 0.;
  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float easing = cubicInOut( float(time) / 300.0 );
  // p *= rotation(radians(360.0 * easing));

  vec2 p1 = p * rotation(radians(360.0 * loop));

  int N = 5;
  float a = atan(p1.x, p1.y) + PI;
  float r = TWO_PI/float(N);

  d = cos(floor(.5 + a/r) * r - a)*length(p1);
  float d2 = cos(floor(.5 + a/r) * r - a)*length(p1);
  col = vec3(1.0 - smoothstep(.2, .21, d));
  col += vec3(step(.15, d2) - 1.0);

  vec2 zoom = scale(vec2(loop)) * p;

  // col += stroke(circleSDF(zoom + 0.5), .1, .01);
  // col += stroke(circleSDF(zoom + 0.5), .2, .01);
  // col += circle3(gl_FragCoord.xy, c, 313.0, 4.0) * vec3(0.74,0.95,1.00);
  // vec2 p2 = p * rotation(radians(45.0));
  // float sdf1 = .5 + (p2.x - p2.y) * .5;
  // float sdf2 = .5 + (p2.x - p2.y) * .5;
  // col += stroke(sdf1, .1, .1);
  // col += stroke(sdf2, .9, .1);

  gl_FragColor = vec4(col, 1.);
}
