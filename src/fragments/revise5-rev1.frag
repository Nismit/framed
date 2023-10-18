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

// Ref: https://iquilezles.org/articles/distfunctions2d/
float sdCircle( vec2 p, float r ) {
  vec2 absP = abs(p);
  return length(p) - r;
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy * (2.0 / pixelRatio)  - resolution.xy) / min(resolution.x, resolution.y);
  vec2 uv = p;
  vec3 finalColor = vec3(0.);

  vec3 palA = vec3(0.448, 0.400, 0.500);
  vec3 palB = vec3(0.610, 0.030, 0.340);
  vec3 palC = vec3(0.860, 1.110, 1.000);
  vec3 palD = vec3(-0.072, -0.247, 0.367);

  // Center lighting ball
  finalColor += 0.05 / length(p);

  p *= 3.;

  // モワッと広がる動きっぽい
  // p /= exp(mod(time*10.,3.14159));
	// rz *= pow(abs((0.1-circ(p))),.9);

  float amplitude = 2.4;
  float w = 1.;
  float phase = 0.3;

  // p *= rot(radians(28.8 * elapsedTime));

  for(float i = 0.; i < 10.0; i++) {
    float slipTime = elapsedTime * .5;
    float py = amplitude * sin(w * slipTime - phase + (i * .2));
    float px = -amplitude * sin(w * slipTime * 2. - phase + (i * .3));

    vec2 anim = vec2(p.x + px, p.y + py);

    vec2 absP = anim;
    float d = length(absP - min(absP.x + absP.y, .9)) * 1.2;
    d += smoothstep(.4, .1, length(uv) - d);
    d *= exp(-length(abs(uv)));

    d = 0.02 / d;
    d = abs(d);

    vec3 col = palette(anim.x * anim.y / length(p), palA, palB, palC, palD);

    finalColor += col * smoothstep(.0, 1., d);
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
