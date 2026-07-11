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


//*************/ NOTES

// uniform sampler2D uTexture;
// varying vec2 vUv;

// void main(){
//   float blocks = 10.0;
//   vec2 blockUv = floor(vUv*blocks)/blocks;
//   // floor as point niklega and vals would be 0 to 10(aka blocks), as 0, 0.1, 0.2, 0.3, 0.4, 0.5, and so one.
//   // Then after multiply and floor we get decimal, then we divide it by block so vals would be 0.0 to 1.0
//   float distance = length(blockUv - uMouse);
//   // length() is use to know, how far is this block from the mouse
//   float effect = smoothstep(0.3, 0.0, distance);
//   // 0.3 se bada jho bhi number hoga vusse 0 mai convert kardena. so vals would be 0 to 0.3
//   vec2 distortion = vec2(0.2)*effect;
//   vec4 color = texture2D(uTexture, vUv + distortion);
//   gl_FragColor = vec4(vUv*distortion, .0, 1.);
// }