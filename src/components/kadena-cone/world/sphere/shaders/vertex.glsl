varying vec2 vUv;
uniform float uTime;
uniform float uProgress;


void main() {
  vUv = uv;
  vec3 vPosition = position;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
} 