/*https://youtu.be/ZAcpYT4nm6E
* the output on the ardunio is the rgb light
  * its greenish during the main menu (it has a little bit of randomness)
  * its off during the game
  * it flashed red whenever you smash a bug
* the input is the joystick
  * moving the joystick moves the red dot which is the cursor
  * pressing down on the joystick is like right clicking to smash a bug
  * it also allows you to start the game by clicking
*/

let port;
let writer, reader;
const encoder = new TextEncoder();
const decorder = new TextDecoder();
let xValue = 00;
let yValue = 00;
let isPressedButton = 1;
let cursor;
let redC = 100;
let greenC = 100;
let blueC = 100;

let r=200,g=200,b=200;
//images
let spritesheet;
let spritedata;
let animation = [];
let death = [];
let bugs = [];

//timers and counters
const mainTime = 30;
let timer = mainTime;
let nextChange = timer;
let gameDelay = 0;

//controls game starting or not
let gameOver = true;

//tracks the bugs in the array
let bugCount = 0;

//score/round variables
let score = 0;
let highScore = score;
let gamesPlayed = 0;
Tone.Transport.start();
// create a new Tone.js synth1
let synth;
// define the notes of the Gravity Falls theme song
const notes =  [
  "E3", "D3", "E3", "F3", "G3", "E3", "C3", "D3", "E3",
  "E3", "D3", "E3", "F3", "G3", "E3", "C3", "D3", "E3",
  "E3", "D3", "E3", "F3", "G3", "E3", "C3", "D3", "E3",
  "E3", "D3", "E3", "F3", "G3", "E3", "C3", "D3", "E3",
  "G3", "F3", "G3", "A3", "B3", "G3", "E3", "F3", "G3",
  "G3", "F3", "G3", "A3", "B3", "G3", "E3", "F3", "G3",
  "G3", "F3", "G3", "A3", "B3", "G3", "E3", "F3", "G3",
  "G3", "F3", "G3", "A3", "B3", "G3", "E3", "F3", "G3",
  "C4", "B3", "C4", "D4", "E4", "C4", "A3", "B3", "C4",
  "C4", "B3", "C4", "D4", "E4", "C4", "A3", "B3", "C4",
  "C4", "B3", "C4", "D4", "E4", "C4", "A3", "B3", "C4",
  "C4", "B3", "C4", "D4", "E4", "C4", "A3", "B3", "C4",
  "E4", "D4", "E4", "F4", "G4", "E4", "C4", "D4", "E4",
  "E4", "D4", "E4", "F4", "G4", "E4", "C4", "D4", "E4",
  "E4", "D4", "E4", "F4", "G4", "E4", "C4", "D4", "E4",
  "E4", "D4", "E4", "F4", "G4", "E4", "C4", "D4", "E4"
];
const bugSound = ["C4", "D#4", "F#4", "A4"];
const titleScreenNotes = [
  "C3", "E3", "G3", "C4", "E4", "G4", "C5", "E5", "G5",
  "C3", "F3", "A3", "C4", "F4", "A4", "C5", "F5", "A5",
  "Bb2", "D3", "F3", "Bb3", "D4", "F4", "Bb4", "D5", "F5",
  "Bb2", "Db3", "F3", "Bb3", "Db4", "F4", "Bb4", "Db5", "F5"
];

let gameOverSound = new Tone.Player("level.mp3").toDestination();
gameOverSound.volume.value = 13;
const distortion = new Tone.Distortion(0.8).toDestination();
const reverb = new Tone.Reverb(1.5).toDestination();

// define the duration for each note
let durationS = .22;
let curSound, gamesynth;
let index = 0;
let bugSeq =  new Tone.Sequence((time, note) => {
  index++;
  gamesynth.triggerAttackRelease(note, ".1", time);
  if(index>=bugSound.length){
    index=0;
    bugSeq.stop();
  }
}, bugSound, ".1");

const playNotes = () => {
  // schedule the notes to be played

  let index = 0;
  curSound = titleScreenNotes;
  Tone.Transport.scheduleRepeat((time) => {
    if(gameOver) { curSound = titleScreenNotes; }
    else curSound = notes;
    let note = curSound[index];
    synth.triggerAttackRelease(note, durationS, time);
    index = (index + 1) % curSound.length;
  },durationS);
}

// set the tempo and start the transport
function preload() {
  synth = new Tone.Synth({
    oscillator:{
      type:'triangle'
    },
    envelope: { 
      attack: 0.4,
      decay: 0.2,
      sustain: .21,
      release: 14
    }
  }).toDestination();
  synth.volume.value=-3;



  gamesynth = new Tone.Synth({
    oscillator: {
      type: "sine"
    },
    envelope: {
      attack: .9,
		decay: .9,
		sustain: 0.5,
		release: 0.3,
    }
  }).chain(distortion, reverb);
  spritesheet = loadImage('bug.png');

  
  
  Tone.Transport.start();
  Tone.start(); 
  playNotes();
}

