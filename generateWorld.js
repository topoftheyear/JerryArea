function generateWorld(){
    
    function addBlock(i, j, block){
		removeBlock(i, j);
		map[i][j].addChild(new createjs.Sprite(block));
	}
	
	function removeBlock(i, j){
		if(typeof(map) === "undefined"){
			console.log("AAAAAAAAAA");
		}
		else if (typeof(map[i]) === "undefined"){
			console.log("BBBBBBBBBB");
		}
		else if (typeof(map[i][j]) === "undefined"){
			console.log("CCCCCCCCCCCCC");
			debugger;
		}
		if (typeof(map[i]) !== "undefined" && typeof(map[i][j]) !== "undefined" && map[i][j].numChildren > 0){
			map[i][j].removeAllChildren();
		}
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
			//if (typeof(tempContainer) === "undefined"){}
			map[i][j] = tempContainer;
        }
    }
	alert("containers added");
	
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
	alert("ground and sky added");
	
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
	alert("hills made");
    
    // Move stone layer similar to hills
    var layerMin = 80;
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
    alert("stone layer varied");
    
    // For making holes or chunks of ore or stone or etc, try having a variable keep track of the total number of blocks 
    // placed then decrease the chances of branching out based on that number, randomNumber(0, 1 + number / 4)?
    // Try finding a spot inside the layer, i = randomNumber, j = randomNumber, and branch out using i +- 1 and j += 1 so that it wont be left or right biased
    
    // Or maybe
    // i = random, j = random
    // while(current < max)
        // changeBlock(i,j,whatever)
        // maybe also (i +- 1, j += 1, whatever)
        // or (random i +- 1, random j +- 1, whatever)
        // then current + however many
        //
        // then random a number to choose a direction
        // switch (random)
        // case #: i++
        // case #: j++
        // case #: i--
        // case #: j--
    // repeat until the max has been hit
    // then repeat again until the chosen type max has been hit
	
	var numVeins = 30;
	for (var a = 1; a <= numVeins; a++){
		var currentPlaced = 0;
		var maxPlaced = randomNumber(15,50);
		var i = 0;
		var j = 0;
		while(map[i][j].numChildren != 1){
			i = randomNumber(0, size.width - 1);
			j = randomNumber(40, 100);
		}
		
		while (currentPlaced < maxPlaced){
			addBlock(i, j, stoneSheet);
			currentPlaced++;
			
			if (randomNumber(1,3) === randomNumber(1,3)){
				if (i > 0){
					addBlock(i - 1, j, stoneSheet);
					currentPlaced++;
				}
			}
			if (randomNumber(1,3) === randomNumber(1,3)){
				if (i < size.width - 1){
					addBlock(i + 1, j, stoneSheet);
					currentPlaced++;
				}
			}
			if (randomNumber(1,3) === randomNumber(1,3)){
				addBlock(i, j - 1, stoneSheet);
				currentPlaced++;
			}
			if (randomNumber(1,3) === randomNumber(1,3)){
				addBlock(i, j + 1, stoneSheet);
				currentPlaced++;
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
				case 1: j--; break;
				case 2:
				case 3: j++; break;
				case 4:
				case 5: break;
			}
		}
	}
	alert("stone veins added");
	
	var numCaves = 50;
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
	alert("caves added");
	
	// Make all dirt blocks in the upper part that have air above them be grass
	for (var i = 0; i < size.width; i++){
		for (var j = 0; j < 150; j++){
			if (map[i][j].numChildren === 0 && map[i][j + 1].numChildren != 0 && map[i][j + 1].getChildAt(0).spriteSheet === dirtSheet){
				addBlock(i, j + 1, grassSheet);
			}
		}
	}
	alert("grassified");
}