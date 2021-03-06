////////////
//global
////////////
var clock, 
    camera, 
    scene,
    renderer,
    stats,
    container,
    deltaTime,
    time,
    scrHEIGHT,
    scrWIDTH,
    scrASPECT;

var controls;

var mouse={
    x:0,
    y:0
}

////////////
//quad 
////////////

var quadMesh,
    quadMaterial;


////////////
//gui 
////////////


 
var guiParam = {
    tileX: 1,
    tileY: 1,
    rotateUV: 0,
    skewUVx: 0,
    skewUVy: 0
};
  
  
var gui = new dat.GUI({});
  
  
gui.add(guiParam, "tileX", 1, 30).onChange(function(){
    quadMesh.material.uniforms._tileUV.value.setX(guiParam.tileX);
});
  
gui.add(guiParam, "tileY", 1, 30).onChange(function(){
    quadMesh.material.uniforms._tileUV.value.setY(guiParam.tileY);
});
 
gui.add(guiParam, "rotateUV", 0, 360).onChange(function(){
    var angleInRad = deg2rad(guiParam.rotateUV);
    var a = Math.cos(angleInRad);
    var b = Math.sin(angleInRad);
 
    quadMesh.material.uniforms._rotateUVmatrix.value.set( 
        a,
        -b,
        b,
        a
    );
});
 
gui.add(guiParam, "skewUVx", -1, 1).onChange(function(){
     quadMesh.material.uniforms._skewXY.value.setX(guiParam.skewUVx);

});
 
gui.add(guiParam, "skewUVy", -1, 1).onChange(function(){
     quadMesh.material.uniforms._skewXY.value.setY(guiParam.skewUVy);
});





var shaderLoader = new pailhead.ShaderLoader();

shaderLoader.onAllLoaded = function(){
    init();
}

document.addEventListener('DOMContentLoaded', function(){

    shaderLoader.load(
        './shaders/plane.vert',
        function( shader ){
            shad_planeVert = shader;
    });

    shaderLoader.load(
        './shaders/plane.frag',
        function( shader ){
            shad_planeFrag = shader;
    });

    shaderLoader.load(
        './shaders/metaBall.frag',
        function( shader ){
            shad_mbFrag = shader;
    });

});




function init() {

    time = 0;

    //DOM element
    container = document.getElementById("container");

    //window info
    scrWIDTH = window.innerWidth;
    scrHEIGHT = window.innerHeight;
    // console.log(scrWIDTH, scrHEIGHT);
    scrASPECT = scrWIDTH / scrHEIGHT;


    //init renderera
    if ( Detector.webgl )
        renderer = new THREE.WebGLRenderer({
            // preserveDrawingBuffer:true
        });
    else
        renderer = new THREE.CanvasRenderer(); 

    renderer.setSize(scrWIDTH, scrHEIGHT);
    // renderer.autoClear = false;
    // renderer.autoClearColor = false;
    // renderer.autoClearDepth = false;
    // renderer.autoClearStencil = false;
    container.appendChild( renderer.domElement );


    clock = new THREE.Clock();
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, scrASPECT , 0.5, 200);
    // camera.position.x = 6;
    // camera.position.y = 4;
    camera.position.z = 10;
    scene.add(camera);


    //resize event
    window.addEventListener("resize", onWindowResize, false);
    document.addEventListener("mousemove", onMouseMove, false);
    //stats
    stats = new Stats;
    stats.domElement.style.position = "absolute";
    stats.domElement.style.bottom = "0px";
    stats.domElement.style.zIndex = 100; 
    container.appendChild(stats.domElement);



    ////////////////////////////

    texture = new THREE.ImageUtils.loadTexture( './textures/airport_night_final.jpg' );

    //custom uniforms
    var quadUniforms = {
        _elapsedTime:{
            type:"f",
            value:time
        },
        //vector3 screen size in pixels, and aspect ratio
        _scrSizeAsp:{
            type:"v3",
            value: new THREE.Vector3()
        },  
        _tileUV:{
            type:"v2",
            value: new THREE.Vector2(1,1)
        },
        _rotateUVmatrix:{
            type:"v4",
            value: new THREE.Vector4(1,0,0,1)
        },
        _skewXY:{
            type:"v2",
            value: new THREE.Vector2()
        },
        _texture:{
            type:"t",
            value: texture
        }

    }
    var metaballUniforms = {
        _mousePos:{
            type:"v2",
            value:new THREE.Vector2(mouse.x, mouse.y)
        },
        _scrSizeAsp:{
            type:"v3",
            value: new THREE.Vector3(scrWIDTH, scrHEIGHT, scrASPECT)
        },
        _elapsedTime:{
            type:"f",
            value:time
        },
        _mouse:{
            type:"v2",
            value: new THREE.Vector2(mouse.x,mouse.y)
        }
    }
    // custom shader material
    quadMaterial = new THREE.ShaderMaterial({
        uniforms: quadUniforms,
        vertexShader: shad_planeVert,
        fragmentShader: shad_planeFrag,
        depthTest: false
    });  
    
    //metaball shader
    // quadMaterial = new THREE.ShaderMaterial({
    //     uniforms: metaballUniforms,
    //     vertexShader: shad_planeVert,
    //     fragmentShader: shad_mbFrag,
    //     depthTest: false
    // });  

    // full screen quad
    quadMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2,2,1,1), 
        quadMaterial
    );
    scene.add(quadMesh);


    animate();
}

function animate() {
    requestAnimationFrame( animate ); 
    update();
    render();
}


function update(){

    deltaTime = clock.getDelta();
    time += deltaTime;
    quadMesh.material.uniforms._elapsedTime.value = time;


    stats.update();
}

function render(){
    renderer.render(scene, camera);

}

function onMouseMove(evt){

    // console.log( evt.clientX, evt.clientY );
    mouse.x=evt.clientX/scrWIDTH;
    mouse.x=mouse.x*2-1;
    mouse.y=evt.clientY/scrHEIGHT;
    mouse.y=mouse.y*2-1;

    // quadMesh.material.uniforms._mouse.value.set(mouse.x,-mouse.y);

}

function onWindowResize(){

    //get new info about the window
    scrWIDTH = window.innerWidth;
    scrHEIGHT = window.innerHeight;
    scrASPECT = scrWIDTH / scrHEIGHT;
    quadMesh.material.uniforms._scrSizeAsp.value.set(scrWIDTH, scrHEIGHT, scrASPECT);
    renderer.setSize(scrWIDTH, scrHEIGHT);
}


function deg2rad(val){
    return val*(Math.PI/180);
}