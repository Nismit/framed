precision highp float;
uniform float time;
uniform float elapsedTime;
uniform float pixelRatio;
uniform vec2 resolution;

const float PI = acos(-1.);

// Ref: https://iquilezles.org/articles/palettes/
vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d ) {
  return a + b*cos( 6.28318*(c*t+d) );
}

// Ref: https://iquilezles.org/articles/distfunctions2d/
float sdBox( vec2 p, vec2 b ){
  vec2 d = abs(p)-b;
  return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float ndot(vec2 a, vec2 b ) { return a.x*b.x - a.y*b.y; }
float sdRhombus( vec2 p, vec2 b ) {
  p = abs(p);
  float h = clamp( ndot(b-2.0*p,b)/dot(b,b), -1.0, 1.0 );
  float d = length( p-0.5*b*vec2(1.0-h,1.0+h) );
  return d * sign( p.x*b.y + p.y*b.x - b.x*b.y );
}

float sdEquilateralTriangle( vec2 p, float r ) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - r;
  p.y = p.y + r/k;
  if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
  p.x -= clamp( p.x, -2.0*r, 0.0 );
  return -length(p)*sign(p.y);
}

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  vec2 uv = p;

  vec3 finalColor = vec3(0.);

  for(float i = 0.; i < 4.0; i++) {
    // p *= rotation(radians(60.0 * i));
    p = fract(p * 1.7) - .5;

    float d = 0.;
    d += max(-length(p), sdRhombus(p, vec2(.87, .87)));
    d *= length(p) * exp(-length(uv));

    // vec3 palA = vec3(0.330, 0.500, 0.500);
    // vec3 palB = vec3(0.000, 0.240, 0.240);
    // vec3 palC = vec3(1.050, 1.060, 1.000);
    // vec3 palD = vec3(0.000, -0.097, 1.097);

    vec3 palA = vec3(0.448, 0.400, 0.500);
    vec3 palB = vec3(0.210, 0.230, 0.240);
    vec3 palC = vec3(1.060, 1.110, 1.000);
    vec3 palD = vec3(-0.072, -0.247, 0.667);

    vec3 col = palette(length(uv) * i * .3, palA, palB, palC, palD);

    d = sin(d * 18. + elapsedTime * 0.52) / 6.;
    d = abs(d);

    d = 0.01/d;

    finalColor += col * d;
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
