precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
float TAU = PI * 2.0;

float scale = 6.0/PI;

mat2 scaleSize(vec2 _scale) {
  return mat2(_scale.x, 0.0, 0.0 ,_scale.y);
}

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

float polygon(vec2 p, float scale, float width, int polygon) {
  float a = atan(p.x, p.y) + PI;
  float r = TWO_PI / float(polygon);
  float d = cos(floor(.5 + a/r) * r - a) * length(p);
  return step(scale, d) + (1. - step((scale - width), d));

	// vec3 colorA = vec3(0.149,0.141,0.912);
	// vec3 colorB = vec3(1.000,0.833,0.224);

  // Inner Polygon
  // return smoothstep(0., scale, d) + (1. - smoothstep(1., (scale - width), d));
  // Outer Polygon + diff?
  // return smoothstep(1., scale, d) - smoothstep(0., (scale - width), d);
}

// Ref: https://iquilezles.org/articles/distfunctions2d/
float sdBox( in vec2 p, in vec2 b ) {
  vec2 d = abs(p)-b;
  return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

void main( void ) {
  // vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  // p.x *= resolution.x / resolution.y;

	float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 0.5;
  float loop2 = float(time) / 300.0;
	float split = 0.;
	vec3 col = vec3(1.);

	// p *= rotation(radians(90.0 * loop2));

	if (p.x >= 0.) {
    vec2 center = vec2(p.x - 0.5, p.y) * 1.0;
    center.y -= 0.97;
    center.y += (loop * 1.95);
    center *= rotation(radians(90.0));

		float shape = sdBox(center, vec2(0.8, 0.2));

    vec3 bg = vec3(0.949,0.843,0.522) * 0.98;
    vec3 fill = vec3(0.522,0.6,0.949);

		// col = mix(fill, vec3(0.2), 1. - smoothstep(0., .01, abs(shape)));
    col = mix(fill, bg, sign(shape));
  } else {
    vec2 center2 = vec2(p.x + 0.5, p.y) * 1.0;
    center2.y += 2.5;
    center2.y -= (loop * 4.9);
    center2 *= rotation(radians(90.0));

    float shape2 = sdBox(center2, vec2(0.6, 0.2));

    vec3 bg2 = vec3(0.788,0.812,0.949) * 0.9;
    vec3 fill2 = vec3(0.952,0.854,0.651);

		// col = mix(bg2, fill2, 1. - smoothstep(0., .01, abs(shape2)));
    col = mix(fill2, bg2, sign(shape2));
	}


	gl_FragColor = vec4(col, 1.);
}
