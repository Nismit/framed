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

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  vec2 uv = p;

  vec3 finalColor = vec3(0.);

  for(int i = 0; i < 2; i++) {
    p = fract(p * 4.) - .5;
    p *= rotation(radians(60.0));

    float d = 0.;
    d += smoothstep(1., sdBox(p, vec2(.95, .95)), length(uv));
    d /= exp(-length(uv));

    vec3 palA = vec3(0.610, 0.550, 0.670);
    vec3 palB = vec3(0.388, 0.440, 0.370);
    vec3 palC = vec3(0.510, 0.540, 0.620);
    vec3 palD = vec3(3.400, 2.953, 4.025);

    // vec3 palA = vec3(0.320, 0.920, 0.880);
    // vec3 palB = vec3(0.215, 0.530, 0.240);
    // vec3 palC = vec3(0.357, 0.287, 1.440);
    // vec3 palD = vec3(1.728, 0.388, 0.949);

    vec3 col = palette(length(p), palA, palB, palC, palD);

    d = cos(d * 4. + elapsedTime) / 1.;
    d = abs(d);

    d = 0.02/d;

    finalColor += col * d;
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
