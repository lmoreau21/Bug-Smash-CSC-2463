let spritesheet;
let spritedata;

let timer = 30;
let nextChange = timer;
let animation = [];
let death = [];
let bugs = [];
let gameOver = true;

let gameDelay = 0;
let bugCount = 0;

let score = 0;
let totalClicks = 0;
let highScore = score;
let highAccuracy = 0;

let gamesPlayed = 0;

function preload() {
  spritesheet = loadImage('bug.png');
}


function setup() {
  createCanvas(1600, 800);
  for (let i = 0; i < 11; i++) {
      let img = spritesheet.get(34*i, 0,34, 31);
      animation.push(img);
  }
  death.push(spritesheet.get(34*11, 0,34, 31));
  death.push(spritesheet.get(34*12, 0,34, 31));

 
  // for (let i = 0; i < 10; i++) {
  //   bugs[i] = new Sprite(animation, -34, random(20, height-33), random(0.1, 0.2)*score + 0.05, true, death);
  // }
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
    background(200)
    gameDelay = millis();
    timer = 30;
    bugs = [];
    bugCount = 0;
    textSize(20);
    fill("red")
    if(score>=highScore && gamesPlayed != 0){
      highScore = score;
      text("New High Score!", width/8, height/2);
    }
    if(int(score/totalClicks*100)>=highAccuracy && gamesPlayed!=0){
      highAccuracy = int(score/totalClicks*100);
      text("New Highest Accuracy!",width/8, height/2+40)
    }
    fill("black")
    if(gamesPlayed!=0){
      textSize(50);
      text("Game Over", width/2-textWidth("Game Over")/2, 60)
    }
    textSize(40);
    text("Press a key to start", width/2 - textWidth("Press a key to start")/2, height/3);
    textSize(30);
    text("Score: "+ score+"\tHighest Score: "+highScore, width/2 - textWidth("Score: 98\tHighest Score: 90")/2, height/2);
    text("Accuracy: "+ int((score/totalClicks)*100)+"%"+"\tHighest Accuracy: "+highAccuracy+"%", width/2 - textWidth("Accuracy: 98%\tHighest Accuracy: 98%")/2, height/2+40);
  }
}

function mouseClicked() {
  totalClicks++;
  for (let bug of bugs) {
    bug.deathCheck();
  }
}

function keyPressed(){
  if(gameOver){
    gameOver=false;
    score = 0;
    totalClicks = 0; 
  }
}