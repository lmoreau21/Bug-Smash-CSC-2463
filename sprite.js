this.x = 40;
class Sprite {
  constructor(animation, y, speed, isR, death) {
    this.x = 40;
    if(isR)
      this.x = -40;  
    this.y = y;
    this.animation = animation;
    this.w = this.animation[0].width;
    this.len = this.animation.length;
    this.speed = speed;
    this.index = 0;
    this.isRight = isR;
    this.death = death;
    this.killBug = false;
    this.trans = 255;
    // if(this.isRight){
    //   this.x = -this.w;
    // }else if (!this.isRight){
    //   this.x = -width-this.w;
    //   console.log(this.x+" "+width);
    // }
  }

  show() {
    if(!this.isRight){
      scale(-1, 1);
    }else if(this.isRight){
      scale(1,1)
    }
    if(!this.killBug && !gameOver){
      let index = floor(this.index) % this.len;
      tint(255, );
      image(this.animation[index], this.x, this.y);
      
    }else if(this.killBug){
      if(this.trans >= 0){
        this.trans--;
      }
      tint(255, this.trans);
      image(this.death[0], this.x, this.y);
      image(this.death[1],this.x,this.y);
    }
  }

  walk() {
    if(!this.killBug && !gameOver){
      this.index += this.speed;
      this.x += this.speed * 5;
      if (this.x > width + 20 && this.isRight) {
        this.x = -this.w;
      }else if(this.x >= -36 && !this.isRight){
        this.x = -width-this.w-20;
      }
    }
  }

  deathCheck(){
    if(!gameOver&&((mouseX > this.x && mouseX < this.x+this.w)||(mouseX < abs(this.x) && mouseX > abs(this.x)-this.w)) && (mouseY > this.y && mouseY < this.y+36) && !this.killBug){
      this.killBug = true;
      score++;
      console.log(this.x+" "+width);
    }
  }

  
}