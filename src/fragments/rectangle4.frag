precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
float TAU = PI * 2.0;

#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))

#include ./utils/hsv2rgb.frag;
#include ./utils/cubicInOut.frag;

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

float squareSDF(vec2 p, float scale) {
  p = abs(p);
  float f1 = max(p.x, p.y) - scale;
  float f2 = max(p.x, p.y) - scale + 0.01;
  return max(f1, -f2);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop = (float(time) / 300.0);
  float loop2 = (sin(TAU * (time  / 300.0))/2.0) + 0.5;

  float thick = 0.02;
  float scale = 0.5;
  float rad = 45.0;

  vec2 ro = p * rotation(radians(rad * (loop2 + 0. * 0.1)));
  vec2 ro2 = p * rotation(radians(rad));

  vec3 hsv = hsv2rgb(vec3(0.54, 0.38, 0.72));

  vec3 col = mix(hsv, vec3(0.298,0.396,0.443), smoothstep(0., thick, squareSDF(ro2, scale)));
  // vec3 col;
  for(int i = 1; i < 10; i++) {
    ro = p * rotation(radians(rad * (loop2 + float(i * 2) * 0.1)));
    col += mix(hsv, vec3(0.), smoothstep(0., thick, squareSDF(ro, scale)));
    thick -= 0.001;
    scale -= 0.05;
    rad += 4.5;
    hsv.g -= 0.07;
  }

  gl_FragColor = vec4(col, 1.0);
}
