const sprites = new Image();
sprites.src = "../sprites/sprites.png";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

//background
const gameBackground = {
  spriteX: 390, spriteY: 0, //image (sprite) initial coordinates
  width: 275, height: 204, //split and image size
  x: 0, y: canvas.height - 204,  //image splitted coordinates
  drawBackground() {
    context.fillStyle = '#70c5ce';
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.drawImage(
      sprites, 
      gameBackground.spriteX, gameBackground.spriteY, 
      gameBackground.width, gameBackground.height, 
      gameBackground.x, gameBackground.y,
      gameBackground.width, gameBackground.height
    );

    context.drawImage(
      sprites, 
      gameBackground.spriteX, gameBackground.spriteY, 
      gameBackground.width, gameBackground.height, 
      (gameBackground.x + gameBackground.width), gameBackground.y,
      gameBackground.width, gameBackground.height
    );
  }
};

// ground
const ground = {
  spriteX: 0, spriteY: 610, //image (sprite) initial coordinates
  width: 224, height: 112, //split and image size
  x: 0, y: canvas.height - 112,  //image splitted coordinates
  drawGround() {
    context.drawImage(
      sprites, 
      ground.spriteX, ground.spriteY, 
      ground.width, ground.height, 
      ground.x, ground.y,
      ground.width, ground.height
    );

    context.drawImage(
      sprites, 
      ground.spriteX, ground.spriteY, 
      ground.width, ground.height, 
      (ground.x + ground.width), ground.y,
      ground.width, ground.height
    );
  },
};

// the bird
const flappyBird = {
  spriteX: 0, spriteY: 0, //image (sprite) initial coordinates
  width: 33, height: 24, //split and image size
  x: 10, y: 50,  ////image splitted coordinates
  gravity: 0.25,
  velocity: 0,
  update() {
    flappyBird.velocity = flappyBird.velocity + flappyBird.gravity;
    flappyBird.y += flappyBird.velocity;
  },
  drawBird() {
    context.drawImage(
      sprites, 
      flappyBird.spriteX, flappyBird.spriteY, 
      flappyBird.width, flappyBird.height, 
      flappyBird.x, flappyBird.y,
      flappyBird.width, flappyBird.height
    );
  }
};

// Initial Screen
const getReadyScreen = {
  spriteX: 134, spriteY: 0, //image (sprite) initial coordinates
  width: 174, height: 152, //split and image size
  x: (canvas.width / 2) - 174 / 2, y: 50,  ////image splitted coordinates
  gravity: 0.25,
  velocity: 0,
  drawScreen() {
    context.drawImage(
      sprites, 
      getReadyScreen.spriteX, getReadyScreen.spriteY, 
      getReadyScreen.width, getReadyScreen.height, 
      getReadyScreen.x, getReadyScreen.y,
      getReadyScreen.width, getReadyScreen.height
    );
  }
};


// Screens section
let activeScreen = {};

function changeToScreen(newScreen){
  activeScreen = newScreen;
}

const screens = {
  init: {
    draw() {
      gameBackground.drawBackground();
      ground.drawGround();
      flappyBird.drawBird();
      getReadyScreen.drawScreen();
    },
    update() {

    },
    click() {
      changeToScreen(screens.game);
    }
  }
};

screens.game = {
  draw() {
    gameBackground.drawBackground();
    ground.drawGround();
    flappyBird.drawBird();
  },
  update: () => flappyBird.update(),
};

function loop(){
  activeScreen.draw();
  activeScreen.update();
  
  requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
  if(activeScreen.click) {
    activeScreen.click();
  }
});

changeToScreen(screens.init);
loop();