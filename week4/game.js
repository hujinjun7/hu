const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const bestScoreText = document.getElementById("bestScore");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const historyBox = document.getElementById("history");


let gameRunning = false;
let score = 0;
let bestScore = 0;

let animationId;
let meteorTimer = 0;

const keys = {};

const player = {
 x: canvas.width / 2 - 20,
 y: canvas.height - 65,
 width: 40,
 height: 45,
 speed: 6
};

let meteors = [];
let stars = [];
let playHistory = [];


/* --------------------
  STAR BACKGROUND
-------------------- */

function createStars() {

 stars = [];

 for (let i = 0; i < 80; i++) {

   stars.push({
     x: Math.random() * canvas.width,
     y: Math.random() * canvas.height,
     size: Math.random() * 2 + 1
   });

 }

}

function drawStars() {

 ctx.fillStyle = "white";

 stars.forEach(star => {

   ctx.globalAlpha = Math.random() * 0.5 + 0.5;

   ctx.fillRect(
     star.x,
     star.y,
     star.size,
     star.size
   );

 });

 ctx.globalAlpha = 1;

}


/* --------------------
  PLAYER
-------------------- */

function drawPlayer() {

 ctx.save();

 ctx.translate(
   player.x + player.width / 2,
   player.y + player.height / 2
 );

 /* spaceship body */

 ctx.fillStyle = "#60a5fa";

 ctx.beginPath();

 ctx.moveTo(0, -22);
 ctx.lineTo(-18, 20);
 ctx.lineTo(0, 12);
 ctx.lineTo(18, 20);

 ctx.closePath();
 ctx.fill();


 /* window */

 ctx.fillStyle = "#dbeafe";

 ctx.beginPath();
 ctx.arc(0, -4, 6, 0, Math.PI * 2);
 ctx.fill();


 /* engine */

 ctx.fillStyle = "#f97316";

 ctx.beginPath();

 ctx.moveTo(-6, 18);
 ctx.lineTo(0, 32);
 ctx.lineTo(6, 18);

 ctx.closePath();
 ctx.fill();


 ctx.restore();

}


/* --------------------
  METEORS
-------------------- */

function createMeteor() {

 const size = Math.random() * 25 + 25;

 meteors.push({

   x: Math.random() * (canvas.width - size),

   y: -size,

   width: size,

   height: size,

   speed: Math.random() * 2 + 2.5

 });

}


function drawMeteors() {

 meteors.forEach(meteor => {

   ctx.fillStyle = "#a16207";

   ctx.beginPath();

   ctx.arc(
     meteor.x + meteor.width / 2,
     meteor.y + meteor.height / 2,
     meteor.width / 2,
     0,
     Math.PI * 2
   );

   ctx.fill();


   ctx.fillStyle = "#713f12";

   ctx.beginPath();

   ctx.arc(
     meteor.x + meteor.width * 0.35,
     meteor.y + meteor.height * 0.35,
     meteor.width * 0.12,
     0,
     Math.PI * 2
   );

   ctx.fill();

 });

}


/* --------------------
  MOVEMENT
-------------------- */

function movePlayer() {

 if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
   player.x -= player.speed;
 }

 if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
   player.x += player.speed;
 }


 if (player.x < 0) {
   player.x = 0;
 }

 if (player.x + player.width > canvas.width) {
   player.x = canvas.width - player.width;
 }

}


function moveMeteors() {

 meteors.forEach(meteor => {
   meteor.y += meteor.speed;
 });


 meteors = meteors.filter(meteor => {

   if (meteor.y > canvas.height) {

     score++;

     scoreText.textContent = score;

     return false;
   }

   return true;

 });

}


/* --------------------
  COLLISION
-------------------- */

function collision(a, b) {

 return (
   a.x < b.x + b.width &&
   a.x + a.width > b.x &&
   a.y < b.y + b.height &&
   a.y + a.height > b.y
 );

}


function checkCollision() {

 for (const meteor of meteors) {

   if (collision(player, meteor)) {

     endGame();

     return;
   }

 }

}


/* --------------------
  GAME LOOP
-------------------- */

function gameLoop() {

 if (!gameRunning) return;


 ctx.clearRect(
   0,
   0,
   canvas.width,
   canvas.height
 );


 ctx.fillStyle = "#050816";

 ctx.fillRect(
   0,
   0,
   canvas.width,
   canvas.height
 );


 drawStars();

 movePlayer();

 moveMeteors();


 meteorTimer++;

 if (meteorTimer > 55) {

   createMeteor();

   meteorTimer = 0;

 }


 drawMeteors();

 drawPlayer();

 checkCollision();


 animationId = requestAnimationFrame(gameLoop);

}


/* --------------------
  START / END
-------------------- */

function startGame() {

 if (gameRunning) return;

 gameRunning = true;

 score = 0;

 meteors = [];

 meteorTimer = 0;

 player.x =
   canvas.width / 2 -
   player.width / 2;


 scoreText.textContent = score;


 gameLoop();

}


function endGame() {

 gameRunning = false;

 cancelAnimationFrame(animationId);


 if (score > bestScore) {

   bestScore = score;

   bestScoreText.textContent = bestScore;

 }


 playHistory.push(score);

 updateHistory();


 setTimeout(() => {

   alert(
     "게임 종료!\n점수: " + score
   );

 }, 100);

}


/* --------------------
  HISTORY
-------------------- */

function updateHistory() {

 if (playHistory.length === 0) {

   historyBox.textContent =
     "아직 플레이 기록이 없습니다.";

   return;
 }


 let html = "<strong>최근 플레이</strong><br><br>";


 playHistory
   .slice(-5)
   .reverse()
   .forEach((value, index) => {

     html +=
       `${index + 1}. ${value}점<br>`;

   });


 historyBox.innerHTML = html;

}


/* --------------------
  INPUT
-------------------- */

document.addEventListener("keydown", event => {

 keys[event.key] = true;

});


document.addEventListener("keyup", event => {

 keys[event.key] = false;

});


startBtn.addEventListener(
 "click",
 startGame
);


resetBtn.addEventListener(
 "click",
 () => {

   gameRunning = false;

   cancelAnimationFrame(animationId);

   startGame();

 }
);


/* --------------------
  INITIAL SCREEN
-------------------- */

createStars();


ctx.fillStyle = "#050816";

ctx.fillRect(
 0,
 0,
 canvas.width,
 canvas.height
);


drawStars();

drawPlayer();


ctx.fillStyle = "white";

ctx.font = "24px Arial";

ctx.textAlign = "center";

ctx.fillText(
 "START 버튼을 눌러 게임을 시작하세요",
 canvas.width / 2,
 canvas.height / 2
);
