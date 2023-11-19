precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
float TAU = PI * 2.0;

#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))

// from https://shadertoyunofficial.wordpress.com/2019/01/02/programming-tricks-in-shadertoy-glsl/
#define hash21(p) fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453)

// from https://www.shadertoy.com/view/Xt2BDc
#define hash31(p) fract(sin(dot(p, vec3(17, 1527, 113))) * 43758.5453123)

float noise( in vec2 p ) {
  return sin(p.x) * sin(p.y);
}

float random(vec2 co) {
  float a = 12.9898;
  float b = 78.233;
  float c = 43758.5453;
  float dt= dot(co.xy ,vec2(a,b));
  float sn= mod(dt,3.14);
  return fract(sin(sn) * c);
}

// from https://iquilezles.org/articles/distfunctions2d
float sdBox(in vec2 p, in vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;
  p *= 4.0;

  float loop = (float(time) / 300.0);
  float loop2 = (sin(TAU * (time  / 300.0))/2.0) + 0.5;

  vec2 id = floor(p);
  vec2 coord = fract(p) - 0.5;
  float dist = sdBox(coord, vec2(0.484));

  float param = 0.6;
  float param2 = 0.5;

  vec3 tile;
  tile.x = random(id) * 2.0;
  tile.y = 0.90;
  float modTime = mod(time/200.0, 100.0);
  float floorTime = floor(modTime * 2.0);
  float level = step(param2, hash31(vec3(id, floorTime)));
  float lastLevel = step(param, hash31(vec3(id, floorTime - 1.0)));
  level = max(level, lastLevel * (1.0 - fract(modTime * 0.5) * 1.5));
  tile.z = level + 0.61;


  // vec3(0.984,0.592,0.557);
  vec4 lastCol = vec4(0.);
  lastCol = mix(lastCol, vec4(tile, 1.0), step(dist, 0.));

  gl_FragColor = lastCol - (length(p) * 0.09);
}
