precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define rot(a) mat2( cos(a), -sin(a), sin(a), cos(a) )
#define PI 3.14159265359
float TAU = PI * 2.0;

// https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb( in vec3 c ) {
  vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing
	return c.z * mix( vec3(1.0), rgb, c.y);
}

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

float random(vec2 co) {
  float a = 12.9898;
  float b = 78.233;
  float c = 43758.5453;
  float dt = dot(co.xy ,vec2(a,b));
  float sn = mod(dt,3.14);
  return fract(sin(sn) * c);
}

float arc(vec2 p, float inner, float outer, float startAngle, float endAngle) {
  float k = 0.01;
  float blend = smoothstep(inner, inner + k, length(p)) * smoothstep(outer, outer - k, length(p));

  float angle = (atan(p.y, p.x) + PI);
  float blendAngle = smoothstep(angle, angle - k, startAngle) * smoothstep(angle, angle + k, endAngle);

  return blend * blendAngle;
}

vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d ) {
  return a + b*cos( 6.28318*(c*t+d) );
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop = (float(time) / 300.0);
  float loop2 = (sin(TAU * (time  / 300.0))/2.0) + 0.5;
  // float loop3 = (float(time) / 300.0) * exp(float(time)/300.0);


  float brightness = 0.8;
  float k = 0.01;
  float innerRadius = 0.78;
  float outerRadius = 0.8;

  // https://www.shadertoy.com/view/Mtlyz7
  // float dist = length(p);
  // float inner = smoothstep(innerRadius, innerRadius + k, dist);
  // float outer = smoothstep(outerRadius, outerRadius - k, dist);
  // float blend = inner * outer;

  // float angle = (atan(p.y, p.x) + TAU);
  // float startEdge = smoothstep(angle, angle - k, PI * 0.997);
  // float endEdge = smoothstep(angle, angle + k, PI * (PI * loop2));
  // float blendAngle = startEdge * endEdge;

  // float a = arc(p, innerRadius, outerRadius, PI * 0.997, PI * (PI * loop2));
  // vec3 col = vec3(0.224,0.239,0.247);
  vec3 col = vec3(0.094,0.094,0.094);

  vec2 p1 = p * rotation(radians(360.0 * loop));
  vec2 p2 = p * rotation(radians(-360.0 * loop));

  // 0 ~ 3PI

  // for(int i = 0; i < 25; i++) {
  //   // vec3 color = palette(outerRadius, vec3(0.8, 0.5, 0.5), vec3(0.1, 0.1, 0.1),	vec3(0.3, 0.22, 1.0),	vec3(0.12, 0.25, 0.25));
  //   float bb = float(i) / 4.0;
  //   float end = 3.0 * PI * bb * loop2;
  //   float start = 0.;
  //   // float b = ((random(p) * 4.0) / 50.0) + 6.9;
  //   float a = arc(p1, innerRadius, outerRadius, start, end);
  //   col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  //   // col += mix(col, color, arc(p, innerRadius, outerRadius, PI * 0.997, PI * (PI * loop2)));
  //   innerRadius -= 0.05;
  //   outerRadius -= 0.05;
  // }

  float a = arc(p1, innerRadius, outerRadius, PI * 0.7, PI * 1.62);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,0.85));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p1, innerRadius, outerRadius, PI*1.0, PI*1.54);
  col += a * hsv2rgb(vec3(0.324 + outerRadius,0.89 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p2, innerRadius, outerRadius, PI*1.7, PI*1.9);
  col += a * hsv2rgb(vec3(0.324 + outerRadius,0.89 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p2, innerRadius, outerRadius, PI*1.0, PI*2.0);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p1, innerRadius, outerRadius, PI*1.7, PI*2.0);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p2, innerRadius, outerRadius, PI*0.8, PI*1.4);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p1, innerRadius, outerRadius, PI * 0.2, PI * 1.8);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p1, innerRadius, outerRadius, PI * 0.5, PI * 1.0);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p2, innerRadius, outerRadius, PI * 1.2, PI * 1.7);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p1, innerRadius, outerRadius, PI * 0.8, PI * 1.9);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p2, innerRadius, outerRadius, PI * 0.8, PI * 1.34);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p2, innerRadius, outerRadius, PI * 0.2, PI * 0.9);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p1, innerRadius, outerRadius, PI * 0.45, PI * 1.81);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p2, innerRadius, outerRadius, PI * 0.45, PI * 1.8);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  a = arc(p1, innerRadius, outerRadius, PI * 0.2, PI * 1.8);
  col += a * hsv2rgb(vec3(0.224 + outerRadius,0.339 + innerRadius,1.000));
  innerRadius -= 0.05;
  outerRadius -= 0.05;

  col /= brightness;

  gl_FragColor = vec4(col, 1.0);
}
