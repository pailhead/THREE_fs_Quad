#define NUMmb 5
#define PI2 6.28318530717959

varying vec2 vUv;
uniform float _elapsedTime;
uniform vec3 _scrSizeAsp;//.xy inv size // .z asp
uniform vec2 _mouse;

float rn(float xx){
    float r1 = fract(sin(xx*.4686)*3718.927);          
    return r1;
}

void main( void ) {

	float ts = _elapsedTime;
	
	vec3 COLOR_MASKS[16];//blob colors
	COLOR_MASKS[0] = vec3( 0.20, 0.30, 1.0 );
  	COLOR_MASKS[1] = vec3( 0.53, 0.85, 0.25 );
  	COLOR_MASKS[2] = vec3( 1.0, 0.56, 0.15 );
  	COLOR_MASKS[3] = vec3( 1.0, 0.0, 0.3 );
  	COLOR_MASKS[4] = vec3( 0.05, 0.55, .30 );
	COLOR_MASKS[5] = vec3( 0.5, 1.0, .40 );
  	COLOR_MASKS[6] = vec3( 1.0, 0.15, 1.0 );
  	COLOR_MASKS[7] = vec3( .20, .30, 0.5 );
  	COLOR_MASKS[8] = vec3( .350, 1.0, 0.5 );
  	COLOR_MASKS[9] = vec3( .70, .60, 0.5 );
  	COLOR_MASKS[10] = vec3( .34, 1., 0.5 );
  	COLOR_MASKS[11] = vec3( .20, .50, 0.5 );
  	COLOR_MASKS[12] = vec3( 0.60, .10, 0.65 );
  	COLOR_MASKS[13] = vec3( .40, .40, 0.85 );
  	COLOR_MASKS[14] = vec3( 1.0, .30, 0.35 );
  	COLOR_MASKS[15] = vec3( 1.0, 0.0, 0.5 );
	
	//screen space
	// vec2 fragP = ( gl_FragCoord.xy * _scrSizeAsp.xy ); 
	vec2 fragP = vUv;
	vec2 fragPN = fragP*2.-1.;//-1 1
	float as = _scrSizeAsp.z;
	fragPN.x *= as; //aspect
	// vec2 mouseP = fragP - mouse; //mouse


	float vH = 10.0;//camera disance - fov
	vec3 vD = normalize(vec3(-fragPN,vH));//view dir
	vec3 lD = normalize(vec3(cos(_elapsedTime),.750,sin(_elapsedTime)));//light dir	
	//vec3 lD = normalize(vec3(.7, .750,2.));
	
	vec2 mbPos[NUMmb];
	vec3 nn = vec3(.0);
	vec3 cc = vec3(.0);

	for(int i=0; i<NUMmb; i++){
		float rn1 = rn(float(i+54));
		float rn2 = rn(float(i-222));
		float rn3 = rn(float(i-262));
		mbPos[i] = vec2(
			sin(rn1*PI2+ts * rn2)*as,
			cos(rn2*PI2+ts * rn3)
		);
		mbPos[i] = fragPN - mbPos[i]*.8;
		float rr = cos(rn3*6.28+ts * rn1)*.2+.5;
		mbPos[i] *= rr*30.;//blob coord
		float bL = length( mbPos[i] );//bl length
		float bA = smoothstep( 1.0, 0.97, bL );
		float bH = exp(-bL*2.15678);
		vec3 bN = vec3(mbPos[i]*.3*bH,bH-.01);
		vec3 bC=COLOR_MASKS[i];
		bC*=bH;
		nn += vec3(mbPos[i]*.5*bH,bH);
		cc += bC;
	}

	vec2 mouse = _mouse;
	
	vec2 mB = fragPN - (mouse.xy)*vec2(as,1.);
	mB*=16.;
	float mBL = length( mB );
	float mBH = exp(-mBL*2.15678);
	vec3 mBN = vec3(mB*.5*mBH, mBH);
	vec3 mBC = vec3(1.,.0,.0);
	mBC*=mBH;
	
		float sq = float( //quad
			(mB.x<1.&&mB.x>-1.)
			&&
			(mB.y<1.&&mB.y>-1.)
		);
	
	nn+=mBN;
	
	
	vec3 n = normalize( vec3(nn.x,nn.y,nn.z-.01) );
	float aB = smoothstep(0.0,.01,n.z);
	cc+=mBC;
	cc/=nn.z;
	//n *= aB;
	float ndl = dot(n,lD)*.5+.5;//wrap	
	//float ndl = clamp(dot(n,lD),.0,1.);//nowrap
	ndl = ndl*.7+.3;
	vec3 h = normalize(vD+lD);
	float ndh = dot(n,h);
	ndh = ndh*.5+.5;
	ndh = pow(ndh,70.5)*.35;
	vec3 fc = cc*ndl+ndh;
	
	float frs = dot(n,vD);
	frs = 1.0-clamp(frs,.0,1.);
	frs = pow(frs,2.0);
	frs = frs*.4+.121;
	fc+=frs;
	
	float color = 0.0;
	gl_FragColor = vec4( fc*aB, 1.);
	
}