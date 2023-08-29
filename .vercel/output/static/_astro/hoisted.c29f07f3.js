import"./events.5de93c63.js";import{C as m,S as u,W as f,P as g,O as p,M as a,I as v,T as w,d as _,b as y,e as P,f as h}from"./OrbitControls.dd939014.js";import{G as C}from"./dat.gui.module.798d8523.js";class M{scene;camera;renderer;clock;tickHandlers;controls;container;width;height;isPlaying;constructor(){this.container=document.querySelector("[data-container-element]"),this.width=0,this.height=0,this.isPlaying=!0,this.tickHandlers=[],this.container&&(this._setSizes(),this._createTime(),this._initScene(),this._createRenderer(),this._createCamera(),this._createOrbitControls(),this._resize(),this._appendToDom(),this._addEventListeners())}_setSizes(){this.width=this.container.offsetWidth,this.height=this.container.offsetHeight}_createTime(){this.clock=new m}_initScene(){this.scene=new u}_createRenderer(){this.renderer=new f({antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(1972262,1)}_createCamera(){this.camera=new g(75,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.z=1.5}_createOrbitControls(){!this.camera||!this.renderer||(this.controls=new p(this.camera,this.renderer.domElement),this.controls.enableDamping=!0)}_resize(){!this.renderer||!this.camera||(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.renderer.setSize(this.width,this.height),this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix())}_appendToDom(){this.renderer&&this.container.appendChild(this.renderer.domElement)}_addEventListeners(){window.addEventListener("resize",()=>{this._setSizes(),this._resize()})}addTickHandler(e){this.tickHandlers.push(e)}render(){if(!this.isPlaying||!this.renderer||!this.scene||!this.camera||!this.clock)return;requestAnimationFrame(()=>this.render());const e=this.clock.getElapsedTime();this.tickHandlers.forEach(t=>t(e)),this.controls&&this.controls.update(),this.renderer.render(this.scene,this.camera)}play(){this.isPlaying||(this.render(),this.isPlaying=!0)}pause(){this.isPlaying=!1}dispose(){!this.scene||!this.camera||!this.renderer||(this.scene.traverse(e=>{if(e instanceof a){e.geometry.dispose();for(const t in e.material){const i=e.material[t];i&&typeof i.dispose=="function"&&i.dispose()}}}),this.renderer.dispose())}}const r=new M;var k=`varying vec2 vUv;
uniform float uProgress;
uniform float uTime;

vec3 baseColor =  vec3(0.45098039215686275, 0.42745098039215684, 0.4745098039215686);
vec3 endColor = vec3(1.0, 0.0, 0.5);

void main()	{
	vec3 color = mix(baseColor, endColor, uProgress);
	
	gl_FragColor = vec4(color, 1.0);
}`,x=`varying vec2 vUv;
uniform float uTime;
uniform float uProgress;

void main() {
  vUv = uv;
  vec3 vPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}`;class S{geometry;shaderMaterial;mesh;cones;gui;uniforms;loader;material;constructor(){this.gui=new C,this.geometry=new v(.4,1),this.loader=new w,this.material=new _,this.cones=[],this.uniforms={uTime:{value:0},uProgress:{value:0},t1:{value:0},t2:{value:0}},this.shaderMaterial=new y({vertexShader:x,fragmentShader:k,uniforms:this.uniforms,wireframe:!0}),this.mesh=new a(this.geometry,this.shaderMaterial),console.log(this.mesh);const e=Array.from(this.mesh.geometry.attributes.position.array),t=new P(1,1,3),i=new h(0,0,0);for(let s=0;s<e.length;s+=3){const c=e[s],d=e[s+1],l=e[s+2],n=new a(t,this.material);n.position.set(c,d,l),n.lookAt(i),n.rotateOnAxis(new h(1,0,0),Math.PI*-.5),this.cones.push(n)}r.addTickHandler(s=>this._tick(s)),this._addGui()}_tick(e){this.uniforms.uTime.value=e}setModel(){r.scene&&(r.scene.add(this.mesh),this.cones.forEach(e=>{r.scene&&(e.scale.set(.2,.2,.2),r.scene.add(e))}))}_addGui(){const e=this.gui.addFolder("Mesh");e.add(this.uniforms.uProgress,"value",0).min(0).max(1).name("Progress").onChange(t=>{this.mesh.scale.set(1+t,1+t,1+t),this.cones.forEach(i=>{i.scale.set(.2-t*.2,.2-t*.2,.2-t*.2)})}),e.open()}}class T{constructor(){this._createWorld(),r.render()}_createWorld(){new S().setModel()}}new T;
