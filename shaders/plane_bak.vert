varying float vIndex;
varying vec2 vUv; //mapping channel, to be carried on into the fragment shader
uniform vec2 _tileUV;
uniform vec4 _screenStuff;//aspect 
uniform vec2 _tileUVinv;

void main()	{
	//screen size normalized 
	//fiksiran sam za visinu
	vIndex = position.y;
 	// _tileUV.y je koliko puta mi se quad sadrzi u visini
 	//make grid
 	vec2 sG=vec2(0.);//screen grid
 	// sG.y = (position.y) * _tileUVinv.y; // 0[xnum]1[xnum]2[xnum]3 
 	// sG.y = (position.y) / ceil(_tileUV.y); // 0[xnum]1[xnum]2[xnum]3 
 	// sG.x = floor(sG.y);
 	float tt = ceil(_tileUV.y);
 	float tf = fract(_tileUV.y);
 	sG.x = floor( (position.y+.002) / tt  );
 	// sG.x = floor(sG.y  + _tileUVinv.y*.5 ) * _tileUVinv.x;
 	sG.y = (position.y) / ceil(_tileUV.y);
 	sG.y -= floor(sG.y);//- sG.x * fract(_tileUV.y)*_tileUVinv.y;
 	// sG.x *= _tileUVinv.x;
 	sG.x /= _tileUV.x;
 	vec2 pPos;//plane pos
 	pPos = vec2(position.x, position.z)*.5+.5;
 	pPos *= _tileUVinv;/// da li je ovako?

 	pPos += sG;
 	// float nQy = vUv.y / ceil(_tileUV.y);//num Quads y 
 	// float nQx = vUv.x / ceil(_tileUV.x);//_tileUV.x == _tileUV.y * asp;
 	// vec2 sQpos; //screen quad position
 	// sQpos.x = 
	vUv = vec2(position.x,position.z)*.5+.5;
	gl_Position = vec4(pPos, -.041, 1.0);

}