/*
Author: David Sangojinmi
Background image: https://craftpix.net/freebies/free-horizontal-2d-game-backgrounds/?utm_source=opengameart&utm_medium=public&utm_campaign=myself
To-Do:
    - Draw a player sprite
    - Animate the player sprite
    - Create a game paused screen
    - Allow the generated terrain to be scrollable
*/

var cvs = document.getElementById("gameScreen");
var ctx = cvs.getContext("2d");
var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;

// Importing the classes needed
import Platform from "./platform.js";
import Sprite from "./sprite.js";
import gameScreens from "./gameScreens.js";
import gameStats from "./gameStats.js";

// Load all the images
var background = new Image();
//     var player = new Image();
background.src = "images/bg6-3.jpg";
//     player.src = "images/sprite.jpg";

// Load audio
//     var jumpS = new Audio();
//     jumpS.src = "sounds/jump.mp3";

// Important variables
let platform = new Platform(GAME_WIDTH, GAME_HEIGHT);
let sprite = new Sprite(GAME_WIDTH, GAME_HEIGHT);
let gScreens = new gameScreens(GAME_WIDTH, GAME_HEIGHT);
let gStats = new gameStats(GAME_WIDTH, GAME_HEIGHT);
var gamestart = true;
var gameplay = false;
var gamepaused = false;
var gameend = false;
var lastTime = 0;
// var platform = [];
// for (var i = 0; i < 6; i++) {
//     platform[i] = new Platform(GAME_WIDTH, GAME_HEIGHT, 8, 67, 168);
//     platform[i].position.x = 0 + 800 * i;
//     platform[i].position.y = 500;
// }

///////////////////////////////
////  GAMEPLAY FUNCTIONS   ////
///////////////////////////////
function gameStart(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.drawImage(background, 0, 0);
    gScreens.update(deltaTime);
    gScreens.startScreen(ctx);

    window.requestAnimationFrame(gameStart);
}

document.addEventListener("click", (ev) => {
    // ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    if (gamestart === true) {
        if (
            ev.clientX >= 336 &&
            ev.clientX <= 336 + gScreens.play.width &&
            ev.clientY >= 452 &&
            ev.clientY <= 452 + gScreens.play.height
        ) {
            gamestart = false;
            gameplay = true;
            gameLoop();
        }
    }
});

function coinCollision() {
    if (
        sprite.position.x >= gStats.coinX &&
        sprite.position.x + sprite.width <= gStats.coinX + gStats.coin.width &&
        gStats.coinY > sprite.position.y &&
        gStats.coinY + gStats.coin.height <= sprite.position.y + sprite.height
    ) {
        gStats.points += 1;
        //Coin.hide();
    } else {
        gStats.points += 0;
    }
}

function gamePlay(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.drawImage(background, 0, 0);
    platform.drawTerrain(ctx);
    gStats.update(deltaTime);
    gStats.display(ctx);
    gStats.displayCoins(ctx);

    sprite.update(deltaTime);
    sprite.display(ctx, deltaTime);

    coinCollision();

    window.requestAnimationFrame(gamePlay);
}

function gamePaused() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    // Draw resume button
    ctx.fillStyle = "rgb(0, 200, 0)";
    ctx.fillRect(300, 150, 200, 100);
    ctx.fillRect(300, 350, 200, 100);
}

document.addEventListener("keydown", (event) => {
    if (gameplay === true) {
        if (event.code === "ArrowLeft" || event.code === "KeyA") {
            if (sprite.position.x <= 100) {
                platform.scrollLeft();
            } else {
                sprite.moveLeft();
            }
            // gStats.coinX += 5;
        }
        if (event.code === "ArrowRight" || event.code === "KeyD") {
            if (sprite.position.x + 20 >= 700) {
                platform.scrollRight();
            } else {
                sprite.moveRight();
            }
            // gStats.coinX -= 5;
        }
        if (event.code === "ArrowUp" || event.code === "KeyW") {
            sprite.jump(ctx);
        }
    }
});

document.addEventListener("click", (evnt) => {
    // ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    if (gameplay === true) {
        if (
            evnt.clientX >= 17 &&
            evnt.clientX <= 17 + gStats.pause.width &&
            evnt.clientY >= 17 &&
            evnt.clientY <= 17 + gStats.pause.height
        ) {
            gamepaused = true;
            gamePaused();
        }
    }
});

function gameEnd() {
    //////
}

///////////////////////////////
////     GAMEPLAY INIT     ////
///////////////////////////////
function gameLoop() {
    if (gamestart == true) {
        gameStart();
    }
    if (gameplay == true) {
        gamePlay();
    }
    if (gameend == true) {
        gameEnd();
    }
}

gameLoop();