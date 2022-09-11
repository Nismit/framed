precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
float TAU = PI * 2.0;

#include ./utils/hsv2rgb.frag;
#include ./utils/cubicInOut.frag;

float scale = 6.0/PI;

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

/**
Original (ref: https://www.osar.fr/notes/logspherical/)

// for visualization: smooth fract (from a comment by Shane)
float sFract(float x, float s) {
	float is = 1./s-0.99;
	x = fract(x);
	return min(x, x*(1.-x)*is)+s*0.5;
}

vec3 distanceGradient(float d, float aa) {
	// vec3 ret = vec3(sFract(abs(d*1.0), aa));
	// vec3 ret = vec3(fract(d));
	vec3 ret = vec3(d);
	// ret.x = 1. - smoothstep(-0.5*aa, 0.5*aa, d);
	// ret *= exp(-1.0 * abs(d));
	return ret;
}

float disk(vec2 pos) {
	return length(pos) - 0.3;
}

float polka(vec2 p, float offset) {
  float speed = 1.;
	p *= 6.0/PI;
	vec2 diskP = p - vec2(offset, 0.0) * speed;
	diskP = fract(diskP) * 2.0 - 1.;
	return disk(diskP);
}

vec3 logPolarPolka(vec2 p, float offset) {
	// p *= 1.5;
	vec2 lp = logPolar(p);
	// Anti-Aliasing
	float aa = length(lp - logPolar(p + 1. / resolution)) * 35.;
	if(aa>1.) aa = 1.;
	return distanceGradient(polka(lp, offset), aa);
  // return distanceGradient(pol, aa);
}
**/

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop2 = float(time) / 300.0;
	vec3 col = vec3(1.);

	// Log Polar
	vec2 lp = logPolar(p);
	// Anti-Aliasing
	float aa = length(lp - logPolar(p + 1. / resolution)) * 35.;
	if(aa>1.) aa = 1.;
	vec2 baseCoord = getBaseCoordinate(lp, loop2);
	float shape = polygon(baseCoord, 1., .15, 4);
	vec3 res = vec3(shape);

	vec3 purple = vec3(0.643,0.267,0.651);

	col = vec3(0.059,0.067,0.251);
	col /= mix(col, purple, length(baseCoord));

	gl_FragColor = vec4(col, 1.0);
}