//converts images to animation
function setup() {
  createCanvas(1023/2, 1023/2);
  background("gray")
  
  if ("serial" in navigator) {
    textAlign(CENTER,CENTER);
    textSize(22);
    
    let button = createButton("Connect");
    button.position(width/2-45,15);
    button.mousePressed(connect);
  }
  
  for (let i = 0; i < 11; i++) {
      let img = spritesheet.get(34*i, 0,34, 31);
      animation.push(img);
  }
  death.push(spritesheet.get(34*11, 0,34, 31));
  death.push(spritesheet.get(34*12, 0,34, 31));

  Tone.start(); 
  playNotes();
}


//setInterval(changeBackgroundColor, 1000);
function draw() {
  if(isPressedButton==0){
    buttonPressed();
  }
  if (Tone.context.state !== 'running') {
    Tone.context.resume();
    
  }
  if (reader && frameCount%3==0) {
    serialRead();
    //buttonPressed();
  }
  if(writer&& frameCount%5===0){
    writer.write(encoder.encode(redC+","+greenC+","+blueC+"\n"));
  }
  if(frameCount%25==0){
    redC = 255;
    greenC = 255;
    blueC = 255;
  }
  textFont('cursive');
  background(r, g, b);
  
  if(!gameOver){
   
    fill("white")
    rect(0, 0, width-1, 45);
    fill("black")
    if (timer == 0) {
      gameOver=true;
      gamesPlayed++;
      gameOverSound.start();
    }
    textSize(20);
    text('Score: '+score, width-textWidth('Score: '+score)-10, 30);
    text('Time: '+timer, 10, 30);
    
    for (let bug of bugs) {
      bug.show();
      bug.walk();
      
    }
    if (round((millis()-gameDelay)/1000) == mainTime-timer && timer>0) {
      timer--;
      bugs[bugCount] = new Sprite(animation, random(55, height-55), random(.2, .6)+score*0.08, random()<.5, death);
      bugCount++;
      synth.envelope.attack -= .01;
      changeBackgroundColor();
    }

    fill("red");
    cursor = circle(xValue,yValue,15);
  }else{
    if(frameCount%2===0){
      redC = int(random(130,150));
      blueC = int(random(240,254));
      greenC = int(random(110,120));
    }
    fill("lightgray")
    rect(width/8, height/4, width*3/4, height/2);
    fill("black")
    textAlign("center")
    
    //resets variables
    gameDelay = millis();
    timer = mainTime;
    bugs = [];
    bugCount = 0;
    textSize(20);
    durationS = .25;
    synth.envelope.attack = .35;
    //displays if there was a highscore or highest accuracy
    fill("red")
    if(score>=highScore && gamesPlayed != 0){
      highScore = score;
      text("New High Score!", width/2, height/2+10);
    }
  
    //displays gameover if a round just finished
    fill("black")
    if(gamesPlayed!=0){
      textSize(40);
      text("Game Over", width/2, 60)
    }

    //Adds score information
    textSize(30);
    text("Press joystick to start", width/2, height/3+50);
    textSize(20);
    text("Score: "+ score, width/2, height/2+50);
    text("Highest Score: "+highScore,width/2, height/2+100);
    textAlign("left")
  }
}

//adds to total for mouse is clicked to modify accuracy score
function buttonPressed() {
  if(!gameOver){
    for (let bug of bugs) {
      bug.deathCheck(xValue,yValue);
    }
  }else{
    gameOver=false;
    score = 0;
  }
  Tone.Transport.start();
  Tone.start();
}

function changeBackgroundColor() {
  r = random(150)+100;
  g = random(150)+100;
  b = random(150)+100;
}
async function serialRead() {
  while(true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    let temp = splitTokens(value,',');
    xValue = temp[0]/2;
    yValue = temp[1]/2;
    isPressedButton = temp[2];    
  }
}


async function connect() {
  port = await navigator.serial.requestPort();

  await port.open({ baudRate: 9600 });

  writer = port.writable.getWriter();

  reader = port.readable
     .pipeThrough(new TextDecoderStream())
     .pipeThrough(new TransformStream(new LineBreakTransformer()))
     .getReader();
}

class LineBreakTransformer {
  constructor() {
    this.chunks = "";
  }

  transform(chunk, controller) {
    this.chunks += chunk;
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    controller.enqueue(this.chunks);
  }
}