varying vec2 vUv;
uniform float uOffset;
// uniform float uTime;

void main() {
  vUv = uv;

  vec3 pos = vec3(position + normal * uOffset);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}