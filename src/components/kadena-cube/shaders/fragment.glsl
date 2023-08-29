varying vec2 vUv;
uniform float uProgress;

void main()	{
	gl_FragColor = vec4(vUv, uProgress, 1.0);
}