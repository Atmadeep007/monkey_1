//background variables
var bgImg,bg;

//monkey variable
var monkeyAnimation,monkeyCollided,monkey;

//banana variables
var bananaImg,banana;

//stone variables 
var stoneImg;

//sound Variables
var hitSound,hit,jumpSound,jump;

//gameStates
var PLAY;
var END;
var gameState;

//score
var score;

//invisibleGround
var invisibleGround;

//buttons
var startButton,startImg;
var restartButton,restartImg;

//groups
var obstacleGroup;

function preload()
{
  bgImg=loadImage("jungle.jpg");
  
  //monkey
  monkeyAnimation=loadAnimation("Monkey_01.png","Monkey_02.png","Monkey_03.png","Monkey_04.png","Monkey_05.png","Monkey_06.png","Monkey_07.png","Monkey_08.png","Monkey_09.png","Monkey_10.png");
  
  monkeyCollided=loadImage("Monkey_01.png");
  
  //banana
  bananaImg=loadImage("banana.png");
  
  //stone
  stoneImg=loadImage("stone.png");
  
  //buttons
  startImg=loadImage("playButton.png");
  restartImg=loadImage("restartButton.png");
  
}

function setup()
{
  createCanvas(600, 400);
  
  //background
  bg=createSprite(200,200,400,400);
  bg.x=bg.width/2;
  bg.addImage(bgImg);
  
  //monkey
  monkey=createSprite(50,350,20,20);
  monkey.addAnimation("running monkey",monkeyAnimation);
  monkey.scale=0.1;
  
  //groups
  obstacleGroup=new Group();
  
  //gameStates
  PLAY=1;
  END=0;
  gameState=11;
  
  //score
  score=0;
  var count=0;
  count=frameRate/60;
  
  //buttons
  startButton=createSprite(300,200,50,50);
  startButton.addImage(startImg);
  startButton.visible=false;
  
  restartButton=createSprite(200,200,50,50);
  restartButton.addImage(restartImg);
  restartButton.visible=false;
  
  //invisibleGround
  invisibleGround=createSprite(300,380,600,1);
  invisibleGround.visible=false;
   
  //banana
  banana=createSprite(0,0,0,0);
  banana.destroy();
  
  //sounds
  hitSound=loadSound("hit.mp3");
  jumpSound=loadSound("jump.mp3");
}

function draw() 
{
  //clears the background
  background(220);
  
  //adds gravity
  monkey.velocityY=monkey.velocityY+0.5;
  
  //prevents the monkey from falling down
  monkey.collide(invisibleGround);
  
  //gameState=11
  if (gameState===11)
  {
    startButton.visible=true;
    
    if (mousePressedOver(startButton))
    {
       gameState=PLAY;
       startButton.visible=false;
    }
  }
  
  //gameState=PLAY
  if (gameState===PLAY)
  {
     //moves the bg
    bg.velocityX=-(5+score/10);
    
    //resets the bg
    if (bg.x<75)
    {
       bg.x=bg.width/2;
    }
    
    //spawns the bananas
    spawnBananas();
    
    //spawns the obstacles
    spawnObstacles();
    
    //the monkey jumps
    if (keyDown("space")&&monkey.y>=320)
    {
      monkey.velocityY=-10;
      jumpSound.play();
    }    
    
    
    //scoring 
    if (monkey.isTouching(banana))
    {
      banana.destroy();
      score = score + 2; 
    }
    switch(score)
    { 
      case 10: monkey.scale=0.12; 
        break;
        case 20:monkey.scale=0.14;
        break; 
        case 30:monkey.scale=0.16; 
        break;
        case 40: monkey.scale=0.18; 
        break;
        case 50:gameState=END;
                break;
        default: break; 
    }
    
    //hits the obstacles
    if (obstacleGroup.isTouching(monkey)&&monkey.scale>0.1)
    {
      monkey.scale=monkey.scale-0.02;
      hitSound.play();
      obstacleGroup.destroyEach();
    }
    else if (obstacleGroup.isTouching(monkey)&&monkey.scale<=0.1)
    {
      gameState=END;
      hitSound.play();
      monkey.addImage(monkeyCollided);
      monkey.scale=0.1;
    }
  }
  
  else if (gameState===END)
  {
    //stops everything
    bg.setVelocity(0,0);
    banana.velocityX=0;
    obstacleGroup.setVelocityXEach(0);
    
    //stops the sprites from vanishing
    banana.lifetime=-1;
    obstacleGroup.setLifetimeEach(-1);
    
    //restart
    restartButton.visible=true;
    
    if (mousePressedOver(restartButton))
    {
      reset();
    }
  }
  
  //developer options
  //monkey.debug=true;
  //obstacle.debug=true;
  //console.log(monkey.y);
  //banana.debug=true;
  
  //colliders
  monkey.setCollider("circle");
  obstacleGroup.setColliderEach("circle",0,50,200);
  
  drawSprites();
  
  if (gameState===11)
  {
    fill("white");
    textSize(30);
    textFont("comic sans ms");
    text("Press the play button to start",50,30);
    text("Press space to jump",125,65);
  }  
  
    if (gameState===PLAY)
  {
    fill("white");
    textSize(30);
    textFont("comic sans ms");
    text("Score="+score,50,30);
  }
  
  if (gameState===END)
  {
    fill("white");
    textSize(30);
    textFont("comic sans ms");
    text("Score="+score,50,30);
    textSize(50);
    text("Game_Over",150,150);
    if (score===50)
    {
      text("CONGRATULATIOns",100,300);
    }
  }
}

function spawnBananas()
{
  if (frameCount%100===0)
  {
    banana=createSprite(600,250,40,20);
    banana.addImage(bananaImg);
    banana.scale=0.05;
    banana.velocityX=-(5+score/10);
    banana.lifetime=125;
  }
}

function spawnObstacles()
{
  if (frameCount%100===0)
  {
    var obstacle=createSprite(600,350,50,50);
    obstacle.addImage(stoneImg);
    obstacle.scale=0.25;
    obstacle.velocityX=-(5+score/10);
    obstacle.lifetime=125;
    obstacleGroup.add(obstacle);
    
  }
}
function reset()
{
  gameState=11;
  restartButton.visible=false;
  score=0;
  banana.destroy();
  obstacleGroup.destroyEach();
}