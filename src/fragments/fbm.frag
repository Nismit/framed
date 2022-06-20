precision highp float;
uniform float time;
uniform vec2 resolution;
uniform vec2 seed;

#define PI 3.14159265359
#define NUM_OCTAVES 5

// https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb_smooth( in vec3 c ) {
  vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing
	return c.z * mix( vec3(1.0), rgb, c.y);
}

float EaseInOutQuad(float x) {
  //x < 0.5f ? 2 * x* x : 1 - pow(-2 * x + 2,2) /2;
  float inValue = 2.0 * x  *x;
  float outValue = 1.0- pow(-2.0 * x + 2.0,2.0) / 2.0;
  float inStep = step(inValue,0.5) * inValue;
  float outStep = step(0.5 , outValue ) * outValue;

  return inStep + outStep;
}

float noise( in vec2 p ) {
  return sin(p.x) * sin(p.y);
}

// // Hash13 Hash without Sine: https://www.shadertoy.com/view/4djSRW
float hash(vec2 p, float t) {
  vec3 p3 = vec3(p, t);
  p3  = fract(p3*0.1031);
  p3 += dot(p3, p3.zyx+31.32);
  return fract((p3.x+p3.y)*p3.z);
}

float hashNoise(vec2 p, float t) {
  vec4 b = vec4(floor(p), ceil(p));
  vec2 f = smoothstep(0.0, 1.0, fract(p));
  return mix(mix(hash(b.xy, t), hash(b.zy, t), f.x), mix(hash(b.xw, t), hash(b.zw, t), f.x), f.y);
}

const mat2 m = mat2(0.5, 0.5, -0.5, 0.5);
// const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

// https://iquilezles.org/articles/fbm/
float fbm(vec2 p) {
  float v = 0.0;
  float s = 1.0;
  float a = 0.5;
  float t = 0.0;
  for(int i=0; i < NUM_OCTAVES; i++) {
    t += a;
    // v += noise(p * s) * a;
    v += hashNoise(p * s, float(i)) * a;
    s *= 2.0;
    a *= 0.5;
    p = p * m;
  }

  return v/t;
}

float func(vec2 p) {
  float easing = EaseInOutQuad( sin(PI * (time/300.0)) );
  // p += 0.5 + length(p);
  // float f = fbm(p, -0.5) * fbm(p, 0.5);
  float f = fbm(p + fbm(p * (easing + 0.0001 )));
  return f;
}


void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;

  // float easing = EaseInOutQuad( sin(PI * (time/300.0)) );

  // vec2 warp = vec2(0.2);
  // warp = warp * fbm(p);

  vec3 col = vec3(0.);
  // col = mix(hsv2rgb_smooth(vec3(0.5870,0.6087,0.2065)), vec3(0.3,0.05,0.05), func(p * 8.0) );
  // col = mix(hsv2rgb_smooth(vec3(0.5870,0.6087,0.2065)), vec3(0.3,0.05,0.05), func(p * 8.0) );
  // col = mix( col, vec3(0.99, 0.99, 0.99), dot(warp.x, warp.y));
  col = mix( hsv2rgb_smooth(vec3(0.956, 0.7872, 0.6978)), hsv2rgb_smooth(vec3(0.956, 0.7872, 0.9038)), func(p * 1.2));
  col = mix( col, hsv2rgb_smooth(vec3(0.4913,0.5000,0.9022)), func(p * 2.1) );
  // col = mix( col, vec3(0.99, 0.99, 0.99), dot(warp.x, warp.y));

  gl_FragColor = vec4(col, 1.);
}
