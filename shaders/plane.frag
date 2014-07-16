
varying vec2 vUv; //from vert shader
uniform vec2 _tileUV; //input from dat.gui
uniform vec4 _rotateUVmatrix; //input from dat.gui
uniform vec2 _skewXY;
uniform sampler2D _texture;

void main()	{

	vec2 normalizedScreen = vUv;
	float taper = vUv.x*10.0;
	//vec2 variable to hold uv modifications
	vec2 modifiedUV;
	mat2 skewMatrix;
	skewMatrix[0] = vec2(1.0, _skewXY.y);
	skewMatrix[1] = vec2(_skewXY.x, 1.0);
	modifiedUV = skewMatrix * vUv;
	mat2 uvRotationMatrix;
	uvRotationMatrix[0] = _rotateUVmatrix.xy;
	uvRotationMatrix[1] = _rotateUVmatrix.zw;
	modifiedUV = uvRotationMatrix * modifiedUV;
	// //UV mapping tiled 10 times
	vec2 tiledUV = modifiedUV * _tileUV;//scaled
	tiledUV -= floor(tiledUV);//sawtooth function
	vec3 texture = texture2D(_texture, tiledUV).xyz;
	//final color 
	gl_FragColor = vec4(texture, 1.0);
	// gl_FragColor = vec4(, 1.0);
}
