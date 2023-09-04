varying vec2 vUv;
varying vec3 vWorldPosition;
uniform float uProgress;

void main() {
  vUv = uv;
  vec3 updatedPosition = position;

  // Calculate direction from center to vertex position
  vec3 direction = normalize(position - vec3(0.0, 0.0, 0.0));

    // Transform vertex from model space to world space
  vec4 worldPosition = modelMatrix * vec4(updatedPosition, 1.0);

  vWorldPosition = worldPosition.xyz;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(updatedPosition, 1.0);
}