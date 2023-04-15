precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
float TAU = PI * 2.0;

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

float Hash21(vec2 p){
	p = fract(p * vec2(190.615, 190.01)); // just put random number in vec2
	p += dot(p, p+15.6);
	return fract(p.x * p.y);
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
  float h = clamp( dot(p,ba)/dot(ba,ba), 0., r );

  // return length(p-ba*h) * sign(p.y*ba.x-p.x*ba.y);
	return (length(p-min(p.x+p.y,0.1)) - 0.07) * (sign(p.y*ba.x-p.x*ba.y) * 0.8);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

	float loop = sin(float(time) / 150.0) * 0.5 + 0.5;
  float loop2 = float(time) / 300.0;
	float loop3 = sin(TAU * (time - 0.75)/300.0)/2.0 + 1.0;
	float loop4 = sin(TAU * time/300.0)/2.0 + 0.5;
	vec3 col = vec3(0.);

	// p *= rotation(radians(-90.0 * loop2));

	vec3 base = vec3(0.851,0.561,0.749);
	vec3 sakura = vec3(0.949,0.808,0.941);

	p *= 5.0;
	vec2 id = floor(p);
	float random = Hash21(id);
	p = fract(p) - 0.5;
	p *= 2.0;
	float d = sdStar5(p * rotation(radians(90.0 * loop4 * random)) / (clamp(loop3, .1, 1.) * (clamp(random, .5, 2.))), .44, .55) - 0.1;

	// col = mix(base, sakura, res);
	col = base;
	col += clamp(vec3(.002/abs(d)), 0., 1.) * 1.5;
	col = mix( col, sakura, 1.0-smoothstep(0.0,0.02,abs(d)) );

	// col = pow( col, vec3(0.4545) );
	col /= float(1.01);

	gl_FragColor = vec4(col, 1.0);
}
