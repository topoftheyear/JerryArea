function generateWorld(){
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
	
	// Generate a basic ground and sky
	for (var i = 0; i < size.width; i++){
		for (var j = 0; j < size.height; j++){
			if (j > 100){
                map[i][j].addChild(block = new createjs.Sprite(stoneSheet));
            } else if (j > 50){
				map[i][j].addChild(block = new createjs.Sprite(dirtSheet));
            }
		}
	}
}