precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define rot(a) mat2( cos(a), -sin(a), sin(a), cos(a) )
#define PI 3.14159265359
float TAU = PI * 2.0;

// Ref: https://www.shadertoy.com/view/fdSBDD
float circle(vec2 uv, float blur) {
  return smoothstep(0., blur, 1. - length(uv));
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop = (float(time) / 300.0);
  float loop2 = (sin(TAU * (time  / 300.0))/2.0) + 0.5;
  vec3 col = vec3(0.);

  float brihgtness = 6.;
  float outerCircle = circle(p * 1.61, 1.);
  float innerCircle = circle(p * 1.95, .5);
  float a = (outerCircle - innerCircle) * brihgtness;

  a -= circle(vec2(p.x - sin(loop * TAU) * .55, 1.0 * p.y - cos(loop * TAU) * .65) * .8, 1.);

  // col += vec3(a);
  // col = vec3(a) * vec3(1., 0., 0.5);
  // col = vec3(a) * vec3(1., 0., 0.5);
  col = vec3(a) * vec3(0.2, 0.57, 0.91);
  col += vec3(smoothstep(0.58, 0.691, a));
  col += vec3(smoothstep(0.2, 0.92, a));

  gl_FragColor = vec4(col, 1.0);
}
