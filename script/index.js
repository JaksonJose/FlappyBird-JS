//Set UP
const sound_Hit = new Audio();
sound_Hit.src = "../sounds/hit.wav";

const sound_Score = new Audio();
sound_Score.src = "../sounds/ponto.wav";

const sound_Jump = new Audio();
sound_Jump.src = "../sounds/pulo.wav";

const sprites = new Image();
sprites.src = "../sprites/sprites.png";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let frames = 0;

// Objects
function createFlappyBird() {
  // the bird
  const flappyBird = {
    spriteX: 0, spriteY: 0, //image (sprite) initial coordinates
    width: 33, height: 24, //split and image size
    x: 10, y: 50,  ////image splitted coordinates
    gravity: 0.25,
    velocity: 0,
    jump: () => {     
      flappyBird.velocity = -5;
    },
    update() {
      if(collide(flappyBird, globals.ground)) {
        
        sound_Hit.play();

        changeToScreen(screens.gameOver);
        
        return;
      }

      flappyBird.velocity = flappyBird.velocity + flappyBird.gravity;
      flappyBird.y += flappyBird.velocity;
    },
    moviments: [
      { spriteX: 0, spriteY: 0 }, // wing up
      { spriteX: 0, spriteY: 26 }, // wing on middle
      { spriteX: 0, spriteY: 52 } // wing down
    ],
    currentFrame: 0,
    updateCurrentFrame () {
      const framesInteval = 10;
      const intervalHasPassed = (frames % framesInteval) == 0;

      if (intervalHasPassed){
        const incrementBase = 1;
        const increment = incrementBase + flappyBird.currentFrame;
        const baseLoop = flappyBird.moviments.length;
  
        flappyBird.currentFrame = increment % baseLoop;  
      }         
    },
    drawBird() {
      this.updateCurrentFrame();
      const { spriteX, spriteY } = this.moviments[flappyBird.currentFrame];

      context.drawImage(
        sprites, 
        spriteX, spriteY, 
        flappyBird.width, flappyBird.height, 
        flappyBird.x, flappyBird.y,
        flappyBird.width, flappyBird.height
      );
    }
  };

  return flappyBird;
}

