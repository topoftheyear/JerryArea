var stage;
var gameWorld;
var size = {width: 700, height: 300};
var viewPort = {x:0, y:0, width:64, height:64};
var viewWorld;
var viewWorldInfo = {x:0, y:0};
var background;
var map;
var character;
var grounded = false;
var verticalVelocity = 0;
var horizontalVelocity = 0;
var cheatMovement = {x:0, y:0};
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
	
	// Character
	var characterSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["character"]], 24, 36, 6, {exist:[0]}));
	character = new createjs.Container();
	character.addChild(new createjs.Sprite(characterSheet, "exist"));
	character.x += 244;
	character.y += 238;
	gameWorld.addChild(character);
	
	generateWorld();
	alert("The world is built");
	
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
	collisionCheck();
	playerMovement();
	positionRestraint();
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
		cheatMovement.y = -5;
	} else if (keyboard.keyK){
		cheatMovement.y = 5;
	} else{
		cheatMovement.y = 0;
	}
    if (keyboard.keyJ){
		cheatMovement.x = -5;
	} else if (keyboard.keyL){
		cheatMovement.x = 5;
	} else{
		cheatMovement.x = 0;
	}
    
    
}

function collisionCheck(){
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
}

function playerMovement(){
	character.x += horizontalVelocity;
	viewWorld.x -= horizontalVelocity;
	viewWorldInfo.x -= horizontalVelocity;
	character.y += verticalVelocity;
	viewWorld.y -= verticalVelocity;
	viewWorldInfo.y -= verticalVelocity;
	
	character.x += cheatMovement.x;
	viewWorld.x -= cheatMovement.x;
	viewWorldInfo.x -= cheatMovement.x;
	character.y += cheatMovement.y;
	viewWorld.y -= cheatMovement.y;
	viewWorldInfo.y -= cheatMovement.y;
}

function positionRestraint(){
	character.x = clamp(character.x, 0, size.width * 16);
	character.y = clamp(character.y, 0, size.height * 16 + 24);
	viewWorld.x = clamp(viewWorld.x, 0 - size.width * 16 + 512, 0);
	viewWorld.y = clamp(viewWorld.y, 0 - size.height * 16 + 512, 0);
	viewWorldInfo.x = clamp(viewWorldInfo.x, 0 - size.width * 16 + 512 - 256 + 12, 256 - 12);
	viewWorldInfo.y = clamp(viewWorldInfo.y, 0 - size.height * 16 + 512 - 256 + 18, 256 - 18);
	
	viewWorld.x = viewWorldInfo.x;
	viewWorld.y = viewWorldInfo.y;
	
	if (viewWorld.x < 0 - size.width * 16 + 512){
		viewWorld.x = 0 - size.width * 16 + 512;
	} else if (viewWorld.x > 0){
		viewWorld.x = 0;
	}
	
	if (viewWorld.y < 0 - size.height * 16 + 512){
		viewWorld.y = 0 - size.height * 16 + 512;
	} else if (viewWorld.y > 0){
		viewWorld.y = 0;
	}
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
					} else if (block.numChildren > 0){
						if (block.getChildAt(0).spriteSheet == waterSheet){
							if (i > 0 && i < size.width && j > 0 && j < size.height){
								if (map[i][j+1].numChildren === 0){
									removeBlock(i,j);
									addBlock(i,j+1,waterSheet);
								} else if (map[i-1][j].numChildren === 0 && map[i-1][j+1].numChildren === 0){
									removeBlock(i,j);
									addBlock(i-1,j,waterSheet);
								} else if (map[i+1][j].numChildren === 0 && map[i+1][j+1].numChildren === 0){
									removeBlock(i,j);
									addBlock(i+1,j,waterSheet);
								}
							}
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