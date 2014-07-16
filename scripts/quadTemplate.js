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



var video;

////////////
//gui 
////////////


var guiParam = {
    tileX: 1,
    tileY: 1,
    scanline: 1,
    choice: '',
    crclR:1,
    crclF:.9,
    lerp:function(){},
    circleLight: false,
    mouseLight: false,
    indx:0
};


var gui = new dat.GUI({});
var circleTile = {
    x:1,
    y:1
}

gui.add(guiParam, "tileX", 1, 100).name("tile circle").onChange(function(){
    circleTile.x = guiParam.tileX*scrASPECT;
    circleTile.y = guiParam.tileX;
    quadMesh.material.uniforms._tileUV.value.set(circleTile.x,circleTile.y);
    quadMesh.material.uniforms._tileUVinv.value.set(1/circleTile.x, 1/circleTile.y);
});

// gui.add(guiParam, "tileY", 1, 200).onChange(function(){
//     quadMesh.material.uniforms._tileUV.value.setY(guiParam.tileY);
// });

gui.add(guiParam, "scanline", 1, 30).onChange(function(){
    quadMesh.material.uniforms._scanline.value = guiParam.scanline;
});
gui.add(guiParam, "crclR", 0, 1).onChange(function(){
    quadMesh.material.uniforms._crcl.value.setX( guiParam.crclR );
});
gui.add(guiParam, "crclF", 0, 1).onChange(function(){
    quadMesh.material.uniforms._crcl.value.setY( guiParam.crclF );
});
gui.add(guiParam, "indx", 0, 100).step(1).onChange(function(){
    quadMesh.material.uniforms._index.value = guiParam.indx;
});


var ssChoice = [ "vanilla", "scanline", "circles", "circles3D" ];

gui.add(guiParam, 'choice', ssChoice ).name('effect').onChange( function() {

    if (guiParam.choice == 'scanline'){
        quadMesh.material.uniforms._choice.value = 0;

    } else if (guiParam.choice == 'circles'){
        quadMesh.material.uniforms._choice.value = 1;

    } else if (guiParam.choice == 'vanilla'){
        quadMesh.material.uniforms._choice.value = 2;

    } else if (guiParam.choice == 'circles3D'){
        quadMesh.material.uniforms._choice.value = 3;
    }
    console.log('foo');
    console.log(quadMesh.material.uniforms._choice.value);
});



var flipflop = true;
gui.add(guiParam, "circleLight").onChange(function(){
    quadMesh.material.uniforms._circleLight.value = guiParam.circleLight?1:0;
});
gui.add(guiParam, "mouseLight").onChange(function(){
    quadMesh.material.uniforms._mouseLight.value = guiParam.mouseLight?1:0;
});



var flipflop = true;
gui.add(guiParam, "lerp").onChange(function(){
    // if(flipflop)
});




var shaderLoader = new pailhead.ShaderLoader();

shaderLoader.onAllLoaded = function(){
    init();
}

