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
	float a = atan(baseCoord.y, baseCoord.x);
	float b = abs(cos(a*3.));
	// float b = cos(a*3.);
	vec3 res = vec3(b);

	vec3 purple = vec3(0.643,0.267,0.651);

	// col = vec3( 1. - smoothstep(b, b + 0.02, length(baseCoord)));
	col = mix(purple, vec3(0.059,0.067,0.251), res);
	col = res;
	// col /= mix(col, purple, length(baseCoord));

	gl_FragColor = vec4(col, 1.0);
}
