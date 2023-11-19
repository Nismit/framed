precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
float TAU = PI * 2.0;

float scale = 6.0/PI;

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

float polygon(vec2 p, float scale, float width, int polygon) {
  float a = atan(p.x, p.y) + PI;
  float r = TWO_PI / float(polygon);
  float d = cos(floor(.5 + a/r) * r - a) * length(p);
  // return step(scale, d) + (1. - step((scale - width), d));

	vec3 colorA = vec3(0.149,0.141,0.912);
	vec3 colorB = vec3(1.000,0.833,0.224);

  // Inner Polygon
  return smoothstep(0., scale, d) + (1. - smoothstep(1., (scale - width), d));
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

// Ref: https://iquilezles.org/articles/distfunctions2d/
// Star 5 - exact   (https://www.shadertoy.com/view/3tSGDy)
float sdStar5(vec2 p, float r, float rf) {
  const vec2 k1 = vec2(0.809016994375, -0.587785252292);
  const vec2 k2 = vec2(-k1.x,k1.y);
  p.x = abs(p.x);
  p -= 2.0*max(dot(k1,p),0.0)*k1;
  p -= 2.0*max(dot(k2,p),0.0)*k2;
  p.x = abs(p.x);
  p.y -= r;
  vec2 ba = rf*vec2(-k1.y,k1.x) - vec2(0,1);
  float h = clamp( dot(p,ba)/dot(ba,ba), 0.0, r );

  return length(p-ba*h) * sign(p.y*ba.x-p.x*ba.y);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop2 = float(time) / 300.0;
	vec3 col = vec3(1.);

	p *= rotation(radians(90.0 * loop2));

	// Log Polar
	vec2 lp = logPolar(p);
	// Anti-Aliasing
	float aa = length(lp - logPolar(p + 1. / resolution)) * 35.;
	if(aa>1.) aa = 1.;
	vec2 baseCoord = getBaseCoordinate(lp, loop2);
	// float shape = polygon(baseCoord, 1., .8, 5);
	// vec3 res = vec3(shape);
	// res[0] = length(res[0] - 0.5);

	float d = sdStar5(baseCoord, .4, .55);

	vec3 res = vec3(step(0., -d));
	res += clamp(vec3(.003/d), 0., 1.) * 15.;

	// vec3 shapeCol = res + darkOrange;
	// vec3 shapeCol2 = mix(darkOrange, res, vec3(0.5));

	// col = shapeCol / vec3(1.);
	col = res;

	gl_FragColor = vec4(col, 1.0);
}
