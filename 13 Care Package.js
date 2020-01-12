'use strict'

const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
var intcode = require('./intcode.js');
let ImageJS = require("imagejs");
let fs = require('fs');
let file = './13.txt';
let input = fs.readFileSync(file, 'utf8').split(',').map(v => parseInt(v));
let pg = new ImageJS.Bitmap({ width: 41, height: 25 });

let empty = { r: 255, g: 255, b: 255 }; // 0
let wall = { r: 128, g: 128, b: 128 }; // 1
let block = { r: 10, g: 10, b: 10 }; // 2
let paddle = { r: 0, g: 0, b: 255 }; // 3
let ball = { r: 255, g: 0, b: 0 };  // 4



/************* FIRST TASK *************/
let first = (arr) => {
  let ic = intcode.compute(arr);
  let num = 0;

  while (true) {
    let x = ic.next().value;
    let y = ic.next().value;
    let object = ic.next().value;
    let color;

    if (x == undefined || y == undefined || object == undefined) {
      pg.writeFile("13.jpg", { quality: 100 });
      return num;
    }

    //console.log(x, y, object);

    switch (object) {
      case 0: color = empty; break;
      case 1: color = wall; break;
      case 2: color = block; num++; break;
      case 3: color = paddle; break;
      case 4: color = ball; break;
      default: throw new Error();
    }

    pg.setPixel(x, y, color);
  }
}

/* Helpers for 1st task */



/************* SECOND TASK *************/
let second = (arr) => {
  let width = 41;
  let height = 25;
  // for gif creation speedup
  let paddleLocations = [20, 18, 18, 18, 18, 20, 20, 20, 16, 22, 20, 20, 20, 20, 20, 20, 24, 24, 26, 24, 24, 24, 24, 24, 24, 24, 24, 10, 10, 10, 10, 8, 8, 28, 28, 8, 8, 28, 2, 2, 30, 30, 38, 34, 34, 36, 36, 36, 36, 36, 36, 34, 2, 12, 12, 38, 38, 6, 30, 30, 6, 38, 24, 12, 12, 24, 24, 12, 8, 28, 28, 8, 8, 28, 30, 6, 38, 38, 6, 30, 28, 8, 36, 36, 8, 28, 30, 6, 38, 26, 10, 10, 26, 18, 18, 26, 10, 10, 26, 18, 18, 26, 10, 4, 32, 16, 20, 20, 16, 24, 12, 32, 4, 38, 6, 30, 30, 6, 38, 4, 32, 12, 24, 20, 16, 28, 8, 36];
  //let paddleLocations = [];

  let partialScore = 0;

  while (true) {
    let ic = intcode.compute(arr);
    const canvas = createCanvas(width, height);
    const game = canvas.getContext('2d');

    for (let i = 0; i < width * height; i++) {
      let x = ic.next().value;
      let y = ic.next().value;
      let col = ic.next().value;
      game.fillStyle = getColor(col);
      game.fillRect(x, y, 1, 1);
    }

    const encoder = new GIFEncoder(41, 25);
    encoder.createReadStream().pipe(fs.createWriteStream('13.gif'));
    encoder.start();
    encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(10);  // frame delay in ms
    encoder.setQuality(20); // image quality. 10 is default.
    encoder.addFrame(game);

    let paddleX = 20;
    let index = 0;
    let ballOverPaddle = false;
    let goOn = true;

    while (goOn) {
      let res = ic.next();
      let x, y, o;

      if (res.done == true) {
        encoder.finish();
        console.log(paddleLocations.join(','));
        return partialScore;
      }

      if (res.value == -1) {
        ic.next();
        partialScore = ic.next().value;
      } else {
        if (res.value == undefined) {
          // move w/ paddle
          if (paddleX == paddleLocations[index]) x = ic.next(0).value;
          else {
            let shift = paddleX > paddleLocations[index] ? -1 : 1;
            x = ic.next(shift).value;
            paddleX += shift;
          }
        }
        else {
          x = res.value;
        }

        y = ic.next().value;
        o = ic.next().value;

        game.fillStyle = getColor(o);
        game.fillRect(x, y, 1, 1);
        if (o != 0 && o != 3) encoder.addFrame(game);
        if (ballOverPaddle == true) {
          ballOverPaddle = false;
          index++;
        }
        if (o == 4 && y == 22) {
          ballOverPaddle = true;
          if (index + 1 > paddleLocations.length) {
            paddleLocations.push(x);
            goOn = false;
          }
        }
      }
    }
  }
}

let getColor = object => {
  switch (object) {
    case 0: return 'white';
    case 1: return 'gray';
    case 2: return 'black';
    case 3: return 'green';
    case 4: return 'red';
    default: throw new Error();
  }
}


/* OUT */
console.log(`First answer: ${first(input.slice())}.`);
console.log(`Second answer: ${second(input.slice())}.`);

/*
Text:
Advent of Code[About][Events][Shop][Settings][Log Out]quebez 26*
          2019[Calendar][AoC++][Sponsors][Leaderboard][Stats]
Our sponsors help make Advent of Code possible:
TwilioQuest - Play Advent of Code and earn rad loot in TwilioQuest, a developer RPG for Mac, Windows, and Linux. Learn JavaScript, Python, git, APIs for SMS, VoIP, or WhatsApp, and much more.
--- Day 13: Care Package ---
As you ponder the solitude of space and the ever-increasing three-hour roundtrip for messages between you and Earth, you notice that the Space Mail Indicator Light is blinking. To help keep you sane, the Elves have sent you a care package.

It's a new game for the ship's arcade cabinet! Unfortunately, the arcade is all the way on the other end of the ship. Surely, it won't be hard to build your own - the care package even comes with schematics.

The arcade cabinet runs Intcode software like the game the Elves sent (your puzzle input). It has a primitive screen capable of drawing square tiles on a grid. The software draws tiles to the screen with output instructions: every three output instructions specify the x position (distance from the left), y position (distance from the top), and tile id. The tile id is interpreted as follows:

0 is an empty tile. No game object appears in this tile.
1 is a wall tile. Walls are indestructible barriers.
2 is a block tile. Blocks can be broken by the ball.
3 is a horizontal paddle tile. The paddle is indestructible.
4 is a ball tile. The ball moves diagonally and bounces off objects.
For example, a sequence of output values like 1,2,3,6,5,4 would draw a horizontal paddle tile (1 tile from the left and 2 tiles from the top) and a ball tile (6 tiles from the left and 5 tiles from the top).

Start the game. How many block tiles are on the screen when the game exits?

Your puzzle answer was 230.

--- Part Two ---
The game didn't run because you didn't put in any quarters. Unfortunately, you did not bring any quarters. Memory address 0 represents the number of quarters that have been inserted; set it to 2 to play for free.

The arcade cabinet has a joystick that can move left and right. The software reads the position of the joystick with input instructions:

If the joystick is in the neutral position, provide 0.
If the joystick is tilted to the left, provide -1.
If the joystick is tilted to the right, provide 1.
The arcade cabinet also has a segment display capable of showing a single number that represents the player's current score. When three output instructions specify X=-1, Y=0, the third output instruction is not a tile; the value instead specifies the new score to show in the segment display. For example, a sequence of output values like -1,0,12345 would show 12345 as the player's current score.

Beat the game by breaking all the blocks. What is your score after the last block is broken?

Your puzzle answer was 11140.

Both parts of this puzzle are complete! They provide two gold stars: **

At this point, you should return to your Advent calendar and try another puzzle.

If you still want to see it, you can get your puzzle input.

You can also [Share] this puzzle.
*/