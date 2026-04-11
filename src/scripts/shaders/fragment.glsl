varying vec2 vUv;
varying float vFacing;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uAlpha;

vec2 getUV(vec2 uv, vec2 texureSize, vec2 planesize){
  vec2 tempUV = uv - vec2(.5);

  float planeAspect = planesize.x / planesize.y;
  float textureAspect = texureSize.x / texureSize.y;

  if(planeAspect < textureAspect){
    tempUV = tempUV * vec2(planeAspect/textureAspect, 1.);
  }else{
    tempUV = tempUV * vec2(1., textureAspect/planeAspect);
  }

  tempUV += vec2(0.5);
  return tempUV;
}

void main() {
  vec2 uv = getUV(vUv, uImageResolution, uResolution);
  vec3 color = texture2D(uTexture, uv).rgb;

  // clamp vFacing supaya tidak ekstrem
  float facing = clamp(vFacing, -1.0, 1.0);

  // smooth darken untuk sisi belakang
  float isBack = step(facing, 0.0);
  float darken = mix(1.0, 0.35, isBack);
  color.rgb *= darken;

  // smooth alpha saat mesh hampir membalik (edge-on)
  float edgeFade = abs(facing);
  edgeFade = smoothstep(0.0, 0.15, edgeFade); // fade saat hampir 90 derajat

  float finalAlpha = uAlpha * edgeFade;

  gl_FragColor = vec4(color, finalAlpha);
}