function createGround(){
  // ground
  const ground = {
    spriteX: 0, spriteY: 610, //image (sprite) initial coordinates
    width: 224, height: 112, //split and image size
    x: 0, y: canvas.height - 112,  //image splitted coordinates
    update() {
      const repeatGroundAt = ground.width / 2; 
      const moviment = ground.x - 1;

      ground.x = moviment % repeatGroundAt;
    },
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

  return ground;
}

function createPipeline () {
  const pipeline = {
    width: 52, height: 400,
    down: {spriteX: 0, spriteY: 169},
    up: { spriteX: 52, spriteY: 169},
    space: 80,
    drawPipeline() {

      pipeline.pairs.forEach((pair) => {
        const randomY = pair.y;
        const spaceBetweenPipeline = 120;

        const pipelineUpX = pair.x;
        const pipelineUpY = randomY;

        //Upper side pipeline
        context.drawImage(
          sprites,
          pipeline.up.spriteX, pipeline.up.spriteY,
          pipeline.width, pipeline.height,
          pipelineUpX, pipelineUpY,
          pipeline.width, pipeline.height
        );

        const pipelineDownX = pair.x;
        const pipelineDownY = pipeline.height + spaceBetweenPipeline + randomY;
        //Down side pipeline
        context.drawImage(
          sprites,
          pipeline.down.spriteX, pipeline.down.spriteY,
          pipeline.width, pipeline.height,
          pipelineDownX, pipelineDownY,
          pipeline.width, pipeline.height
        );

        pair.pipelineUp = { x: pipelineUpX, y: pipeline.height + pipelineUpY };
        pair.pipelineDown = { x: pipelineDownX, y: pipelineDownY };
      });
    },
    collide(pair) {
      const flappyBirdHead = globals.flappyBird.y;
      const flappyBirdFeet = globals.flappyBird.y + globals.flappyBird.height;

      // Verify if Bird collided on front
      if (globals.flappyBird.x >= pair.x) {
        
        //Verify if collided on the bird head    
        if (flappyBirdHead <= pair.pipelineUp.y) {
          return true;
        }

        //Verify if collided on the bird feet      
        if (flappyBirdFeet >= pair.pipelineDown.y) {
          return true;
        }
      }

      return false;
    },
    pairs: [],
    update() {
      const framesHaspassed = (frames % 100) == 0;

      if (framesHaspassed) {
        const cood = {
          x: canvas.width, 
          y: -150 * (Math.random() + 1)
        };

        pipeline.pairs.push(cood);
      }

      pipeline.pairs.forEach((pair) => {
        pair.x -= 2;

        if (pipeline.collide(pair)) {

          sound_Hit.play();

          changeToScreen(screens.gameOver);
        } 

        if (pair.x + pipeline.width < 0){
          pipeline.pairs.shift();
        }
      });
    }
  };

  return pipeline;
}

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

function collide(bird, ground) {
  const flappyBirdY = bird.y + bird.height;

  if(flappyBirdY >= ground.y) return true;

  return false;
};


function createScore() {
  const score = {
    scoreNum: 0,
    drawScore() {
      context.font = "35px VT323";
      context.fillStyle = 'white';
      context.fillText(`${this.scoreNum}`, canvas.width / 2, 90);
    },
    update() {
      //console.log(globals.flappyBird.x)
      globals.pipeline.pairs.forEach(pair => {
        if(globals.flappyBird.x - globals.flappyBird.width + 1 == pair.x + 2) {
          sound_Score.play();
          
          this.scoreNum += 1;
        }         
      });
    }
  }

  return score;
}

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

// Initial Screen
const gameOverScreen = {
  spriteX: 134, spriteY: 153, //image (sprite) initial coordinates
  width: 226, height: 200, //split and image size
  x: (canvas.width / 2) - 226 / 2, y: 50,  ////image splitted coordinates
  gravity: 0.25,
  velocity: 0,
  drawScreen() {
    context.drawImage(
      sprites, 
      gameOverScreen.spriteX, gameOverScreen.spriteY, 
      gameOverScreen.width, gameOverScreen.height, 
      gameOverScreen.x, gameOverScreen.y,
      gameOverScreen.width, gameOverScreen.height
    );
  }
};


// Screens section
const globals = {};
let activeScreen = {};

function changeToScreen(newScreen){
  activeScreen = newScreen;

  if(activeScreen.initialize) {
      activeScreen.initialize();
  }
}

// Manage the game screens
const screens = {
  init: {
    initialize() { 
      globals.flappyBird = createFlappyBird()
      globals.ground = createGround();
      globals.pipeline = createPipeline();
    },
    draw() {
      gameBackground.drawBackground();
      globals.ground.drawGround();
      globals.flappyBird.drawBird();   
      getReadyScreen.drawScreen();
    },
    update() {
      globals.ground.update();
    },
    click() {
      changeToScreen(screens.game);
    }
  }
};

screens.game = {
  initialize() {
    globals.score = createScore()
  },
  draw() {
    gameBackground.drawBackground();
    globals.pipeline.drawPipeline();
    globals.ground.drawGround();
    globals.flappyBird.drawBird();
    globals.score.drawScore();
  },
  update: () => {
    globals.pipeline.update();
    globals.ground.update();
    globals.flappyBird.update(); 
    globals.score.update();
  },
  click: () => globals.flappyBird.jump()
};

screens.gameOver = {
  draw() {
    gameOverScreen.drawScreen();
  },
  update() {

  },
  click() {
    changeToScreen(screens.init);
  }
}

function loop(){
  activeScreen.draw();
  activeScreen.update();
  
  frames += 1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
  if(activeScreen.click) {
    sound_Jump.play(); 
    activeScreen.click();
  }
});

window.addEventListener('keydown', ({code}) => {
  if (code = 123 && activeScreen.click) 
    sound_Jump.play();
    activeScreen.click();
});

changeToScreen(screens.init);
loop();