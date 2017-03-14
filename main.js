var stage;
var gameWorld;

function load(){
    init();
}

function init(){
    gameWorld = new createjs.Container();
    stage = new createjs.Stage("canvas");
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
    
    stage.addChild(gameWorld);
    
    this.document.onkeydown = keyDown;
}

function keyDown(event){
    alert("key");
    
}

function tick(event){
    stage.update(event);
}