//images
let spritesheet;
let spritedata;
let animation = [];
let death = [];
let bugs = [];

//timers and counters
let timer = 30;
let nextChange = timer;
let gameDelay = 0;

//controls game starting or not
let gameOver = true;

//tracks the bugs in the array
let bugCount = 0;

//score/round variables
let score = 0;
let totalClicks = 0;
let highScore = score;
let highAccuracy = 0;
let gamesPlayed = 0;

function preload() {
  spritesheet = loadImage('bug.png');
}

//converts images to animation
function setup() {
  createCanvas(windowWidth-20, windowHeight-20);
  for (let i = 0; i < 11; i++) {
      let img = spritesheet.get(34*i, 0,34, 31);
      animation.push(img);
  }
  death.push(spritesheet.get(34*11, 0,34, 31));
  death.push(spritesheet.get(34*12, 0,34, 31));
}

function draw() {
  if(!gameOver){
    background(200)
    if (timer == 0) {
      gameOver=true;
      gamesPlayed++;
    }
    textSize(24);
    text('Score: '+score, width-textWidth('Score: '+score)-10, 20);
    text('Time: '+timer, 10, 20);
    for (let bug of bugs) {
      bug.show();
      bug.walk();
    }
    if (round((millis()-gameDelay)/1000) == 31-timer && timer>0) {
      timer--;
      bugs[bugCount] = new Sprite(animation, random(20, height-33), random(.2, .6)+score*0.08, random()<.5, death);
      bugCount++;
    }
  }else{
    //displays restart screen
    background(200)
    //resets variables
    gameDelay = millis();
    timer = 30;
    bugs = [];
    bugCount = 0;
    textSize(20);

    //displays if there was a highscore or highest accuracy
    fill("red")
    if(score>=highScore && gamesPlayed != 0){
      highScore = score;
      text("New High Score!", width/8, height/2);
    }
    if(int(score/totalClicks*100)>=highAccuracy && gamesPlayed!=0){
      highAccuracy = int(score/totalClicks*100);
      text("New Highest Accuracy!",width/8, height/2+40)
    }

    //displays gameover if a round just finished
    fill("black")
    if(gamesPlayed!=0){
      textSize(50);
      text("Game Over", width/2-textWidth("Game Over")/2, 60)
    }

    //Adds score information
    textSize(40);
    text("Press a key to start", width/2 - textWidth("Press a key to start")/2, height/3);
    textSize(30);
    text("Score: "+ score+"\tHighest Score: "+highScore, width/2 - textWidth("Score: 98\tHighest Score: 90")/2, height/2);
    text("Accuracy: "+ int((score/totalClicks)*100)+"%"+"\tHighest Accuracy: "+highAccuracy+"%", width/2 - textWidth("Accuracy: 98%\tHighest Accuracy: 98%")/2, height/2+40);
  }
}

//adds to total for mouse is clicked to modify accuracy score
function mouseClicked() {
  if(!gameOver){
    totalClicks++;
    for (let bug of bugs) {
      bug.deathCheck();
    }
  }
}

//if key is pressed a round is started
function keyPressed(){
  if(gameOver){
    gameOver=false;
    score = 0;
    totalClicks = 0; 
  }
}