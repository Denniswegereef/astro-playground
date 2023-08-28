varying vec2 vUv;
uniform float uProgress;
uniform float uTime;

// Grey color
vec3 baseColor =  vec3(0.45098039215686275, 0.42745098039215684, 0.4745098039215686);
vec3 endColor = vec3(1.0, 0.0, 0.5);

void main()	{
	vec3 color = mix(baseColor, endColor, uProgress);
	
	gl_FragColor = vec4(color, 1.0);
}