varying vec2 vUv;
uniform float uProgress;
uniform float uTime;
uniform float uIntroProgress;

void main()	{
	vec2 uv = vUv;

	// Linear gradiant
 	float gradient = 1.0 - abs(2.0 * vUv.y - 1.0);

	// Radial gradient
	vec2 center = vec2(0.5, 0.5);
  float distance = length(center - vUv);
  float radialGradient =  abs(2.0 * distance - 1.0);


	// Create wrapping, this is increased by the width and height of the plane
	uv.x *= 150.0;     
	uv.y *= 30.0;      
	uv = fract(uv); // Wrap around 1.0

	 // bottom-left
  vec2 bottomLeft = step(vec2(0.025), uv);
  float pct = bottomLeft.x * bottomLeft.y;

  // top-right
  vec2 topRight = step(vec2(0.025), 1.0 - uv);
  pct *= topRight.x * topRight.y;
	
  vec3 color = vec3(pct);

	gl_FragColor = vec4(color, radialGradient * 0.025 * uIntroProgress);
}