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


init();











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
        renderer = new THREE.WebGLRenderer();
    else
        renderer = new THREE.CanvasRenderer(); 

    renderer.setSize(scrWIDTH, scrHEIGHT);
    container.appendChild( renderer.domElement );


    clock = new THREE.Clock;
    scene = new THREE.Scene;

    camera = new THREE.PerspectiveCamera(35, scrASPECT , 0.5, 200);
    scene.add(camera);

    //resize event
    window.addEventListener("resize", onWindowResize, false);
    
    //stats
    stats = new Stats;
    stats.domElement.style.position = "absolute";
    stats.domElement.style.bottom = "0px";
    stats.domElement.style.zIndex = 100; 
    container.appendChild(stats.domElement);

    texture = new THREE.ImageUtils.loadTexture( './textures/airport_night_final.jpg' );



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
            value: new THREE.Vector2(1,1)
        },
        //rotation matrix, provided as vec4, hmm there is no type for v2, so lets rebuild it in the shader
        _rotateUVmatrix:{
            type:"v4",
            value: new THREE.Vector4(1,0,0,1)
        },
        _skewXY:{
            type:"v2",
            value: new THREE.Vector2()
        },
        //texture
        _texture:{
            type:"t",
            value: texture
        }

    }

    //custom shader material
    quadMaterial = new THREE.ShaderMaterial({
        uniforms: quadUniforms,
        vertexShader: jQuery("#vertexShader").text(),
        fragmentShader: jQuery("#fragmentShader").text()
    });  

    //full screen quad
    quadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2,1,1), quadMaterial);
    scene.add(quadMesh);
    
    //start the render loop
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
}

function render(){

    renderer.render(scene, camera);

}


function onWindowResize(){

    //get new info about the window
    scrWIDTH = window.innerWidth;
    scrHEIGHT = window.innerHeight;
    console.log(scrWIDTH, scrHEIGHT);
    scrASPECT = scrWIDTH / scrHEIGHT;
    
    //apply where needed
    quadMesh.material.uniforms._scrSizeAsp.value.set(scrWIDTH, scrHEIGHT, scrASPECT);//say we want to let the shader know this
    renderer.setSize(scrWIDTH, scrHEIGHT);
}


function deg2rad(val){
    return val*(Math.PI/180);
}