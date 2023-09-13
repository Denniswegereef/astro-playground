varying vec2 vUv;
uniform float uProgress;
uniform float uTime;

void main()	{
	gl_FragColor = vec4(sin(vUv * uTime) + 1.0 * 0.5, uProgress, 1.0);
}