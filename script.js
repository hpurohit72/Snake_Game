const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;
const logicalWidth = canvas.width;
const logicalHeight = canvas.height;
canvas.width = logicalWidth * dpr;
canvas.height = logicalHeight * dpr;
ctx.scale(dpr, dpr);

const tileSize = 20;

const snakeHeadImg = new Image();
snakeHeadImg.src = "assets/snake-head.svg";

const snakeBodyImg = new Image();
snakeBodyImg.src = "assets/snake-body.svg";

const foodImg = new Image();
foodImg.src = "assets/food.svg";


let assetsLoaded = 0;
const totalAssets = 3;
snakeHeadImg.onload = assetLoaded;
snakeBodyImg.onload = assetLoaded;
foodImg.onload = assetLoaded;

function assetLoaded() {
  assetsLoaded++;
  if (assetsLoaded === totalAssets) {
    requestAnimationFrame(gameLoop);
  }
}


let playerName = prompt("Welcome to Snake Game! Please enter your name:", "");


let snake = [
  { x: 100, y: 100 },
  { x: 80, y: 100 },
  { x: 60, y: 100 }
];
let food = { x: 200, y: 200 };
let dx = tileSize; 
let dy = 0;
let score = 0;
let isGameOver = false; 

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;

 
  if (keyPressed === LEFT && dx === tileSize) return;
  if (keyPressed === RIGHT && dx === -tileSize) return;
  if (keyPressed === UP && dy === tileSize) return;
  if (keyPressed === DOWN && dy === -tileSize) return;

  switch (keyPressed) {
    case LEFT:
      dx = -tileSize;
      dy = 0;
      break;
    case UP:
      dx = 0;
      dy = -tileSize;
      break;
    case RIGHT:
      dx = tileSize;
      dy = 0;
      break;
    case DOWN:
      dx = 0;
      dy = tileSize;
      break;
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Draw head
      ctx.drawImage(snakeHeadImg, segment.x, segment.y, tileSize, tileSize);
    } else {
      // Draw body
      ctx.drawImage(snakeBodyImg, segment.x, segment.y, tileSize, tileSize);
    }
  });
}

function drawFood() {
  ctx.drawImage(foodImg, food.x, food.y, tileSize, tileSize);
}


function update() {
  const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };


  if (
    newHead.x < 0 ||
    newHead.x >= logicalWidth ||
    newHead.y < 0 ||
    newHead.y >= logicalHeight
  ) {
    return gameOver();
  }

 
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
      return gameOver();
    }
  }


  snake.unshift(newHead);


  if (newHead.x === food.x && newHead.y === food.y) {
    score += 10;
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  const cols = logicalWidth / tileSize;
  const rows = logicalHeight / tileSize;
  food.x = Math.floor(Math.random() * cols) * tileSize;
  food.y = Math.floor(Math.random() * rows) * tileSize;
}


function clearCanvas() {
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);
}

function displayScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 20);
}

function gameOver() {
  isGameOver = true;
  ctx.font = "40px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("Game Over!", 250, 300);
  // Delay the alert slightly so the game over text is visible
  setTimeout(() => {
    alert(`Game Over, ${playerName}! Your final score is: ${score}`);
  }, 100);
}

const snakeSpeed = 100; 


let lastUpdateTime = 0;

function gameLoop(currentTime) {
  if (isGameOver) return; 

  // Schedule the next frame
  requestAnimationFrame(gameLoop);


  if (!lastUpdateTime) {
    lastUpdateTime = currentTime;
  }

  const elapsed = currentTime - lastUpdateTime;
  if (elapsed > snakeSpeed) {
    clearCanvas();
    update();
    drawFood();
    drawSnake();
    displayScore();
    lastUpdateTime = currentTime;
  }
}
