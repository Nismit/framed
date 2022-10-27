precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
float TAU = PI * 2.0;

#include utils/hsv2rgb.frag;
#include utils/cubicInOut.frag;

float scale = 6.0/PI;

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

float polygon(vec2 p, float scale, float width, int polygon) {
  float a = atan(p.x, p.y) + PI;
  float r = TWO_PI / float(polygon);
  float d = cos(floor(.5 + a/r) * r - a) * length(p);
  return step(scale, d) + (1. - step((scale - width), d));
  // Inner Polygon
  // return smoothstep(0., scale, d) + (1. - smoothstep(1., (scale - width), d));
  // Outer Polygon + diff?
  // return smoothstep(1., scale, d) - smoothstep(0., (scale - width), d);
}

vec2 logPolar(vec2 p) {
	return vec2(log(length(p)), atan(p.y, p.x));
}

vec2 getBaseCoordinate(vec2 p, float offset) {
  float speed = 1.;
	p *= scale;
	vec2 slideCoordinate = p - vec2(offset, 0.0) * speed;
	slideCoordinate = fract(slideCoordinate) * 2. - 1.;
	return slideCoordinate;
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop2 = float(time) / 300.0;
	vec3 col = vec3(1.);

	// p *= rotation(radians(90.0 * loop2));

	// Log Polar
	vec2 lp = logPolar(p);
	// Anti-Aliasing
	float aa = length(lp - logPolar(p + 1. / resolution)) * 35.;
	if(aa>1.) aa = 1.;
	vec2 baseCoord = getBaseCoordinate(lp, loop2);
	float shape = polygon(baseCoord, 1., .4, 8);
	vec3 res = vec3(shape);

	vec3 darkYellow = vec3(0.788,0.588,0.067) * 0.45;
	vec3 yellow = vec3(0.831,0.537,0.067);

	col = mix(darkYellow, yellow, res);
	// col = res;
	// col /= mix(col, purple, length(baseCoord));

	gl_FragColor = vec4(col, 1.0);
}
