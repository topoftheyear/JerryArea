var stage;
var gameWorld;
var size = {width: 700, height: 300};
var viewPort = {x:0, y:0, width:32, height:32};
var viewWorld;
var background;
var map;
var character;
var grounded = false;
var verticalVelocity = 0;
var horizontalVelocity = 0;

var imageList = [];

var waterSheet;

function load(){	
	var manifest = [
		{src:"./Images/Dirt.png",       id:"dirt"},
		{src:"./Images/Grass.png",      id:"grass"},
		{src:"./Images/Stone.png",      id:"stone"},
		{src:"./Images/Sand.png",       id:"sand"},
		{src:"./Images/Gravel.png",     id:"gravel"},
		{src:"./Images/Coal.png",       id:"coal"},
		{src:"./Images/Iron.png",       id:"iron"},
		{src:"./Images/Gold.png",       id:"gold"},
		{src:"./Images/Diamond.png",    id:"diamond"},
		{src:"./Images/Water.png",      id:"water"},
		{src:"./Images/background.png", id:"background"},
		{src:"./Images/Character.png",  id:"character"},
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
    
	// Background image
	var img = new createjs.Bitmap(imageList["background"]);
	background.addChild(img);
	
    generateWorld();
	alert("The world is built");
	
	var characterSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["character"]], 28, 42, 6, {exist:[0]}));
	character = new createjs.Container();
	character.addChild(new createjs.Sprite(characterSheet, "exist"));
	character.x += 242;
	character.y += 235;
	gameWorld.addChild(character);
	
	viewWorld.addChild(background);
	viewWorld.addChild(gameWorld);
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function(event){tick(); stage.update(event)});
    
    stage.addChild(viewWorld);
	stage.update();
    
	// Keyboard input
	var map = {};
	onkeydown = onkeyup = function(e){
		e = e || event;
		map[e.keyCode] = e.type == 'keydown';
		/*if (map[65] && map[32] && grounded){
			// A and Space
			grounded = false;
			verticalVelocity = -15;
			horizontalVelocity = -5;
		} else if (map[68] && map[32] && grounded){
			// D and Space
			grounded = false;
			verticalVelocity = -15;
			horizontalVelocity = 5;
		} else */
		if (map[32] && grounded){
			// Space
			grounded = false;
			verticalVelocity = -15;
		}
		if (map[65]){
			// A
			horizontalVelocity = -5;
		} 
		if (map[68]){
			// D 
			horizontalVelocity = 5;
		}
		
		map = {};
	}
	character.addEventListener('keypress', onkeydown);
}

function tick(){
	physicsCheck();
	updateCamera();
	draw();
}

function physicsCheck(){
	var collisionOccurred = false;
	verticalVelocity++;
	
	// Horizontal Collision
	if (horizontalVelocity !== 0){
		var currentPositionX = character.x;
		var nextPositionX = currentPositionX + horizontalVelocity;
		var topy = character.y;
		var bottomy = character.y + 42;
		
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
			for (var j = ystart ; j < yend; j++){
				if (map[i][j] != undefined && map[i][j].numChildren > 0 && map[i][j].getChildAt(0).spriteSheet != waterSheet){
					var block = map[i][j];
					var colliding = false;
					
					for (var x = topy; x <= bottomy; x++){
						do{
							if (x >= block.y && x <= block.y + 16){
								if (nextPositionX >= block.x && nextPositionX <= block.x + 16 || nextPositionX + 28 >= block.x && nextPositionX + 28 <= block.x + 16){
									colliding = true;
									horizontalVelocity = reduce(horizontalVelocity);
									nextPositionX = currentPositionX + horizontalVelocity;
									if (horizontalVelocity === 0){
										colliding = false;
										break;
									}
								} else{
									colliding = false;
								}
							}
						}while(colliding);
					}
				}
			}
		}
	}
	
	// Vertical Collision
	if (verticalVelocity !== 0){
		var currentPositionY = character.y;
		var nextPositionY = currentPositionY + verticalVelocity;
		var leftx = character.x;
		var rightx = character.x + 28;
		
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
			for (var j = ystart ; j < yend; j++){
				if (map[i][j] != undefined && map[i][j].numChildren > 0 && map[i][j].getChildAt(0).spriteSheet != waterSheet){
					var block = map[i][j];
					var colliding = false;
					
					for (var x = leftx; x <= rightx; x++){
						do{
							if (x >= block.x && x <= block.x + 16){
								if ((nextPositionY + 42 >= block.y && nextPositionY + 42 <= block.y + 16) || (nextPositionY >= block.y && nextPositionY <= block.y + 16)){
									colliding = true;
									collisionOccurred = true;
									verticalVelocity = reduce(verticalVelocity);
									nextPositionY = currentPositionY + verticalVelocity;
									if (verticalVelocity === 0){
										colliding = false;
										break;
									}
								} else{
									colliding = false;
								}
							}
						}while(colliding);
					}
				}
			}
		}
	}
	if (collisionOccurred){
		grounded = true;
	} else{
		grounded = false;
	}
	
	horizontalVelocity = reduce(horizontalVelocity);
	
	if (verticalVelocity > 20){
		verticalVelocity = 20;
	} else if (verticalVelocity < -20){
		verticalVelocity = -20;
	}
	
	character.x += horizontalVelocity;
	viewWorld.x -= horizontalVelocity;
	character.y += verticalVelocity;
	viewWorld.y -= verticalVelocity;
}

function updateCamera(){
	viewPort.x = character.x + 14 - (viewPort.width * 16 / 2);
	viewPort.y = character.y + 21 - (viewPort.height * 16 / 2);
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

function reduce(number){
	if (number > 0){
		return(number - 1);
	} else if (number < 0){
		return(number + 1);
	} else{
		return(number);
	}
}