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
float sdSegment( vec2 p, vec2 a, vec2 b, float r ) {
  vec2 pa = p-a, ba = b-a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h ) - r;
}

float sdEquilateralTriangle( vec2 p, float r ) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - r;
  p.y = p.y + r/k;
  if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
  p.x -= clamp( p.x, -2.0*r, 0.0 );
  return -length(p)*sign(p.y);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;
  vec2 uv = p;
  vec3 finalColor = vec3(0.);

  vec3 palA = vec3(0.448, 0.400, 0.500);
  vec3 palB = vec3(0.610, 0.030, 0.340);
  vec3 palC = vec3(0.860, 1.110, 1.000);
  vec3 palD = vec3(-0.072, -0.247, 0.367);

  for(float i = 0.; i < 3.0; i++) {
    p = fract(p * 1.6) - .5;

    float d = 0.;
    // d = pow(length( min(abs(p)-.8, 0.) ), length(abs(p) - .5));
    d = pow(length( abs(p) - .1 ), length(abs(p) - .5));
    d *= exp(abs(d));
    d *= mod(1. - length(uv), .45);

    vec3 col = palette(length(uv), palA, palB, palC, palD);

    d = sin(length(d) * 15. - elapsedTime * 0.8) / 0.8;
    d = 0.1 / d;
    d = abs(d);

    finalColor += col * d;
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
