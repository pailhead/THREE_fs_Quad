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
    tileY: 1
};


var gui = new dat.GUI({});


gui.add(guiParam, "tileX", 1, 30).onChange(function(){

    quadMesh.material.uniforms._tileUV.value.setX(guiParam.tileX);

});

gui.add(guiParam, "tileY", 1, 30).onChange(function(){

    quadMesh.material.uniforms._tileUV.value.setY(guiParam.tileY);
    
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