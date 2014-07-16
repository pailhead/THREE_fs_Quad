
varying vec2 vUv; //mapping channel, to be carried on into the fragment shader
uniform vec3 _scrSizeAsp; //custom uniform (input - xy: screen size in pixels, z: aspect ratio)
 
void main()	{

	vUv = uv;//uv is a vec2 attribute that comes from three.js (THREE.shaderMaterial sets this up);
	// vec2 screenPosition = position.xy; //position XY is already in NDC because THREE.PlaneGeometry(2,2) generates it that way
	// gl_Position = vec4(position.xy*.5-.5, -.041, 1.0);//position sent to the fragment shader
	gl_Position = vec4(position.xy, -.041, 1.0);//position sent to the fragment shader
}