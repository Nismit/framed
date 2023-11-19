precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
float TAU = PI * 2.0;

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

mat2 scale(vec2 _scale) {
  return mat2(_scale.x, 0.0, 0.0 ,_scale.y);
}

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

mat3 translate2d(float x, float y) {
  return mat3(
    1.0, 0.0, 0,
    0.0, 1.0, 0,
    -x, -y, 1.0);
}

float polygon(vec2 p, float scale, float width, int polygon) {
  float a = atan(p.x, p.y) + PI;
  float r = TWO_PI / float(polygon);
  float d = cos(floor(.5 + a/r) * r - a) * length(p);
  return step(scale, d) + (1. - step((scale - width), d));
  // Inner Polygon
  // return smoothstep(0., scale, d) + (1. - smoothstep(1., (scale - width), d));
  // Outer Polygon + diff?
  // return smoothstep(1., scale, d) - smoothstep(0., (scale - width), d);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  vec3 col = vec3(0.008,0.137,0.251);

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = float(time) / 300.0;
  float easing = cubicInOut( float(time) / 300.0 );
  // p *= rotation(radians(180.0 * loop));
  p *= rotation(radians(90.0 * loop));
  // p = fract(p * 2.7) - 0.5;
  vec2 translate = vec2(0.1 * loop, 0.5 * loop);

  // vec2 p1 = p * rotation(radians(180.0 * loop));
  // vec2 p1 = p;
  vec2 p1 = p * scale(vec2(1.0 * loop));
  vec2 p2 = p * scale(vec2(1.0 * (loop - 1.0) - .1));
  vec2 p3 = p * scale(vec2(1.0 * loop));


  vec3 col1 = vec3(0.851,0.537,0.537);
  float o = polygon(p, loop - 0.5, clamp(0., 0.08, loop), 6);
  // vec3 v = mix(mix(vec3(1.), vec3(0.), o), col1, length(p));
  // vec3(0.851,0.702,0.255)
  // col = mix(smoothstep(col1, col, v), vec3(0.), o);
  col = mix(col1, col, o);

  p *= rotation(radians(-90.0 * loop));
  p *= rotation(radians(90.0));

  vec3 col2 = vec3(0.949,0.686,0.627);
  float o2 = polygon(p, (loop - 0.5) + .2, (loop * 0.1) + .002, 6);
  col = mix(col2, col, o2);

  vec3 col3 = vec3(0.18,0.565,0.651);
  float o3 = polygon(p, (loop - 0.34) + .28, (loop * 0.13) + .005, 6);
  col = mix(col3, col, o3);

  vec3 col4 = vec3(0.039,0.333,0.451);
  float o4 = polygon(p, (loop - 0.3) + .52, (loop * 0.2), 6);
  col = mix(col4, col, o4);


  gl_FragColor = vec4(col, 1.);
}
