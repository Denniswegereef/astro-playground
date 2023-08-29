import"./events.5de93c63.js";import{C as h,S as a,W as o,P as c,O as d,M as n,B as l,a as m}from"./OrbitControls.dd939014.js";import"./dat.gui.module.798d8523.js";class f{scene;camera;renderer;clock;tickHandlers;controls;container;width;height;isPlaying;constructor(){this.container=document.querySelector("[data-container-element]"),this.width=0,this.height=0,this.isPlaying=!0,this.tickHandlers=[],this.container&&(this._setSizes(),this._createTime(),this._initScene(),this._createRenderer(),this._createCamera(),this._createOrbitControls(),this._resize(),this._appendToDom(),this._addEventListeners())}_setSizes(){this.width=this.container.offsetWidth,this.height=this.container.offsetHeight}_createTime(){this.clock=new h}_initScene(){this.scene=new a}_createRenderer(){this.renderer=new o({antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(1972262,1)}_createCamera(){this.camera=new c(75,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.z=1.5}_createOrbitControls(){!this.camera||!this.renderer||(this.controls=new d(this.camera,this.renderer.domElement),this.controls.enableDamping=!0)}_resize(){!this.renderer||!this.camera||(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.renderer.setSize(this.width,this.height),this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix())}_appendToDom(){this.renderer&&this.container.appendChild(this.renderer.domElement)}_addEventListeners(){window.addEventListener("resize",()=>{this._setSizes(),this._resize()})}addTickHandler(e){this.tickHandlers.push(e)}render(){if(!this.isPlaying||!this.renderer||!this.scene||!this.camera||!this.clock)return;requestAnimationFrame(()=>this.render());const e=this.clock.getElapsedTime();this.tickHandlers.forEach(i=>i(e)),this.controls&&this.controls.update(),this.renderer.render(this.scene,this.camera)}play(){this.isPlaying||(this.render(),this.isPlaying=!0)}pause(){this.isPlaying=!1}dispose(){!this.scene||!this.camera||!this.renderer||(this.scene.traverse(e=>{if(e instanceof n){e.geometry.dispose();for(const i in e.material){const s=e.material[i];s&&typeof s.dispose=="function"&&s.dispose()}}}),this.renderer.dispose())}}const t=new f;class p{geometry;material;mesh;constructor(){this.geometry=new l(1,1,1),this.material=new m({color:"red"}),this.mesh=new n(this.geometry,this.material),t.addTickHandler(e=>this._tick(e))}_tick(e){this.mesh.rotation.x+=Math.sin(e)*.01,this.mesh.rotation.z+=Math.sin(e)*.01,e>5&&t.pause()}setModel(){t.scene&&t.scene.add(this.mesh)}}class w{constructor(){this._createWorld(),t.render()}_createWorld(){new p().setModel()}}new w;
