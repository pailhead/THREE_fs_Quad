var pailhead = pailhead || {};

pailhead.ShaderLoader = function(){

        this.totalShaders = 0;
        this.loadedShaders = 0;
        this.onAllLoaded = function(){

    }

    this.load = function(url, callback){
        var scope = this;
        scope.totalShaders++;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange=function()
        {  
            if ( xhr.status === 200 || xhr.status === 0 ) {
                if (xhr.readyState==2) {
                    console.log('SHAD::: request received for shader - ' + url);
                }
                if (xhr.readyState==4 ){
                    // return shaderText;
                    var responseShader = xhr.responseText;
                    callback( responseShader );

                    scope.loadedShaders++;
                    console.log('SHAD::: finished loading shader - ' + url);
                    console.log("SHAD::: " + scope.loadedShaders + ' out of ' + scope.totalShaders);

                    if(scope.loadedShaders == scope.totalShaders){
                        console.log('SHAD::: loaded all shaders, calling scope.onAllLoaded()');
                        console.log('//////// //////// ////////');
                        scope.onAllLoaded();
                    }

                } 
            }
            else {
                console.log('SHAD::: shader not found! $#%#$^%$#');
                console.log(xhr.status);
            }
        }
        xhr.open("GET", url ,true);
        xhr.send();
    }
}