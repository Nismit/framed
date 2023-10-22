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

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  // float loop = sin(PI  * elapsedTime * 0.5) + 1.0;

  vec2 uv = p;

  vec3 finalColor = vec3(0.);

  for(int i = 0; i < 3; i++) {
    p = fract(p * 2.) - .5;

    vec2 absP = abs(p);
    float d = length(absP - min(absP.x + absP.y, 2.0) * .5) - .3;
    d += exp(-length(uv));

    // vec3 palA = vec3(0.320, 0.920, 0.880);
    // vec3 palB = vec3(0.215, 0.530, 0.240);
    // vec3 palC = vec3(0.357, 0.287, 1.440);
    // vec3 palD = vec3(1.728, 0.388, 0.949);

    vec3 palA = vec3(0.500, 0.500, 0.500);
    vec3 palB = vec3(0.300, 0.450, 0.500);
    vec3 palC = vec3(0.800, 0.800, 0.500);
    vec3 palD = vec3(0.000, 0.200, 0.500);

    vec3 col = palette(length(uv), palA, palB, palC, palD);

    d = cos(d * 10. + elapsedTime) / 8.;
    d = abs(d);

    d = 0.02/d;

    finalColor += col * d;
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
