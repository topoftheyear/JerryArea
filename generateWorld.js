function generateWorld(){
	
	map = new Array(size.width);
    for (var i = 0; i < map.length; i++){
        map[i] = new Array(size.height);
    }
    
    var dirtSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["dirt"]], 16, 16, 0, {exist:[0]}));
	var grassSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["grass"]], 16, 16, 0, {exist:[0]}));
	var stoneSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["stone"]], 16, 16, 0, {exist:[0]}));
	var sandSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["sand"]], 16, 16, 0, {exist:[0]}));
	var gravelSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["gravel"]], 16, 16, 0, {exist:[0]}));
	var coalSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["coal"]], 16, 16, 0, {exist:[0]}));
	var ironSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["iron"]], 16, 16, 0, {exist:[0]}));
	var goldSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["gold"]], 16, 16, 0, {exist:[0]}));
	var diamondSheet = new createjs.SpriteSheet(generateSpriteSheet([imageList["diamond"]], 16, 16, 0, {exist:[0]}));
    
	// Fill the map with containers that will contain the block object
    for (var i = 0; i < size.width; i++){
        for (var j = 0; j < size.height; j++){
			var tempContainer = new createjs.Container();
            
            tempContainer.x = i * 16;
            tempContainer.y = j * 16;
			tempContainer.alpha = 0;
			tempContainer.on("mouseover", function(e){
				selection.x = this.x;
				selection.y = this.y;
			});
            gameWorld.addChild(tempContainer);
			map[i][j] = tempContainer;
        }
    }
	
	// Generate a basic ground and sky
	for (var i = 0; i < size.width; i++){
		for (var j = 0; j < size.height; j++){
			if (j > 100){
                addBlock(i, j, stoneSheet);
            } else if (j > 50){
				addBlock(i, j, dirtSheet);
            }
		}
	}
	
	// Generate hills
	var layerMin = 20;
    var layerMax = 100;
    var startingHeight = randomNumber(layerMin, layerMax);
	for (var i = 0; i < size.width; i++){
		for (var j = layerMin; j <= layerMax; j++){
			if (j >= startingHeight){
				addBlock(i, j, dirtSheet);
			} else{
				removeBlock(i,j);
			}
		}
		
		if (randomNumber(1,3) === randomNumber(1,3)){
			startingHeight = randomNumber(startingHeight - 2, startingHeight + 2);
		} else{
			startingHeight = randomNumber(startingHeight - 1, startingHeight + 1);
		}
		
		if (startingHeight > layerMax){
			startingHeight = layerMax - 1;
		} else if (startingHeight < layerMin){
			startingHeight = layerMin + 1;
		}
	}
    
    // Move stone layer similar to hills
    var layerMin = 90;
    var layerMax = 120;
    var startingHeight = randomNumber(layerMin, layerMax);
    for (var i = 0; i < size.width; i++){
        for (var j = layerMin; j <= layerMax; j++){
            if (j >= startingHeight){
                addBlock(i, j, stoneSheet);
            } else if (map[i][j].numChildren === 0){
                // This space left intentionally blank
            } else{
                addBlock(i, j, dirtSheet);
            }
        }
        
        switch(randomNumber(0,8)){
            case 0:
            case 1:
            case 2: /* startingHeight remains the same */ break;
            case 3:
            case 4: startingHeight--; break;
            case 5:
            case 6: startingHeight++; break;
            case 7: startingHeight += 2; break;
            case 8: startingHeight -= 2; break;
        }
            
        if (startingHeight > layerMax){
			startingHeight = layerMax - 1;
		} else if (startingHeight < layerMin){
			startingHeight = layerMin + 1;
		}
    }
	
	// Add desert
	var start = randomNumber(0, 550);
	var distance = randomNumber(50, 150);
	var depth = 40;
	for (var i = start; i < start + distance; i++){
		if (i > (distance / 2) + start){
			depth -= randomNumber(1,4);
		} else{
			depth += randomNumber(1,4);
		}
		for (var j = 0; j < 0 + depth; j++){
			if (map[i][j].numChildren > 0 && map[i][j].getChildAt(0).spriteSheet === dirtSheet){
				addBlock(i, j, sandSheet);
			}
		}
	}
	
	// Make stone veins
	veinGenerator(30, stoneSheet, "up", [40,60]);
	
	// Make gravel veins
	veinGenerator(50, gravelSheet, "all", [70,120]);
	
	// Make coal veins
	veinGenerator(70, coalSheet, "all", [5,30]);
	
	// Make iron veins
	veinGenerator(70, ironSheet, "mid", [5,25]);
	
	// Make gold veins
	veinGenerator(70, goldSheet, "low", [5,20]);
	
	// Make diamond veins
	veinGenerator(30, diamondSheet, "low", [5,15]);
	
	// Make caves
	var numCaves = 100;
	for (var a = 1; a <= numCaves; a++){
		var currentPlaced = 0;
		var maxPlaced = randomNumber(50,2500);
		var i = randomNumber(0, size.width - 1);
		var j = randomNumber(0, size.height - 1);
		
		while (currentPlaced < maxPlaced){
			removeBlock(i, j);
			currentPlaced++;
			
			if (randomNumber(1,2) === randomNumber(1,2)){
				if (i > 0){
					removeBlock(i - 1,j);
					currentPlaced++;
				}
			}
			if (randomNumber(1,2) === randomNumber(1,2)){
				if (i < size.width - 1){
					removeBlock(i + 1, j);
					currentPlaced++;
				}
			}
			if (randomNumber(1,2) === randomNumber(1,2)){
				if (j > 0){
					removeBlock(i,j - 1);
					currentPlaced++;
				}
			}
			if (randomNumber(1,2) === randomNumber(1,2)){
				if (j < size.height - 1){
					removeBlock(i, j + 1);
					currentPlaced++;
				}
			}
			
			switch (randomNumber(0,5)){
				case 0:
				case 1: if (i > 0){i--;} break;
				case 2:
				case 3: if (i < size.width - 1){i++;} break;
				case 4:
				case 5: break;
			}
			switch (randomNumber(0,5)){
				case 0:
				case 1: if (j > 0){j--;} break;
				case 2:
				case 3: if (j < size.height - 1){j++;} break;
				case 4:
				case 5: break;
			}
		}
	}
	
	// Add water
	var numLakes = 20;
	while (numLakes > 0){
		var startSuccess = false;
		while (!startSuccess){
			var istart = randomNumber(0,699);
			var jstart = randomNumber(75,200);
			if (map[istart][jstart].numChildren === 0){
				startSuccess = true;
			}
		}
		var i = istart;
		var j = jstart;
		var left = i;
		var right = i;
		var done = false;
		var direction = "left";
		
		while (!done){
			if (i === 0 || i === size.width - 1 || map[i][j] != undefined && map[i][j].numChildren > 0){
				if (direction === "left"){
					direction = "right";
					i = right;
				} else{
					direction = "left";
					for (var x = left; x <= right; x++){
						if (x >= 0 && x <= size.width && map[x][j].numChildren === 0){
							addBlock(x, j, waterSheet);
						}
					}
					j++;
					if (j > jstart + 50){
						done = true;
						numLakes--;
					}
				}
			} else if (map[i][j] != undefined && map[i][j].numChildren === 0){
				if (direction === "left"){
					if (i > 0){
						left--;
						i--;
					}
				} else{
					if (i < size.width - 1){
						right++;
						i++;
					}
				}
			}
		}
	}
	
	// Make all dirt blocks in the upper part that have air above them be grass
	for (var i = 0; i < size.width; i++){
		for (var j = 0; j < 150; j++){
			if (map[i][j].numChildren === 0 && map[i][j + 1].numChildren != 0 && map[i][j + 1].getChildAt(0).spriteSheet === dirtSheet){
				addBlock(i, j + 1, grassSheet);
			}
		}
	}
	
	// Generates veins
	function veinGenerator(numVeins, sheet, height, sizeBounds){
		for (var a = 1; a <= numVeins; a++){
			var currentPlaced = 0;
			var maxPlaced = randomNumber(sizeBounds);
			var i = 0;
			var j = 0;
			while(map[i][j].numChildren != 1){
				i = randomNumber(0, size.width - 1);
				if (height === "up"){
					j = randomNumber(40, 100);
				} else if (height === "low"){
					j = randomNumber(200, 299);
				} else if (height === "mid"){
					j = randomNumber(100, 200);
				} else if (height === "all"){
					j = randomNumber(40, 299);
				}
			}
		
			while (currentPlaced < maxPlaced){
				addBlock(i, j, sheet);
				currentPlaced++;
			
				if (randomNumber(1,3) === randomNumber(1,3)){
					if (i > 0){
						addBlock(i - 1, j, sheet);
						currentPlaced++;
					}
				}
				if (randomNumber(1,3) === randomNumber(1,3)){
					if (i < size.width - 1){
						addBlock(i + 1, j, sheet);
						currentPlaced++;
					}
				}
				if (randomNumber(1,3) === randomNumber(1,3)){
					if (j > 0){
						addBlock(i, j - 1, sheet);
						currentPlaced++;
					}
				}
				if (randomNumber(1,3) === randomNumber(1,3)){
					if (j < size.height - 1){
						addBlock(i, j + 1, sheet);
						currentPlaced++;
					}
				}
			
				switch (randomNumber(0,5)){
					case 0:
					case 1: if (i > 0){i--;} break;
					case 2:
					case 3: if (i < size.width - 1){i++;} break;
					case 4:
					case 5: break;
				}
				switch (randomNumber(0,5)){
					case 0:
					case 1: if (i > 0){j--;} break;
					case 2:
					case 3: if (j < size.height - 1){j++;} break;
					case 4:
					case 5: break;
				}
			}
		}
	}
}

function addBlock(i, j, block){
	removeBlock(i, j);
	map[i][j].addChild(new createjs.Sprite(block, "exist"));
}

function removeBlock(i, j){
	if(typeof(map) === "undefined"){
		console.log("AAAAAAAAAA");
	}
	else if (typeof(map[i]) === "undefined"){
		console.log("BBBBBBBBBB");
	}
	else if (typeof(map[i][j]) === "undefined"){
		console.log("CCCCCCCCCC");
		debugger;
	}
	if (typeof(map[i]) !== "undefined" && typeof(map[i][j]) !== "undefined" && map[i][j].numChildren > 0){
		map[i][j].removeAllChildren();
	}
}