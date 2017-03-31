var stage;
var gameWorld;
var size = {width: 400, height: 400};
var viewPort = {x:0, y:0, width:32, height:32, shape:null};
var viewWorld;

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
	viewWorld = new createjs.Container();
    stage = new createjs.Stage("canvas");
    
    generateWorld();
	
	g = new createjs.Graphics();
	viewPort.shape = new createjs.Shape(g.beginFill("white").drawRect(viewPort.x, viewPort.y, viewPort.width * 16, viewPort.height * 16));
	viewPort.shape.alpha = 0.5;
	
	viewWorld.addChild(gameWorld);
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
    
    stage.addChild(viewWorld);
	stage.addChild(viewPort.shape);
	stage.update();
    
    this.document.onkeydown = keyDown;
}

function keyDown(event){
    var key = event.keyCode;
	
    if (key === 65){
		// A
		viewWorld.x += 16;
		viewPort.x -= 1;
	} else if (key === 68){
		// D
		viewWorld.x -= 16;
		viewPort.x += 1;
	} else if (key === 87){
		// W
		viewWorld.y += 16;
		viewPort.y -= 1;
	} else if (key === 83){
		// S
		viewWorld.y -= 16;
		viewPort.y += 1;
	}
}

function tick(event){
	draw(event);
}

function draw(event){
	var xstart = viewPort.x - 10;
	var ystart = viewPort.y - 10;
	if (xstart < 0){
		xstart = 0;
	}
	if (ystart < 0){
		ystart = 0;
	}
	for (var i = xstart; i < viewPort.width + 10; i++){
		for (var j = ystart; j < viewPort.height + 10; j++){
			if (map[i][j] != undefined){
				var block = map[i][j];
				var rect = viewPort.shape;
				
				var pt = block.localToLocal(block.x, block.y, rect);
				var pt2 = block.localToLocal(block.x + 16, block.y + 16, rect);
				
				if (rect.hitTest(pt.x, pt.y) && rect.hitTest(pt2.x, pt2.y)){
					block.alpha = 1;
				} else{
					block.alpha = 0.5;
				}
				
				/*if ((block.x + 16 > rect.x || block.x < viewPort.width * 16 + viewPort.x) || (block.y + 16 > rect.y || block.y < viewPort.height * 16 + viewPort.y)){
					map[i][j].alpha = 1;
				} else{
					map[i][j].alpha = 0;
				}*/
			}
		}
	}
	stage.update();
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
			var tempContainer = new createjs.Container();
            
            block = new createjs.Sprite(testSheet, "exist");
            
			tempContainer.addChild(block);
            tempContainer.x = i * 16;
            tempContainer.y = j * 16;
			tempContainer.alpha = 0;
            gameWorld.addChild(tempContainer);
			map[i][j] = tempContainer;
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