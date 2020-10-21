import * as THREE from '/lib/three/build/three.module.js'

//https://stackoverflow.com/questions/40807515/cloth-simulator-using-three-js


var size = 500;
var img = '/assets/img/painting1.jpg';

window.onload = function() {
    createWGL();
    render();
}


function render() {
    requestAnimationFrame( render );

    if(window.mat)
    mat.uniforms.time.value = now();

    ctx.render( scn, cam );
}


function createWGL() {

    window.ctx = new THREE.WebGLRenderer({ antialias:true} );
    ctx.setClearColor( 0xffffff );
    ctx.setPixelRatio( window.devicePixelRatio );
    ctx.setSize( size, size );

    // camera
    window.cam = new THREE.PerspectiveCamera( 90, 1, 1, 30 );
    cam.position.z = 25;

    // scene
    window.scn = new THREE.Scene();

    // canvas
    window.cvs = createCanvas();
    scn.add( cvs );
    loadCanvasTexture( img );

    // clear viewport
    ctx.render( scn, cam );
    document.body.appendChild( ctx.domElement );
}


function now(){
    return performance.now() * 0.001;
}


function loadCanvasTexture( path ) {
    if(window.tex)
    window.tex.dispose();

    cvs.visible = false;

    window.tex = new THREE.TextureLoader().load( path, function(){
    cvs.visible = true;
    });
    window.tex.anisotropy = ctx.getMaxAnisotropy();
    window.mat.uniforms.tex.value = window.tex;
}


function createCanvas() {
    window.mat = new THREE.RawShaderMaterial({
		uniforms: {
			time: { value: now() },
			tex: { value: null }
		},
		vertexShader: `
			precision mediump float;
			precision mediump int;
			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;
			attribute vec2 pos;
			uniform float time;
			varying vec2 uv;
			varying float amb;
			
			float d(float y){
				return cos(sin(time/2.)+time/2.+y/2.14)*sin(time+y/4.17)*(.5-y/40.)*1.5;
			}
			
			void main(){
				vec3 p=vec3(pos.x+sin(time/3.)*(.5-pos.y/40.), pos.y+sin(time)*(.5-pos.y/40.)/2., d(pos.y));
				amb=(d(pos.y-1.)-d(pos.y+1.))/4.;
				uv=vec2(pos.x/40.+.5,pos.y/40.+.5);
				gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
			 }`,
		fragmentShader: `
			precision mediump float;
			precision mediump int;
			uniform sampler2D tex;
			varying vec2 uv;varying float amb;
			
			void main(){
				vec4 col=texture2D(tex,uv)+amb;
				gl_FragColor=vec4(col.xyz,1.);
			}`
	});

    var d = 40;
    var d2 = ~~(d/2); //Math.floor
    var z1 = -1;
    var i,j,k,n,fi,v,m,z2;

    fi = new Uint16Array( d * d * 6 );
    v = new Int8Array( (d+1) * (d+1) * 2 );
    for(j=0;j<=d;j++) {
        for(i=0;i<=d;i++) {
            k = i + j*(d+1);
            v[k*2] = i - d2;
            v[k*2+1] = j - d2;
            if(i<d && j<d) {
                n = (i + j*d) * 6;
                fi[n] = k;
                fi[n+1] = k + 1;
                fi[n+2] = k + d + 1;
                fi[n+3] = k + d + 1;
                fi[n+4] = k + 1;
                fi[n+5] = k + d + 2;
            }
        }
    }

    for(i=0,j=-1;i<fi.length;i++)
        if(j<fi[i])
            j = fi[i];

    m = new THREE.Mesh( new THREE.BufferGeometry(), mat );
    m.geometry.setIndex( new THREE.BufferAttribute( fi, 1 ));
    m.geometry.addAttribute( 'pos', new THREE.BufferAttribute( v, 2 ));

    return m;
}
