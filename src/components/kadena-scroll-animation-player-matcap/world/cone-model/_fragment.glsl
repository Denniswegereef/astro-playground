varying vec3 vWorldPosition;

varying vec2 vUv;
uniform float uProgress;
uniform float uTime;
uniform float uMouseDown;
uniform float uMouseX;
uniform float uMouseY;
uniform float uRotationY;
uniform sampler2D uTexture;

float random( vec2 p ) {
  vec2 K1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
  );

	return fract( cos( dot(p,K1) ) * 12345.6789 );
}

void main()	{
	vec2 uvRandom = vUv;

	float gradient = (vWorldPosition.x + 1.0) / 2.0; 

	float randValue = random(vec2(vWorldPosition.x, 0.001));

	vec3 darkGrey = vec3(58.0 / 255.0, 51.0 / 255.0, 66.0 / 255.0);
  vec3 lightGrey = vec3(0.6, 0.6, 0.6);

	vec3 white = vec3(0.8, 0.8, 0.8);

  vec3 colorOne = mix(darkGrey, lightGrey, gradient *= (2.0 - uMouseX));
	vec3 colorTwo = mix(lightGrey, darkGrey, gradient += uMouseX);

	vec3 colorMixed = mix(colorTwo, colorOne, uMouseX);

	// Add noise
	colorMixed *= vWorldPosition.z * 2.0;


	// colorMixed *= randValue * 0.001;

	gl_FragColor = vec4(colorMixed, 1.0);
}	