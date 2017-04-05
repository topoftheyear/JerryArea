function generateWorld(){
    function addBlock(i, j, block){
		if (map[i][j].numChildren > 0){
			map[i][j].removeAllChildren();
		}
		map[i][j].addChild(block);
	}
	
	map = new Array(size.width);
    for (var i = 0; i < map.length; i++){
        map[i] = new Array(size.height);
    }
    
    var dirtData = imageList["dirt"];
	var grassData = imageList["grass"];
	var stoneData = imageList["stone"];
    
    var dirtSheet = new createjs.SpriteSheet(generateSpriteSheet([dirtData], 16, 16, 0, {exist:[0]}));
	var grassSheet = new createjs.SpriteSheet(generateSpriteSheet([grassData], 16, 16, 0, {exist:[0]}));
	var stoneSheet = new createjs.SpriteSheet(generateSpriteSheet([stoneData], 16, 16, 0, {exist:[0]}));
    
	// Fill the map with containers that will contain the block object
    for (var i = 0; i < size.width; i++){
        for (var j = 0; j < size.height; j++){
			var tempContainer = new createjs.Container();
            
            tempContainer.x = i * 16;
            tempContainer.y = j * 16;
			tempContainer.alpha = 0;
            gameWorld.addChild(tempContainer);
			map[i][j] = tempContainer;
        }
    }
	alert("containers added");
	
	// Generate a basic ground and sky
	for (var i = 0; i < size.width; i++){
		for (var j = 0; j < size.height; j++){
			if (j > 100){
                addBlock(i, j, block = new createjs.Sprite(stoneSheet));
            } else if (j > 50){
				addBlock(i, j, block = new createjs.Sprite(dirtSheet));
            }
		}
	}
	alert("ground and sky added");
	
	// Generate hills
	var startingHeight = randomNumber(20, 100);
	for (var i = 0; i < size.width; i++){
		for (var j = startingHeight; j <= 100; j++){
			addBlock(i, j, block = new createjs.Sprite(dirtSheet));
		}
		if (randomNumber(1,3) === randomNumber(1,3)){
			startingHeight = randomNumber(startingHeight - 2, startingHeight + 2);
		} else{
			startingHeight = randomNumber(startingHeight - 1, startingHeight + 1);
		}
		
		if (startingHeight > 100){
			startingHeight = 100;
		} else if (startingHeight < 20){
			startingHeight = 20;
		}
	}
	alert("hills made");
	
	// Make all dirt blocks that have air above them be grass
	for (var i = 0; i < size.width; i++){
		for (var j = 0; j < size.height - 1; j++){
			if (map[i][j].numChildren === 0 && map[i][j + 1].numChildren != 0 && map[i][j + 1].getChildAt(0).spriteSheet === dirtSheet){
				addBlock(i, j + 1, block = new createjs.Sprite(grassSheet));
			}
		}
	}
	alert("grassified");
}