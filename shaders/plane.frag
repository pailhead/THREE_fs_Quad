varying vec2 vUv; //from vert shader
// uniform vec2 _tileUV; //input from dat.gui
// uniform vec4 _rotateUVmatrix; //input from dat.gui
// uniform vec2 _skewXY;
// uniform sampler2D _texture;
#define PI 3.14159265359
#define PI2 6.28318530718
#define PI2inv 0.1591549430919

uniform float _elapsedTime;
void main()	{
	vec2 nin = vUv*2.-1.;
	// nin *=6.;

	float finalG =.0;
	vec2 pos[5];
	pos[0] = vec2(.5,.5);
	pos[1] = vec2(-.1,.1);
	pos[2] = vec2(-.4,.51);
	pos[3] = vec2(-.6,.3);
	pos[4] = vec2(.1,-.34);
	vec3 finalNorm = vec3(0.);
	vec2 ns;
	float d;
	float polar;
	for(int j=0; j<5; j++){


		// ns = nin + pos[j];
		ns = nin +vec2(
			cos(_elapsedTime * pos[4-j].y + pos[j].x * PI2),
			sin(_elapsedTime * pos[j].x + pos[4-j].y * PI2)
		)*.3;
		ns *=2.;
		d = length(ns); //ovoliko je daleko
		polar = atan(ns.x , ns.y);
		
		vec4 ang = vec4(
			polar + PI,
			polar + 2.3 * PI,
			polar + .1496 * PI,
			polar + .5462 * PI
		);

		ang += vec4( pos[j], pos[4-j] ) * ( pos[j].x + pos[j].y) * 6. ;

		vec4 angFreq = ang * vec4(
			1. ,
			floor( abs(pos[j].x)*2. +1.),
			floor( abs(pos[j].y)*2. +3.),
			floor( abs(pos[j].x)*5. +5.)
		);

		vec4 timeFreq = vec4(
			_elapsedTime * 4.,
			-_elapsedTime * -3.,
			_elapsedTime * 2.,
			-_elapsedTime * 0.
		);

		// vec4 timeOsc = vec4()
		timeFreq *=1.5;
		vec4 scale = cos(angFreq + timeFreq)*.5+.5;
		// vec4 scale = cos(angFreq )*vec4(.5)+vec4(.5);
		// vec4 scale = cos(angFreq + timeFreq);

		vec4 mp = vec4(
			.2,
			.2,
			.37,
			.35
		);
		// float mp = .24;
		vec4 vec4one = vec4(1.);
		// vec4one.zw = vec2(0.);
		scale = scale * mp + (vec4one - mp);


		// scale.x = scale.x * mp.x + 1.0 - mp.x;
		// d *= dot(scale,vec4());
		// d *= (dot(scale.wyz,vec3(1.) )*.25 * scale.x) * mp + (1.-mp);
		// d *= 1. + scale.x  scale.y * scale.z * scale.w * 3.;
		d*=  dot(scale, vec4(.5));

		float d2 = d*d;
		float gauss = exp(-( (d2 ) / .056));
		// gauss -=.007;
		vec3 norm = vec3(ns*gauss*2., gauss);
		// d *= scale[0]; 
		// d *= 10.2;


		
		// if( gauss>0.){
			finalG += gauss;
			finalNorm += norm;
		// }
	}

	finalNorm = normalize(vec3( finalNorm.xy, finalNorm.z -.007 )) ;

	vec3 ld = vec3(cos(_elapsedTime),1.,sin(_elapsedTime));
	ld = normalize(ld);
	float ndl = clamp( dot(finalNorm, ld) , .0, 1.) ;
	ndl = ndl *.8 +.2;

	// ndl *= float(finalNorm.z > .1);
	finalNorm = clamp( finalNorm, vec3(.0), vec3(1.));
	//final color 
	float p = float( finalNorm.z > .0);

	finalNorm.xy = finalNorm.xy * .5 + .5;
	// finalNorm.z = .0;
	// gl_FragColor = vec4(vec3( finalNorm * p ), 1.0);
	gl_FragColor = vec4(vec3( finalNorm * ndl * p ), 1.0);
	// gl_FragColor = vec4(vec3(1.0), 1.0);
}
