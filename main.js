var stage;
var gameWorld;
var size = {width: 700, height: 300};
var viewPort = {x:0, y:0, width:32, height:32};
var viewWorld;
var background;
var map;

var imageList = [];

var waterSheet;

function load(){	
	var manifest = [
		{src:"./Images/Dirt.png",    id:"dirt"},
		{src:"./Images/Grass.png",   id:"grass"},
		{src:"./Images/Stone.png",   id:"stone"},
		{src:"./Images/Sand.png",    id:"sand"},
		{src:"./Images/Gravel.png",  id:"gravel"},
		{src:"./Images/Coal.png",    id:"coal"},
		{src:"./Images/Iron.png",    id:"iron"},
		{src:"./Images/Gold.png",    id:"gold"},
		{src:"./Images/Diamond.png", id:"diamond"},
		{src:"./Images/Water.png",   id:"water"},
		{src:"./Images/mrkrabs.jpg", id:"krabs"},
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
	background = new createjs.Container();
    stage = new createjs.Stage("canvas");
	
	waterSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["water"]], 16, 16, 4, {exist:[0,2]}));
    
	// Background image test
	var img = new createjs.Bitmap(imageList["krabs"]);
	img.scaleX = 21.875;
	img.scaleY = 9.375;
	background.addChild(img);
	
    generateWorld();
	alert("The world is built");
	
	viewWorld.addChild(background);
	viewWorld.addChild(gameWorld);
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function(event){tick(); stage.update(event)});
    
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
		//background.x += 5;
	} else if (key === 68){
		// D
		viewWorld.x -= 10;
		viewPort.x += 10;
		//background.x -= 5;
	} else if (key === 87){
		// W
		viewWorld.y += 10;
		viewPort.y -= 10;
		//background.y += 5;
	} else if (key === 83){
		// S
		viewWorld.y -= 10;
		viewPort.y += 10;
		//background.y -= 5;
	}
}

function tick(){
	draw();
}

function draw(){
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
					if (block.numChildren > 0 && block.alpha === 0){
						if (block.getChildAt(0).spriteSheet === waterSheet){
							map[i][j].alpha = 0.75;
						} else{
							map[i][j].alpha = 1;
						}	
					}
				} else{
					map[i][j].alpha = 0;
				}
			}
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
	if (Array.isArray(min)){
		var a = min;
		min = a[0];
		max = a[1];
	}
	
	min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}