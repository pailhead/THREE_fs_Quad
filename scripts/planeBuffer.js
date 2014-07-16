function PlaneBuffer( numPlanes ){


	// var numCubes = wPoss.length;

	console.log("::PLANES generating "+numPlanes+" planes");
	console.time("::PLANES added");

	console.log("::PLANES initializing buffers");
	console.time("::PLANES buffers initialized");

	bufferGeom = new THREE.BufferGeometry();

	var i,j,k,l;

	// var PLANETRI = 2;
	var verts = [];
	var faces = [];
	var normals = [];
	
	// console.log(wPoss[0]);

	//8 verts
	//baza
	verts.push([ -1, 0 ,-1]);
	verts.push([ -1, 0 , 1]);//3 ccw
	verts.push([  1, 0 , 1]);
	verts.push([  1, 0 ,-1]);//0
	//top
	// verts.push([ -1, 1 ,-1]);
	// verts.push([  1, 1 ,-1]);
	// verts.push([  1, 1 , 1]);//4
	// verts.push([ -1, 1 , 1]);//7 ccw


	//10 tris
	//5 sides
	faces.push([0,2,1]);
	faces.push([0,3,2]);

	// faces.push([1,5,2]);
	// faces.push([2,5,6]);

	// faces.push([2,6,3]);
	// faces.push([3,6,7]);

	// faces.push([3,7,0]);
	// faces.push([0,7,4]);
	// //top
	// faces.push([4,6,5]);
	// faces.push([6,4,7]);


	//5 normals;
	// normals.push([ 0,0,-1 ]);
	// normals.push([ 1,0,0  ]);
	// normals.push([ 0,0,1  ]);
	// normals.push([ -1,0,0 ]);
	normals.push([ 0,1,0  ]);

	//cube:
	//_triangles = 10;
	//_vertsTotal = 30;
	//_vertsComponents = 90;


	var totalTriangles = numPlanes * 2 * 3; //numPlanes * planeTri * verts

	bufferGeom.addAttribute( 'position', Float32Array , totalTriangles , 3 );
	bufferGeom.addAttribute( 'normal', Float32Array , totalTriangles , 3 );
	var vertAtt = 	bufferGeom.attributes.position.array;
	var normAtt = 	bufferGeom.attributes.normal.array;
	var scale = 1;
	console.timeEnd("::PLANES buffers initialized");
	console.log("::PLANES filling buffers");
	console.time("::PLANES buffers filled");


	var fvInd, vert, face, norm;

	for( l = 0; l<numPlanes; l++){
		for( i = 0; i < 2; i++){
			face = faces[i];
			norm = normals[0];//ne treba
			for(j=0;j<3;j++){ //vertovi fejsa
				vert = verts[face[j]];
				vert[1]=l;
				fvInd = ((l*2+i)*3+j)*3; //vert vejsa
				for(k=0;k<3;k++){//komponenta fejsa
					vertAtt[  fvInd + k ] = vert[k];
					normAtt[  fvInd + k ] = norm[k];
				}
			}
		}
	}
	console.timeEnd("::PLANES buffers filled");

	// totalTriangles/=3;

	// $('#tris').html(numberWithCommas(totalTriangles));
	// $('#zipcodes').html(numberWithCommas(numCubes));

	console.timeEnd("::PLANES added");
	return bufferGeom;

	//////////////////////////////////
	// var cubeMesh = new THREE.Mesh(
	// 	bufferGeom,
	// 	// new THREE.MeshBasicMaterial({wireframe:true})
	// 	Materials.cubes
	// );
	// console.log(cubeMesh.geometry);
	// // scene.add(cubeMesh);
}



function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}