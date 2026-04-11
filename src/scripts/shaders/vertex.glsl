varying vec2 vUv;
varying float vFacing;

void main() {
  vec3 worldNormal = normalize(normalMatrix * normal);
  vec3 viewDir = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);

  vFacing = dot(worldNormal, viewDir);

  vUv = uv;
  vec3 pos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}