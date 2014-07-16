varying vec2 vUv; //mapping channel, to be carried on into the fragment shader
void main()	{
	vUv = uv;
	gl_Position = vec4(position.xy, -.041, 1.0);//position sent to the fragment shader
}