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

void main( void ) {
  // vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  // p.x *= resolution.x / resolution.y;

  vec2 p = (2. * gl_FragCoord.xy - resolution.xy) / resolution.x;

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = float(time) / 300.0;

  // https://www.shadertoy.com/view/XlsfzH
  float threshold = .018;
  vec2 n = (floor(p / .3)) * .3 + 0.15;

  float size = sin((loop + pow(length(n), 3.5)) * 1.8) * 1.3;
  vec2 t = p - n;
  t /= abs(size) + .4;
  float d = length(max(abs(t) - .050, 0.));

  vec3 col = hsv2rgb(vec3(0.4777, 0.456 / (size + .05), 0.851));
  vec3 base = vec3(0.494,0.541,0.722);
  float v = smoothstep(threshold + .01, threshold, d);
  vec3 res = mix(base, col, v);

  gl_FragColor = vec4(res, 1.0);
}
