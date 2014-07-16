#define PI 3.141592653589793

//vert
varying vec2 vUv; 
varying float vIndex;

//debug
uniform float _index;

//flags
uniform int _choice;
uniform int _circleLight;
uniform int _mouseLight;

//screen
uniform vec4 _screenStuff;//aspect 


//controls
uniform vec2 _mousePos;
uniform float _elapsedTime;
	//
	//tiles
	uniform vec2 _tileUV;
	uniform vec2 _crcl;
	uniform float _scanline;

//source
uniform sampler2D _texture;

void main()	{
	gl_FragColor = vec4(vec3( vUv , float(_index==vIndex) ), 1.0);
	return;
	// vec2 normalizedScreen = vUv;

	vec3 texture;
	// vec3 finalColor;
	if(_choice==0){

		float hLn = cos(vUv.y * _scanline * PI * 16.);
		hLn = hLn*.25+.75;
		texture = texture2D(_texture, vUv).xyz;
		texture*=hLn;
		// finalColor = texture;

	} else if (_choice==1){

		vec2 tile = vUv * _tileUV;
		vec2 pxTile = floor(tile) / floor( _tileUV );
		texture = texture2D( _texture, pxTile ).xyz;
		tile -= floor(tile);
		tile -= .5;
		tile /= _crcl.x;//0-1

		float d = length(tile);
		// texture = vec3( pxTile,0.);
		texture *= smoothstep( .5, .49*_crcl.y , d );

		// finalColor = texture;
	} else if (_choice==2){

		texture = texture2D( _texture, vUv ).xyz;

	} else if (_choice==3){

		vec2 tile = vUv * _tileUV;
		vec2 pxTile = floor(tile) / floor( _tileUV );
		texture = texture2D( _texture, pxTile ).xyz;
		tile -= floor(tile);
		tile -= .5;
		tile /= _crcl.x;//0-1
		// float d = length(tile);
		float d = tile.x*tile.x + tile.y*tile.y;
		if(_circleLight ==1){

			vec2 sd = vUv*2.-1.; //norm
			sd.y *= _screenStuff.x;
			float spH = sqrt(1.-d);//sphere height
			vec3 vd = normalize(vec3(-sd,max(9.0-spH/_tileUV.x,.0)));//.z==fov d/ height offset
			// vd.z=0.;
			vec3 normal = vec3(tile.x,tile.y,sqrt(1.-d));

			vec3 ld;

			if(_mouseLight==1){
				vec2 mS = sd - _mousePos;

				ld = normalize( -vec3( mS.x, mS.y, -3.0+spH) ); 
				// gl_FragColor.xyz = ld;
				// gl_FragColor.w = vec2(0.,1.);
				// return;

			}else{

				ld = normalize(vec3(1.,1.,1.));//fixed
			
			}

			vec3 h = normalize(vd+ld);
			float ndh = clamp(dot(normal,h),.0,1.);
			// float ndl = dot(normal,ld);
			float ndl = dot(normal,ld)*.5+.5;
			float fresnel = dot(vd,normal);
			fresnel=1.0-clamp(fresnel,.0,1.);
			fresnel=pow(fresnel,2.50);
			texture *= ndl;
			float r = pow(ndh,21.)*.645 + fresnel*.765;
			texture = mix(texture,vec3(.0),r) + r;
			texture *= smoothstep(1.0,.79,d);

			// texture = vd;
		} else {
			texture *= sqrt( 1. - d);

		}
		// texture = vec3( pxTile,0.);
		// texture *= smoothstep( .5, .49*_crcl.y , d );
		// texture = texture2D( _texture, vUv ).xyz;

	}
	//final color 
	gl_FragColor = vec4(texture, 1.0);
	// gl_FragColor = vec4(, 1.0);
}
