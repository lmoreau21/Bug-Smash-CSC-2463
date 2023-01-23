let spritesheet;
let spritedata;
let score = 0;
let totalClicks = 0;
let timer = 30;
let animation = [];
let death = [];
let bugs = [];
let gameOver = false;
let bugCount = 0;
let speed = random(0.1, 0.4);

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
  background(200)
  if (timer == 0) {
    textSize(40);
    text("GAME OVER", width/2 - textWidth("GAME OVER")/2, height/2);
    textSize(30);
    text("Accuracy: "+int((score/totalClicks)*100)+"%", width/2 - textWidth("Accuracy: 98%")/2, height/2+50);
    gameOver=true;
  }
  textSize(24);
  text('Score: '+score, width-textWidth('Score: '+score)-10, 20);
  text('Time: '+timer, 10, 20);
  if (frameCount % 30 == 0 && timer > 0) {
    bugs[bugCount] = new Sprite(animation, random(15, height-33), random(.5, 1)+score*0.05, random()<.5, death);
    bugCount++;
  }
  for (let bug of bugs) {
    bug.show();
    bug.walk();
  }
  
  if (frameCount % 60 == 0 && timer > 0) {
    timer--;
  }
}

function mouseClicked() {
  totalClicks++;
  for (let bug of bugs) {
    bug.deathCheck();
  }
}