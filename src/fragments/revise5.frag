precision highp float;
uniform float time;
uniform float elapsedTime;
uniform float pixelRatio;
uniform vec2 resolution;

#define rot(a) mat2(cos(a), -sin(a), sin(a), cos(a))

const float PI = acos(-1.);
const float TAU = PI * 2.0;

// Ref: https://iquilezles.org/articles/palettes/
vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d ) {
  return a + b*cos( 6.28318*(c*t+d) );
}

float sdBox( vec2 p, vec2 b ){
  vec2 d = abs(p)-b;
  return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float sdHexagon( vec2 p, float r ) {
  const vec3 k = vec3(-0.866025404,0.5,0.577350269);
  p = abs(p);
  p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
  p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
  return length(p)*sign(p.y);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy * (2.0 / pixelRatio)  - resolution.xy) / min(resolution.x, resolution.y);
  vec2 uv = p;
  vec3 finalColor = vec3(0.);

  vec3 palA = vec3(0.448, 0.400, 0.500);
  vec3 palB = vec3(0.610, 0.030, 0.340);
  vec3 palC = vec3(0.860, 1.110, 1.000);
  vec3 palD = vec3(-0.072, -0.247, 0.367);

  // モワッと広がる動きっぽい
  // p /= exp(mod(time*10.,3.14159));
	// rz *= pow(abs((0.1-circ(p))),.9);

  // p /= exp(mod(elapsedTime *.5, PI)) * sin(elapsedTime *.5);

  for(float i = 0.; i < 3.0; i++) {

    p = fract(p * 1.5) - .5;


    float d = 0.;
    float f = smoothstep(length(abs(p)) - .1, sdBox(sin(uv * PI * (i + .5)) * .3, vec2(.55, .55)), sdHexagon(p, .33));
    d += f + f;
    d *= exp(-length(uv));

    d = cos(d * 5. + elapsedTime * .8) / .5;
    d = abs(d);
    d = 0.1 / d;

    vec3 col = palette(f / .9 + length(p), palA, palB, palC, palD);

    finalColor += col * d;
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
