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
var keyboard = {keyA:false, keyD:false, keySpace:false, keyI:false, keyJ:false, keyK:false, keyL:false};

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
	
	// Character
	var characterSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["character"]], 24, 36, 6, {exist:[0]}));
	character = new createjs.Container();
	character.addChild(new createjs.Sprite(characterSheet, "exist"));
	character.x += 244;
	character.y += 238;
	gameWorld.addChild(character);
	
	viewWorld.addChild(background);
	viewWorld.addChild(gameWorld);
    
	// Ticker
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function(event){tick(); stage.update(event)});
    
    stage.addChild(viewWorld);
	stage.update();
    
	// Keyboard input
	var map = [];
	onkeydown = onkeyup = function(e){
		e = e || event;
		map[e.keyCode] = e.type == 'keydown';
		if (map[32]){
			// Space
			keyboard.keySpace = true;
		} else{
			keyboard.keySpace = false;
		}
		if (map[65]){
			// A
			keyboard.keyA = true;
		} else{
			keyboard.keyA = false;
		}
		if (map[68]){
			// D 
			keyboard.keyD = true;
		} else{
			keyboard.keyD = false;
		}
		if (map[73]){
			// I
			keyboard.keyI = true;
		} else{
			keyboard.keyI = false;
		}
        if (map[74]){
			// J
			keyboard.keyJ = true;
		} else{
			keyboard.keyJ = false;
		}
        if (map[75]){
			// K
			keyboard.keyK = true;
		} else{
			keyboard.keyK = false;
		}
        if (map[76]){
			// I
			keyboard.keyL = true;
		} else{
			keyboard.keyL = false;
		}
	}
	character.addEventListener('keydown', onkeydown);
	character.addEventListener('keyup', onkeyup);
}

function tick(){
	keyboardInput();
	physicsCheck();
	updateCamera();
	draw();
}

function keyboardInput(){
	if (keyboard.keySpace){
		if (grounded){
			verticalVelocity -= 15;
			grounded = false;
		}
	}
	if (keyboard.keyA){
		horizontalVelocity = -5;
	}
	if (keyboard.keyD){
		horizontalVelocity = 5;
	}
	if (keyboard.keyI){
		character.y -= 5;
		viewWorld.y += 5;
	}
    if (keyboard.keyJ){
		character.x -= 5;
		viewWorld.x += 5;
	}
    if (keyboard.keyK){
		character.y += 5;
		viewWorld.y -= 5;
	}
    if (keyboard.keyL){
		character.x += 5;
		viewWorld.x -= 5;
	}
}

function physicsCheck(){
	var collisionOccurred = false;
	verticalVelocity++;
	
	// Horizontal Collision
	if (horizontalVelocity !== 0){
		var currentPositionX = character.x;
		var nextPositionX = currentPositionX + horizontalVelocity;
		var topy = character.y;
		var bottomy = character.y + 36;
		
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
								if (nextPositionX >= block.x && nextPositionX <= block.x + 16 || nextPositionX + 24 >= block.x && nextPositionX + 24 <= block.x + 16){
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
		var rightx = character.x + 24;
		
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
								if ((nextPositionY + 36 >= block.y && nextPositionY + 36 <= block.y + 16) || (nextPositionY >= block.y && nextPositionY <= block.y + 16)){
									colliding = true;
									collisionOccurred = true;
									verticalVelocity = reduce(verticalVelocity);
									nextPositionY = currentPositionY + verticalVelocity;
									if (verticalVelocity === 0){
										colliding = false;
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
	var xstart = Math.floor(viewPort.x / 16) - 2;
	var ystart = Math.floor(viewPort.y / 16) - 2;
	var xend = viewPort.width + xstart + 4;
	var yend = viewPort.height + ystart + 4;
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
						if (block.getChildAt(0).spriteSheet == waterSheet){
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