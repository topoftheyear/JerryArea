var stage;
var gameWorld;
var size = {width: 700, height: 300};
var viewPort = {x:0, y:0, width:32, height:32};
var viewWorld;
var map;

var imageList = [];

function load(){	
	var manifest = [
		{src:"./Images/Dirt.png",  id:"dirt"},
		{src:"./Images/Grass.png", id:"grass"},
		{src:"./Images/Stone.png", id:"stone"},
	];
	
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
    alert("loaded");
    gameWorld = new createjs.Container();
	viewWorld = new createjs.Container();
    stage = new createjs.Stage("canvas");
    
    generateWorld();
	alert("The world is built");
	
	viewWorld.addChild(gameWorld);
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
    
    stage.addChild(viewWorld);
	stage.update();
    
    this.document.onkeydown = keyDown;
}

function keyDown(event){
    var key = event.keyCode;
	
    if (key === 65){
		// A
		viewWorld.x += 10;
		viewPort.x -= 10;
	} else if (key === 68){
		// D
		viewWorld.x -= 10;
		viewPort.x += 10;
	} else if (key === 87){
		// W
		viewWorld.y += 10;
		viewPort.y -= 10;
	} else if (key === 83){
		// S
		viewWorld.y -= 10;
		viewPort.y += 10;
	}
}

function tick(event){
	draw(event);
}

function draw(event){
	var xstart = Math.floor(viewPort.x / 16) - 1;
	var ystart = Math.floor(viewPort.y / 16) - 1;
	var xend = viewPort.width + xstart + 5;
	var yend = viewPort.height + ystart + 5;
	if (xstart < 0){
		xstart = 0;
	}
	if (ystart < 0){
		ystart = 0;
	}
	if (xend > size.width){
		xend = size.width;
	}
	if (yend > size.height){
		yend = size.height;
	}
	
	for (var i = xstart; i < xend; i++){
		for (var j = ystart; j < yend; j++){
			if (map[i][j] != undefined){
				var block = map[i][j];
				
				if ((block.x + 16 > viewPort.x && block.x < viewPort.width * 16 + viewPort.x) && (block.y + 16 > viewPort.y && block.y < viewPort.height * 16 + viewPort.y)){
					map[i][j].alpha = 1;
				} else{
					map[i][j].alpha = 0;
				}
			}
		}
	}
	stage.update();
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