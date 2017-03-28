var stage;
var gameWorld;
var size = {width: 100, height: 100};

var imageList = [];

function load(){	
	var manifest = [
		{src:"./Images/Test.png", id:"testImage"}
	]
	
	var loader = new createjs.LoadQueue(false);
	loader.on("complete", init, this);
	loader.on("fileload", handleFileLoad, this)
	loader.loadManifest(manifest);
}

function handleFileLoad(f){
	if (f.item.type == "image"){
		imageList[f.item.id] = f.result;
	}
}

function init(){
    gameWorld = new createjs.Container();
    stage = new createjs.Stage("canvas");
    
    generateWorld();
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
    
    stage.addChild(gameWorld);
    
    this.document.onkeydown = keyDown;
}

function keyDown(event){
    var key = event.keyCode;
	
    if (key === 65){
		// A
		gameWorld.x += 5;
	} else if (key === 68){
		// D
		gameWorld.x -= 5;
	} else if (key === 87){
		// W
		gameWorld.y += 5;
	} else if (key === 83){
		// S
		gameWorld.y -= 5;
	}
}

function tick(event){
    stage.update(event);
}

function generateWorld(){
    map = new Array(size.width);
    for (var i = 0; i < map.length; i++){
        map[i] = new Array(size.height);
    }
    
    var imageData = imageList["testImage"];
    
    var testSheet = new createjs.SpriteSheet(generateSpriteSheet([imageData], 16, 16, 0, {exist:[0]}));
    
    for (var i = 0; i < size.width; i++){
        for (var j = 0; j < size.height; j++){
            var block;
            
            block = new createjs.Sprite(testSheet, "exist");
            
            block.x = i * 16;
            block.y = j * 16;
            gameWorld.addChild(block);
        }
    }
}

function generateSpriteSheet(source, w, h, fps, animation){
    var data = {
        images: source,
        frames: {width:w, height:h},
        framerate: fps,
        animations: animation
    }
    return data;
}

function randomNumber(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}