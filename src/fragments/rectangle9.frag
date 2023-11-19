precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
float TAU = PI * 2.0;

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = float(time) / 300.0;

  vec3 col = vec3(0.);

  float x1 = -0.4;
  float y1 = 0.4;
  vec2 line1 = vec2(x1, y1);

  float x2 = 0.4;
  float y2 = 0.4;
  vec2 line2 = vec2(x2, y2);

  vec2 v1 = p - line1;
  vec2 v2 = p - line2;

  //
  float x3 = -0.4;
  float y3 = 0.3;
  vec2 line3 = vec2(x3, y3);

  float x4 = -0.4;
  float y4 = -0.3;
  vec2 line4 = vec2(x4, y4);

  vec2 v3 = p - line3;
  vec2 v4 = p - line4;

  //
  float x5 = 0.4;
  float y5 = 0.3;
  vec2 line5 = vec2(x5, y5);

  float x6 = 0.4;
  float y6 = -0.3;
  vec2 line6 = vec2(x6, y6);

  vec2 v5 = p - line5;
  vec2 v6 = p - line6;

  //
  float x7 = -0.4;
  float y7 = -0.4;
  vec2 line7 = vec2(x7, y7);

  float x8 = 0.4;
  float y8 = -0.4;
  vec2 line8 = vec2(x8, y8);

  vec2 v7 = p - line7;
  vec2 v8 = p - line8;

  col += smoothstep(0., 1.5, acos(dot(v1, v2) / (length(v1) * length(v2))) / PI) * clamp(loop, 0., 1.0);
  col += smoothstep(0., 1.5, acos(dot(v3, v4) / (length(v3) * length(v4))) / PI) * 0.8 * clamp(loop, 0., 1.0);
  col += smoothstep(0., 1.5, acos(dot(v5, v6) / (length(v5) * length(v6))) / PI) * 0.8 * clamp(loop, 0., 1.0);
  col += smoothstep(0., 1.5, acos(dot(v7, v8) / (length(v7) * length(v8))) / PI) * clamp(loop, 0., 1.0);
  // float ze = dot(v1, v2) * dot(v3, v4);
  // float fe = length(v1) * length(v2) * length(v3) * length(v4);
  // col += acos(ze / fe) / PI;
  // col += acos(dot(v3, v4) / (length(v3) * length(v4))) / PI;
  // col /= PI * 2.2;

  gl_FragColor = vec4(col, 1.0);
  // gl_FragColor = vec4(vec3(acos(0.9) / PI), 1.0);
  // gl_FragColor = vec4(vec3(dot(v1, v2)), 1.0);
  // gl_FragColor = vec4(vec3(length(v1) * length(v2)), 1.0);
}
