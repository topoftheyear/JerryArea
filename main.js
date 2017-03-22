var stage;
var gameWorld;
var size = 1000;

var queue;

function load(){
    queue = new createjs.LoadQueue(false);
    queue.on("complete", init, once=true);
    var loadItem = new createjs.LoadItem();
    loadItem.set({id:"testImage",src:"Images/Test.png"});
    queue.loadFile(loadItem);
}

function init(){
    gameWorld = new createjs.Container();
    stage = new createjs.Stage("canvas");
    
    generateWorld();
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
    
    stage.addChild(gameWorld);
    
    //this.document.onkeydown = keyDown;
}

function keyDown(event){
    alert("key");
    
}

function tick(event){
    stage.update(event);
}

function generateWorld(){
    map = new Array(size);
    for (var i = 0; i < map.length; i++){
        map[i] = new Array(size);
    }
    
    var imageData = queue.getResult("testImage");
    ssData.images.push(imageData);
    
    var testSheet = new createjs.SpriteSheet(generateSpriteSheet(ssData, 32, 32, 10, {exist:[0]}));
    
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            var block;
            
            block = new createjs.Sprite(testSheet, "exist");
            
            block.x = i * 32;
            block.y = j * 32;
            gameWorld.addChild(block);
        }
    }
}

function generateSpriteSheet(source, w, h, fps, animation){
    var img = new Image();
    img.crossOrigin="Anonymous";
    img.src = source;
    var data = {
        images: [img],
        frames: {width:w, height:h},
        framerate: fps,
        animations: animation
    }
    return data;
}