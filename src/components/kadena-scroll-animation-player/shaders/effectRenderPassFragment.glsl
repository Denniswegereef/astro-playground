uniform float uNoiseAmount;
uniform sampler2D tDiffuse;
varying vec2 vUv;
uniform float uTime;
uniform float uBloomStrength;

float random( vec2 p ) {
  vec2 K1 = vec2(
    23.14069263277926,
    2.665144142690225
  );
  return fract( cos( dot(p,K1) ) * 12345.6789 );
}

float gaussianPdf(float x, float sigma) {
  return 0.39894 * exp(-0.5 * x * x / (sigma * sigma)) / sigma;
}

void main() {
  vec3 sum = vec3(0.0);
  vec4 fragColor = texture2D(tDiffuse, vUv);
  sum += fragColor.rgb * gaussianPdf(0.0, 1.0);
  
  for(int i = 1; i <= 50; ++i) {
    sum += texture2D(tDiffuse, vUv + vec2(0.0, float(i)/300.0)).rgb * gaussianPdf(float(i), 15.0);
    sum += texture2D(tDiffuse, vUv - vec2(0.0, float(i)/300.0)).rgb * gaussianPdf(float(i), 15.0);
  }
  
  // Brightness thresholding
  if (length(fragColor.rgb) < uBloomStrength) {
    sum = vec3(0.0);
  }

  vec2 uvRandom = vUv;
  uvRandom.y *= random(vec2(uvRandom.y, uTime));
  sum.rgb += random(uvRandom) * uNoiseAmount;
  
  gl_FragColor = vec4(sum, fragColor.a);
}
