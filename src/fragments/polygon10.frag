precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
float TAU = PI * 2.0;

#include utils/hsv2rgb.frag;
#include utils/cubicInOut.frag;

float scale = 6.0/PI;

mat2 scaleSize(vec2 _scale) {
  return mat2(_scale.x, 0.0, 0.0 ,_scale.y);
}

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

float stroke(float x, float s, float w) {
  float d = step(s, x+w*.5) - step(s, x-w*.5);
  return clamp(d, 0., 1.);
}

// Ref: https://iquilezles.org/articles/distfunctions2d/
float sdCircle( vec2 p, float r ) {
 return length(p) - r;
}

float sdEquilateralTriangle( in vec2 p ) {
  // const float k = sqrt(3.0);
  const float offset = 0.30;
  const float k = 1.73205;
  p.x = abs(p.x) - 1.0;
  p.y = (p.y + offset) + 1.0/k;
  if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
  p.x -= clamp( p.x, -2.0, 0.0 );
  return -length(p)*sign(p.y);
}

float sdBox( in vec2 p, in vec2 b ) {
  vec2 d = abs(p)-b;
  return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float ndot(vec2 a, vec2 b ) { return a.x*b.x - a.y*b.y; }
float sdRhombus( in vec2 p, in vec2 b ) {
  p = abs(p);
  float h = clamp( ndot(b-2.0*p,b)/dot(b,b), -1.0, 1.0 );
  float d = length( p-0.5*b*vec2(1.0-h,1.0+h) );
  return d * sign( p.x*b.y + p.y*b.x - b.x*b.y );
}

void main( void ) {
  // vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  // p.x *= resolution.x / resolution.y;

	float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = float(time) / 300.0;
	vec3 col = vec3(1.);

  p *= rotation(radians(90.0 * smoothstep(0., .5, loop) ));

  float pulse = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;

  vec2 zoom = scaleSize(vec2(1.5 * pulse)) * p;
  vec2 pan = scaleSize(vec2(0.9 / (pulse + 0.5))) * p;


  float circle = sdCircle(p, 0.5);
  float triangle = sdEquilateralTriangle(p * 1.76);
  float box = sdBox(zoom, vec2(0.5, 0.5));
  float rhombus = sdRhombus(pan, vec2(0.5, 0.5));
  vec3 bg = vec3(0.239,0.251,0.227);
  vec3 fill = vec3(0.522,0.6721,0.949);

  col = bg;

  col = mix(fill, bg,
          mix(
            1. - exp(-8. * abs(box)),
            1. - exp(-8. * abs(rhombus)),
            pulse
          )
        );
  col = mix(col, fill,
          mix(
            1. - smoothstep(0., .01, abs(box)),
            1. - smoothstep(0., .01, abs(rhombus)),
            pulse
          )
        );


//  if (loop2 > 0.) {
//    col = mix(fill, bg,  1. - exp(-8. * abs(box)));
//    col = mix(col, fill, 1. - smoothstep(0., .012, abs(box)));
//  }
//
//  if (loop2 > 0.3) {
//    col = bg;
//    // col *= exp(-8. * abs(circle));
//    col = mix(fill, bg,  1. - exp(-8. * abs(circle)));
//    col = mix(col, fill, 1. - smoothstep(0., .01, abs(circle)));
//  }
//
//  if (loop2 > 0.6) {
//    col = bg;
//    col = mix(fill, bg, 1. - exp(-8. * abs(triangle)));
//    col = mix(col, fill, 1. - smoothstep(0.,.01, abs(triangle)));
//  }


	gl_FragColor = vec4(col, 1.);
}

