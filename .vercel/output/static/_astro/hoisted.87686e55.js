import{S as s,W as r,C as n,P as a,O as h,b as o,D as d,V as l,c,M as m}from"./OrbitControls.dd939014.js";import{G as g}from"./dat.gui.module.798d8523.js";var u=`varying vec2 vUv;
uniform float uProgress;

void main()	{
	gl_FragColor = vec4(vUv, uProgress, 1.0);
}`,v=`varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;class w{scene;container;width;height;renderer;clock;camera;controls;isPlaying;delta;material;settings;gui;constructor(e){this.scene=new s,this.container=e.domElement,this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.renderer=new r,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(15658734,1),this.clock=new n,this.container.appendChild(this.renderer.domElement),this.camera=new a(70,window.innerWidth/window.innerHeight,.001,1e3),this.camera.position.set(0,0,2),this.controls=new h(this.camera,this.renderer.domElement),this.isPlaying=!0,this.addObjects(),this.resize(),this.render(),this.setupResize(),this.createSettings()}setupResize(){window.addEventListener("resize",this.resize.bind(this))}resize(){this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.renderer.setSize(this.width,this.height),this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix()}addObjects(){this.material=new o({side:d,uniforms:{uTime:{value:0},uResolution:{value:new l},uProgress:{value:0}},vertexShader:v,fragmentShader:u});const e=new c(1,1,20,20),t=new m(e,this.material);this.scene.add(t)}stop(){this.isPlaying=!1}play(){this.isPlaying||(this.render(),this.isPlaying=!0)}render(){!this.isPlaying||!this.material||(this.delta=this.clock.getElapsedTime(),this.material.uniforms.uTime.value=this.delta,requestAnimationFrame(this.render.bind(this)),this.renderer.render(this.scene,this.camera))}createSettings(){this.material&&(this.settings={progress:0},this.gui=new g,this.gui.add(this.material.uniforms.uProgress,"value",0,1,.01))}}const i=document.querySelector("[data-container-element]");i&&new w({domElement:i});
