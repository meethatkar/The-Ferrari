varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec4 uBounds;
uniform float uIsCarousel;
uniform vec2 uMouse;
uniform float uHover;

void main(){
  float blocks = 20.0;
  vec2 blockUv = floor(vUv*blocks)/blocks;
  float distance = length(blockUv - uMouse);
  float effect = smoothstep(0.4, 0.0, distance);
  vec2 distortion = vec2(0.05) * effect;
  vec4 color = texture2D(uTexture, vUv + (distortion)*uHover);
  vec2 pos = gl_FragCoord.xy;
  if(uIsCarousel > 0.5){
    if(pos.x < uBounds.x || pos.y < uBounds.y || pos.x >uBounds.z || pos.y > uBounds.w){
      discard;
    }
  }
  gl_FragColor=color;
}