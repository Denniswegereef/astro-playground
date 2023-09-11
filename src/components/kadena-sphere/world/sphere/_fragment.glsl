varying vec2 vUv;
varying float vDistort;

uniform float uTime;
uniform float uHue;
uniform float uAlpha;
uniform bool uOutline;

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}   

void main() {
  float distort = vDistort * 2.0;

  vec3 brightness = vec3(0.5, 0.5, 0.5);
  vec3 contrast = vec3(0.5, 0.5, 0.5);
  vec3 oscilation = vec3(1.0, 1.0, 1.0);
  vec3 phase = vec3(0.0, 0.1, 0.2);

  vec3 color = cosPalette(uHue + distort, brightness, contrast, oscilation, phase);

  // Convert the color to grayscale
  float grayscale = dot(color, vec3(0.299, 0.587, 0.114));
  
  // Make it less black by transforming the grayscale value
  grayscale = grayscale * 0.5 + 0.1;

  color = vec3(grayscale, grayscale, grayscale);

  float singing = sin(uTime + 2.0 * 0.5);

  vec3 swap = mix(color, vec3(0.0, 0.0, 0.0), singing);


  gl_FragColor = vec4(swap, uAlpha);

  if (uOutline) {
    gl_FragColor = vec4(vec3(1.0), 1.0 - singing);  
  }
}