var canvas = $("#canvas")[0];
var context = canvas.getContext("2d");
var score = 0;

var paddleX = 200;
var paddleY = 460;
var paddleWidth = 100;
var paddleHeight = 15;
var paddleDeltaX = 0;
var paddleDeltaY = 0;

var ballX = 300;
var ballY = 300;
var ballRadius = 10;

var bricksPerRow = 8;
var bricksPerCol = 4;
var brickHeight = 20;
var brickWidth = canvas.width/bricksPerRow;
var bricks = [
  [1,1,1,1,1,1,1,2],
  [1,1,3,1,0,1,1,1],
  [2,1,2,1,2,1,0,1],
  [1,2,1,1,0,3,1,1]
];

var paddleMove;
var paddleDeltaX;
var paddleSpeedX = 10;

function drawPaddle() {
  context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function drawBall() {
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 0, Math.PI*2, true);
  context.fill();
}

function drawBrick(x, y, type) {
  switch(type){
    case 1:
      context.fillStyle = 'orange';
      break;
    case 2:
      context.fillStyle = 'rgb(100,200,100)';
      break;
    case 3:
      context.fillStyle = 'rgba(50,100,50,.5)';
      break;
    default:
      context.clearRect(x*brickWidth,y*brickHeight,brickWidth,brickHeight);
      break;
    }
    if(type){
      context.fillRect(x * brickWidth, y * brickHeight, brickWidth, brickHeight);

      context.strokeRect(x * brickWidth + 1, y * brickHeight + 1, brickWidth - 2, brickHeight - 2);
    }
}

function createBricks() {
  for (var i = 0; i < bricks.length; i++) {
    for (var j = 0; j < bricks[i].length; j++) {
      drawBrick(j, i, bricks[i][j]);
    }
  }
}

function displayScoreBoard() {
  context.fillStyle = "rgb(50, 100, 50)";
  context.font = "20px Arial";

  context.clearRect(0, canvas.height - 30, canvas.width, 30);

  context.fillText("Score: " + score, 10, canvas.height - 5);
}

function moveBall() {
  if((ballY + ballDeltaY - ballRadius < 0) || collisionYWithBricks()) {
    ballDeltaY = -ballDeltaY;
  }

  if(ballY + ballDeltaY + ballRadius > canvas.height) {
    endGame();
  }

  if((ballX + ballDeltaX - ballRadius < 0) || (ballX + ballDeltaX + ballRadius > canvas.width) || collisionXWithBricks()) {
    ballDeltaX = -ballDeltaX;
  }

  if(ballY + ballDeltaY + ballRadius >= paddleY){
    if(ballX + ballDeltaX >= paddleX && ballX + ballDeltaX <= paddleX + paddleWidth) {
      ballDeltaY = -ballDeltaY;
    }
  }

  ballX += ballDeltaX;
  ballY += ballDeltaY;
}

function movePaddle() {
  if(paddleMove === "LEFT") {
    paddleDeltaX = -paddleSpeedX;
  } else if(paddleMove === "RIGHT"){
    paddleDeltaX = paddleSpeedX;
  } else {
    paddleDeltaX = 0;
  }

  if (paddleX + paddleDeltaX < 0 || paddleX + paddleDeltaX +paddleWidth >canvas.width){
    paddleDeltaX = 0;
  }

  paddleX = paddleX + paddleDeltaX;
}

function explodeBrick(i, j) {
  bricks[i][j]--;

  if(bricks[i][j] > 0) {
    score++;
  } else {
    score += 2;
  }
}

function collisionXWithBricks() {
  var bumpedX = false;
  for (var i = 0; i < bricks.length; i++) {
    for (var j = 0; j < bricks[i].length; j++) {
      if(bricks[i][j]) {
        var brickX = j * brickWidth;
        var brickY = i * brickHeight;
        if(((ballX + ballDeltaX + ballRadius >= brickX) && (ballX +   ballRadius <= brickX))
        ||
        ((ballX + ballDeltaX - ballRadius <= brickX + brickWidth) && (ballX - ballRadius >= brickX + brickWidth))) {
          if((ballY + ballDeltaY - ballRadius <= brickY + brickHeight) && (ballY + ballDeltaY + ballRadius >= brickY)) {
            explodeBrick(i, j);
            bumpedX = true;
          }
        }
      }
    }
  }
  return bumpedX;
}

function collisionYWithBricks(){
  var bumpedY = false;
  for (var i=0; i < bricks.length; i++) {
    for (var j=0; j < bricks[i].length; j++) {
      if (bricks[i][j]){
      var brickX = j * brickWidth;
      var brickY = i * brickHeight;
        if (((ballY + ballDeltaY - ballRadius <= brickY + brickHeight) && (ballY - ballRadius >= brickY + brickHeight))
        ||
        ((ballY + ballDeltaY + ballRadius >= brickY) &&
        (ballY + ballRadius <= brickY ))){
          if (ballX + ballDeltaX + ballRadius >= brickX &&
              ballX + ballDeltaX - ballRadius <= brickX + brickWidth){
              explodeBrick(i,j);
              bumpedY = true;
          }
        }
      }
    }
  }
  return bumpedY;
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  createBricks();
  displayScoreBoard();
  moveBall();
  movePaddle();
  drawPaddle();
  drawBall();
}

function startGame() {
  ballDeltaX = -2;
  ballDeltaY = -4;
  paddleMove = "NONE";
  paddleDeltaX = 0;

  gameLoop = setInterval(animate, 20);

  $(document).keydown(function(e){
    if(e.keyCode === 39) {
      paddleMove = "RIGHT";
    } else if (e.keyCode === 37) {
      paddleMove = "LEFT";
    }
  })

  $(document).keyup(function(e){
    if(e.keyCode === 39) {
      paddleMove = "NONE";
    } else if(e.keyCode === 37){
      paddleMove = "NONE";
    }
  })
}

function endGame() {
  clearInterval(gameLoop);
  context.fillText("The End!!!", canvas.width / 2, canvas.height / 2);
}

startGame();
