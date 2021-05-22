var PLAY = 1;
var END = 0;
var gameState = PLAY;

var replay ,replayimg ; 

var gameoverimg, gameover ;

var checkpointS,jumpS ,gameoverS;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score, bg, bgImg;


function preload(){

  bgImg = loadImage("Images/bg.jpg");

  trex_running = loadAnimation("Images/Run/Run(1).png","Images/Run/Run(2).png","Images/Run/Run(3).png","Images/Run/Run(4).png","Images/Run/Run(5).png", "Images/Run/Run(6).png","Images/Run/Run(7).png","Images/Run/Run(8).png");
  
  trex_collided = loadImage("Images/Run/Dead(5).png");
  
  checkpointS = loadSound("checkPoint.mp3");
  
  jumpS = loadSound("jump.mp3");
  
  gameoverS = loadSound("die.mp3");
  
  groundImage = loadImage("Images/Ground-Desert.png");
  
  cloudImage = loadImage("Images/Cloud.png");
  
  gameoverimg = loadImage("Images/game-over-glitch.png");

  replayimg = loadImage("Images/Replay.jpg");
  
  obstacle1 = loadImage("Images/Cactus_Plant0.png");
  obstacle2 = loadImage("Images/Cactus_Plant1.png");
  obstacle3 = loadImage("Images/Cactus_Plant2.png");
  obstacle4 = loadImage("Images/Cactus_Plant3.png");
  obstacle5 = loadImage("Images/Cactus_Plant4.png");
  obstacle6 = loadImage("Images/Cactus_Plant5.png");
  
}

function setup() {
  createCanvas(600, 200);

  bg = createSprite(300, 160, 500, 500);
  bg.addImage(bgImg);
  bg.scale = 1.75;

  ground = createSprite(550, 40 ,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2 ;
  ground.scale = 1.985

  gameover = createSprite(500 , 120, 70 , 100);
  gameover.scale = 0.5;
  gameover.addImage("gameover", gameoverimg); 
  gameover.visible = false ; 
  
  replay = createSprite(300 , 115 , 30, 30);
  replay.scale = 0.5;
  replay.addImage("gameover", replayimg); 
  replay.visible = false ; 
  
  trex = createSprite(50, 180 ,20,50);
  trex.addAnimation("running", trex_running);
  trex.setCollider("circle", -50, 0, 100);
  trex.debug = false;
  trex.scale = 0.15;
  
  invisibleGround = createSprite(200, 190 ,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
   
  score = 0;
}

function draw() {
  background(180);
  //displaying score
  fill("black");
  text("Score: "+ score, 500,50);

//CCCCAAAAMMMMEEEERRRRAAAA//
  
  gameover.y = camera.position.y;
  replay.y = camera.position.y;

  camera.position.x = 300;
  camera.position.y = trex.y - 50;
  bg.y = camera.position.y;
  
  if(gameState === PLAY){
    
    gameover.visible = false;
    replay.visible = false;
    
    if(score > 0 && score % 100 === 0){
             checkpointS.play();
       //if(score > 1000 && score === 10000){
         
       //   if(score > 10000 && score === 100000){
      
       }//}}
    
    if( score >= 0 && score % 100 === 0 ){
      ground.velocityX = -(6+3*score/1000);
      
    }
    
     //scoring
    score = score + Math.round(getFrameRate() / 62);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if( (keyDown("space") || touches.length > 0) && trex.y >= 140) {
        trex.velocityY = -13;
        jumpS.play();
        touches = [];
        
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        jumpS.play();

    }
  }
   else if (gameState === END) {

      trex.changeImage("running", trex_collided);
          
      gameover.visible = true; 
      replay.visible = true;
     
      trex.velocityY=0;
      ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
             
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
       
    if(mousePressedOver(replay)){
     reset() ;
    }
     
   }
   
  //stops trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(6+3*score/1000);

   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
 
      case 1: obstacle.addImage(obstacle1);
      break;
 
      case 2: obstacle.addImage(obstacle2);
      break;
 
      case 3: obstacle.addImage(obstacle3);
      break;

      case 4: obstacle.addImage(obstacle4);
      break;

      case 5: obstacle.addImage(obstacle5);
      break;
      
      case 6: obstacle.addImage(obstacle6);
      break;
      
      default: break;

    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.35;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = random(0.22, 0.42);
    cloud.velocityX = -3;
    
    //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
  
    //if(mousePressedOver(replay)){
     gameState = PLAY ;
   // }
  
gameover.visible = false ; 
 replay.visible = false ;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}