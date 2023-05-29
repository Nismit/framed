precision highp float;
uniform float time;
uniform float pixelRatio;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
float TAU = PI * 2.0;

mat2 rotation(float a) {
  return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

vec2 Hash21(vec2 p){
	p = fract(p * vec2(49.28625, -123.11146)); // just put random number in vec2
	p += dot(p, p+15.6);
	// return fract(p.x * p.y);
  return p;
}

float Hash21f(vec2 p) {
  p = fract(p * vec2(49.28625, -123.11146));
  p += dot(p, p+15.6);
  return fract(p.x * p.y);
}

vec3 voronoi( in vec2 x ) {
  vec2 n = floor(x);
  vec2 f = fract(x);

  float loop = sin(TAU * (time - 0.75)/300.0)/2.0 + 1.0;
  float loop2 = float(time) / 300.0;
	float loop3 = sin(TAU * (time - 0.75)/300.0)/2.0 + 1.0;
	float loop4 = sin(TAU * time/300.0)/2.0 + 0.5;

  //----------------------------------
  // first pass: regular voronoi
  //----------------------------------
	vec2 mg, mr;

  float md = 8.0;
  for( int j=-1; j<=1; j++ )
  for( int i=-1; i<=1; i++ ) {
    vec2 g = vec2(float(i),float(j));
		vec2 o = Hash21( n + g );
    o = 0.5 + 0.5*sin( loop + 6.2831*o );
    vec2 r = g + o - f;
    float d = dot(r,r);

    if( d<md ) {
      md = d;
      mr = r;
      mg = g;
    }
  }

  //----------------------------------
  // second pass: distance to borders
  //----------------------------------
  md = 8.0;
  for( int j=-2; j<=2; j++ )
  for( int i=-2; i<=2; i++ ) {
    vec2 g = mg + vec2(float(i),float(j));
		vec2 o = Hash21( n + g );
    o = 0.5 + 0.5*sin( loop + 6.2831*o );
    vec2 r = g + o - f;

    if( dot(mr-r,mr-r)>0.00001 )
    md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
  }

  return vec3( md, mr );
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy) * (2.0 / pixelRatio) - 1.0;
  p.x *= resolution.x / resolution.y;

	float loop = sin(float(time) / 150.0) * 0.5 + 0.5;
  float loop2 = float(time) / 300.0;
	float loop3 = sin(TAU * (time - 0.75)/300.0)/2.0 + 1.0;
	float loop4 = sin(TAU * time/300.0)/2.0 + 0.5;
	vec3 col = vec3(0.);


  p *= 4.;
  p *= rotation(radians(10.0 * loop4));

  // Tile the space
  vec2 i_st = floor(p);
  vec2 f_st = fract(p);

  float m_dist = 1.;  // minimum distance

  for (int y= -1; y <= 1; y++) {
    for (int x= -1; x <= 1; x++) {
      // Neighbor place in the grid
      vec2 neighbor = vec2(float(x),float(y));

      // Random position from current + neighbor place in the grid
      vec2 point = Hash21(i_st + neighbor);

      // Animate the point
      point = 0.5 + 0.5*sin(loop3 + 12.2831*point);

      // Vector between the pixel and the point
      vec2 diff = neighbor + point - f_st;

      // Distance to the point
      float dist = length(diff);

      // Keep the closer distance
      m_dist = min(m_dist, pow(dist, 3.));
    }
  }

  col = m_dist * vec3(.19, .99, 1.);
  col += (1. - m_dist) * vec3(.008,.518,.659);

	// p *= rotation(radians(-90.0 * loop2));

  // vec3 c = voronoi( 4.0*p );
	// col = c.x*(0.5 + 0.5*sin(64.0*c.x))*vec3(1.0);
  // col = c.x * vec3(.55, .75, 1.);
  // col = c.x * vec3(1., 1., 1.);
  // col += (1. - c.x) * vec3(.0, .3, .5);
  // col = mix( vec3(1.0,1.0,1.0), col, smoothstep( 0.005, 0.008, c.x ) );

	// col = pow( col, vec3(0.4545) );
	// col /= float(1.01);

	gl_FragColor = vec4(col, 1.0);
}