$(document).ready(function(){

    shaderLoader.load(
        './shaders/plane_bak.vert',
        function( shader ){
            shad_Buff = shader;
    });

    shaderLoader.load(
        './shaders/plane.vert',
        function( shader ){
            shad_planeVert = shader;
    });

    shaderLoader.load(
        './shaders/plane2.frag',
        function( shader ){
            shad_planeFrag = shader;
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
    circleTile.x = guiParam.tileX*scrASPECT;
    circleTile.y = guiParam.tileX;
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


    clock = new THREE.Clock;
    scene = new THREE.Scene;

    camera = new THREE.PerspectiveCamera(35, scrASPECT , 0.5, 200);
    camera.position.x = 6;
    camera.position.y = 4;
    camera.position.z = 6;
    scene.add(camera);

    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );

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
    video = document.createElement( 'video' );
    video.id = 'video';
    // video.type = ''
    video.src = './textures/tmobile-usage_map-new_legends-1493x840-1536kv.mp4';
    video.load();

    console.log(video);

    videoImage = document.createElement( 'canvas' );
    videoImage.width = 1493;
    videoImage.height = 840;

    videoCtx = videoImage.getContext( '2d' );
    videoCtx.fillStyle = '#ff0000';
    videoCtx.fillRect = (0, 0, videoImage.width, videoImage.height);

    videoTexture = new THREE.Texture( videoImage );
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    video.play();

    console.log(videoTexture);
    video.loop = true;


    //custom uniforms
    var quadUniforms = {
        //vector3 screen size in pixels, and aspect ratio
        _scrSizeAsp:{
            type:"v3",
            value: new THREE.Vector3()
        },

        //vec2 for UV tiling
        _tileUV:{
            type:"v2",
            value: new THREE.Vector2(circleTile.x,circleTile.y)
        },

        _scanline:{
            type:"f",
            value: guiParam.scanline
        },

        //texture
        _texture:{
            type:"t",
            // value: texture
            value: videoTexture
        },
        _choice:{
            type:"i",
            // value: guiParam.choice
            value: 2
        },
        _mouseLight:{
            type:"i",
            // value: guiParam.choice
            value: 0
        },
        _circleLight:{
            type:"i",
            // value: guiParam.choice
            value: 0
        },
        _crcl:{
            type:"v2",
            value:new THREE.Vector2(guiParam.crclF, guiParam.crclR)
        },
        _mousePos:{
            type:"v2",
            value:new THREE.Vector2(mouse.x, mouse.y)
        },
        _screenStuff:{
            type:"v4",
            value:new THREE.Vector4(scrASPECT,0,0,0)
        },
        _tileUVinv:{
            type:"v2",
            value:new THREE.Vector2(1/circleTile.x,1/circleTile.y)
        },
        _index:{
            type:"f",
            value:guiParam.indx
        }

    }

    //custom shader material
    quadMaterial = new THREE.ShaderMaterial({
        uniforms: quadUniforms,
        vertexShader: shad_planeVert,
        fragmentShader: shad_planeFrag,
        depthTest: false
    });  
    //custom shader material
    buffMat = new THREE.ShaderMaterial({
        uniforms: quadUniforms,
        vertexShader: shad_Buff,
        fragmentShader: shad_planeFrag,
        depthTest: false
    });  


    // full screen quad
    // quadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2,1,1), quadMaterial);
    // scene.add(quadMesh);

    //buffer planes

    quadMesh = new THREE.Mesh( PlaneBuffer(20000), buffMat);
    scene.add(quadMesh);
    console.log(quadMesh);

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

    stats.update();
    controls.update();
    // console.log(camera.position.x);
}

function render(){
    // renderer.clear();   

    if( video.readyState === video.HAVE_ENOUGH_DATA ){
        videoCtx.drawImage( video, 0, 0);
        if( videoTexture )
            videoTexture.needsUpdate = true;
    }
    renderer.render(scene, camera);

}

function onMouseMove(evt){

    // console.log( evt.clientX, evt.clientY );
    mouse.x=evt.clientX/scrWIDTH;
    mouse.x=mouse.x*2-1;
    mouse.y=evt.clientY/scrHEIGHT;
    mouse.y=mouse.y*2-1;

    quadMesh.material.uniforms._mousePos.value.set(mouse.x,-mouse.y);

}

function onWindowResize(){

    //get new info about the window
    scrWIDTH = window.innerWidth;
    scrHEIGHT = window.innerHeight;
    console.log(scrWIDTH, scrHEIGHT);
    scrASPECT = scrWIDTH / scrHEIGHT;
    quadMesh.material.uniforms._tileUV.value.setX(guiParam.tileX*scrASPECT);
    quadMesh.material.uniforms._tileUVinv.value.setX(1/(guiParam.tileX*scrASPECT));
    quadMesh.material.uniforms._screenStuff.value.setX(scrASPECT);
    
    //apply where needed
    quadMesh.material.uniforms._scrSizeAsp.value.set(scrWIDTH, scrHEIGHT, scrASPECT);//say we want to let the shader know this
    renderer.setSize(scrWIDTH, scrHEIGHT);
}


function deg2rad(val){
    return val*(Math.PI/180);
}