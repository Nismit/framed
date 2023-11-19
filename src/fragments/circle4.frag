precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
float TAU = PI * 2.0;

// https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb( in vec3 c ) {
  vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing
	return c.z * mix( vec3(1.0), rgb, c.y);
}

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

float circularOut(float t) {
  return sqrt((2.0 - t) * t);
}

vec2 tunnel(vec2 uv, float size, float time) {
  vec2 p  = -1.0 + (2.0 * uv);
  float a = atan(p.y, p.x);
  float r = sqrt(dot(p, p));
  return vec2(a / PI, time + (size / r));
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = float(time) / 300.0;
  float rotate = radians(360.0 * loop2);

  // vec3 col = vec3(0.74, 0.95, 1.00);
  vec3 col = vec3(0.);

  // https://www.shadertoy.com/view/4st3WX
  float f = 1.0 / length(p);
  f += atan(p.x, p.y) / acos(0.);
  f -= loop2;
  f = 1. - clamp(sin(f * TAU) * dot(p,p) * resolution.y / 15.0 + .5, 0., 1.);
  f *= sin(length(p) - .1);

  // float u = sin((atan(p.y, p.x) + rotate * 0.5) * 20.0) * 0.005;
  // float t = 0.01 / abs(0.3 + u - length(p));
  // col += t * hsv2rgb(vec3(0.046, 0.799, 0.675));

  // float u2 = sin((atan(p.y, p.x) + -rotate * 0.5) * 25.0) * (loop * 0.05);
  // float t2 = 0.01 / abs(0.9 + u2 - length(p));

  // col += t2 * hsv2rgb(vec3(0.247, 0.811, 0.208));

  // col += f * hsv2rgb(vec3(0.046, 0.799, 0.675));
  col = mix(hsv2rgb(vec3(0.8565,0.2283,0.5348)),  hsv2rgb(vec3(0.5870,0.6087,0.2065)), f);

  gl_FragColor = vec4(col, 1.0);
}
