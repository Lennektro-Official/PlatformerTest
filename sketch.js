//settings
const playerMoveSpeed = 1.5;
const playerWeight = 1;
const playerJumpStrength = 10;

const spawnX = 35;
const spawnY = 150;

//variables
let playerX = 0;
let playerY = 0;

//values
let moveRight = false;
let moveLeft = false;
let toJump = 0;
let playerIsOnGround = false;

let collectedCoins = 0;

let won = false;
let played_win_sound = false;

//platforms and coins
let platforms = [];
let platformsAmount = 0;
let coins = [];
let coinsAmount = 0;

//  assets  //
//sounds
let win_sound;
let death_sound;
let pickup_coin_sound;

//preload
function preload() {
  win_sound = loadSound('assets/win_sound.wav');
  death_sound = loadSound('assets/death.wav');
  pickup_coin_sound = loadSound('assets/pickup_coin.wav');
}

//init
function setup() {
  //create the canvas
  createCanvas(1500, 1000);
  //set player position to spawn position
  playerX = spawnX;
  playerY = spawnY;
  //define platforms
  platforms[0] = new Platform(10, 250, 100, 25);
  platforms[1] = new Platform(160, 350, 100, 25);
  platforms[2] = new Platform(310, 260, 100, 25);
  platforms[3] = new Platform(550, 260, 100, 25);
  platforms[4] = new Platform(725, 160, 100, 25);
  platforms[5] = new Platform(1025, 160, 100, 25);
  platforms[6] = new Platform(1225, 200, 100, 25);
  platformsAmount = 7;
  //define coins
  coins[0] = new Coin(360, 230);
  coins[1] = new Coin(925, 50);
  coins[2] = new Coin(1275, 170);
  coins[3] = new Coin(1150, 750);
  coinsAmount = 4;
}

//rendering
function draw() {

  //graphics

  //render background
  background(220);
  //render player
  fill(255, 0, 0);
  rect(playerX, playerY, 50, 50);
  //render lava
  fill(255,69,0);
  rect(-2, 900, 1504, 102)
  //render collected coins display
  textSize(32);
  fill(255, 150, 0);
  text(`Coins: ${collectedCoins}`, 10, 35);

  //render "You win!" title if player has won
  if(won) {
    textSize(64);
    fill(0, 255, 0);
    text("You win!", 625, 450);
  }


  //plaforms (graphics & physics)
  var b = true;
  for(var i = 0; i < platformsAmount; i++) {
    platforms[i].render();
    for(var dx = 0; dx <= 50; dx++) {
      for(var dy = 50; dy <= 51; dy++) {
        if(platforms[i].isColliding(playerX + dx, playerY + dy)) {
          playerIsOnGround = true;
          b = false;
        } else {
          if(b) playerIsOnGround = false;
        }
      }
    }
  }
  //coins (graphics and physics)
  for(var i = 0; i < coinsAmount; i++) {
    if(!coins[i].isCollected()) coins[i].render();
    for(var dx = 0; dx <= 50; dx++) {
      for(var dy = 0; dy <= 50; dy++) {
        if(coins[i].isColliding(playerX + dx, playerY + dy) && !coins[i].isCollected()) {
          coins[i].setCollected(true);
          collectedCoins++;
          if(collectedCoins < coinsAmount) pickup_coin_sound.play();
        }
      }
    }
  }

  //physics

  //only update player if he hasn't won
  if(!won) {
    //move player
    if(moveRight) playerX += deltaTime * (playerMoveSpeed / 4);
    if(moveLeft) playerX -= deltaTime * (playerMoveSpeed / 4);
    //player gravity
    if(!playerIsOnGround && toJump == -6) playerY += deltaTime * (playerWeight / 2);
    //player jumping
    if(toJump > -6) {
      if(toJump >= 0) playerY -= deltaTime * playerWeight;
      toJump -= deltaTime / 10;
    }
    if(toJump < -6) toJump = -6;
    //reset player if it falls of
    if(playerY > 900) {
      playerX = spawnX;
      playerY = spawnY;
      collectedCoins = 0;
      for(var i = 0; i < coinsAmount; i++) {
        coins[i].setCollected(false);
      }
      death_sound.play();
    }
  }


  //sound
  if(won && !played_win_sound) {
    win_sound.play();
    played_win_sound = true;
  }


  //win detection
  if(collectedCoins == coinsAmount) won = true;
}

//key handler
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    moveLeft = true;
  } else if (keyCode === RIGHT_ARROW) {
    moveRight = true;
  } else if (keyCode === UP_ARROW) {
    if(playerIsOnGround) {
      toJump = playerJumpStrength;
    }
  }
  return false; // prevent default
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    moveLeft = false;
  } else if (keyCode === RIGHT_ARROW) {
    moveRight = false;
  }
  return false; // prevent default
}

//classess
class Platform {
  constructor(x, y, sizeX, sizeY) {
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  render() {
    fill(0, 0, 255);
    rect(this.x, this.y, this.sizeX, this.sizeY);
  }

  isColliding(x, y) {
    if((x >= this.x && x <= this.x + this.sizeX) && (y >= this.y && y <= this.y + (this.sizeY / 2))) {
      return true;
    } else {
      return false;
    }
  }
}

class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.collected = false;
  }

  isCollected() {
    return this.collected;
  }

  setCollected(bool) {
    this.collected = bool;
  }

  render() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, 25, 25);
  }

  isColliding(x, y) {
    if((x >= this.x - 12 && x <= this.x + 13) && (y >= this.y - 12 && y <= this.y + 13)) {
      return true;
    } else {
      return false;
    }
  }
}
