precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define rot(a) mat2( cos(a), -sin(a), sin(a), cos(a) )
#define PI 3.14159265359
float TAU = PI * 2.0;

#include ./utils/hsv2rgb.frag;
#include ./utils/cubicInOut.frag;

// Ref: https://www.shadertoy.com/view/fdSBDD
float circle(vec2 uv, float blur) {
  return smoothstep(0., blur, 1. - length(uv));
}

float circleSDF(vec2 p) {
  return length(p - .5) * 1.2;
}

float stroke(float x, float s, float w) {
  float d = step(s, x+w*.5) - step(s, x-w*.5);
  return clamp(d, 0., 1.);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop = (float(time) / 300.0);
  float loop2 = (sin(TAU * (time  / 300.0))/2.0) + 0.5;

  vec2 pc = vec2(p + 0.5);
  vec3 col = vec3(0.224,0.239,0.247);

  float size = 1.0;

  for(int i = 0; i < 20; i++) {
    vec2 pc2 = vec2(pc.x + sin(loop * TAU) * 0.02 * (float(i) + 0.01), pc.y + cos(loop * TAU) * 0.02 * (float(i) + 0.01));
    // pc2 *= 0.2;
    // pc2 += 0.3;
    col += stroke(circleSDF(pc2), size, 0.01);
    size -= 0.05;
  }

  col *= vec3(0.329,0.416,0.482);
  col = mix(col, vec3(0.224,0.239,0.247), 0.8);

  // https://www.shadertoy.com/view/lsKSWR
  // p *= 2. - p.xy;
  // float vignette = p.x * p.y * 15.0;
  // vignette = pow(vignette, 0.15);

  gl_FragColor = vec4(col, 1.0);
}
