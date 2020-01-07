'use strict'

var intcode = require('./intcode.js');
let fs = require('fs');
let ImageJS = require("imagejs");
let file = './11.txt';
let input = fs.readFileSync(file, 'utf8').split(',').map(v => parseInt(v));

let white = { r: 255, g: 255, b: 255 };
let black = { r: 50, g: 0, b: 0 };
let plane = 200;
let mid = plane / 2;
let pg = new ImageJS.Bitmap({ width: plane, height: plane });

// Delete this, if you want 1st task
pg.setPixel(mid, mid, white);

// let mock = [[1, 0], [0, 0], [1, 0], [1, 0], [0, 1], [1, 0], [1, 0]];



/************* FIRST TASK *************/
let first = (arr) => {
  let ic = intcode.compute(arr);
  ic.next();
  // curent coordiantions and orientation
  let c = { x: mid, y: mid, o: 'N' };

  while (true) {
    let color = ic.next(getColor(c.x, c.y)).value;
    let direction = ic.next().value;

    if (color == undefined || direction == undefined) {
      pg.writeFile("11.jpg", { quality: 100 });
      return countColored();
    }

    pg.setPixel(c.x, c.y, color == 0 ? black : white);
    getNextCoordinates.call(c, direction);

    ic.next();
  }
}

/* Helpers for 1st task */
let countColored = () => {
  let n = 0;

  for (let i = 0; i < plane; i++) {
    for (let j = 0; j < plane; j++) {
      let pixelsRed = pg.getPixel(i, j).r;
      if (pixelsRed == 50 || pixelsRed == 255) n++;
    }
  }

  return n;
}

// returns 0 if black (red = 0), otherwise 1
let getColor = (x, y) => {
  let pixelsRed = pg.getPixel(x, y).r;
  return pixelsRed == 0 || pixelsRed == 50 ? 0 : 1;
}

let getNextCoordinates = function (direction) {
  switch (direction) {
    case this.o == 'N' && 0:
    case this.o == 'S' && 1:
      this.x -= 1;
      this.o = 'W';
      break;
    case this.o == 'N' && 1:
    case this.o == 'S' && 0:
      this.x += 1;
      this.o = 'E';
      break;
    case this.o == 'W' && 1:
    case this.o == 'E' && 0:
      this.y -= 1;
      this.o = 'N';
      break;
    case this.o == 'W' && 0:
    case this.o == 'E' && 1:
      this.y += 1;
      this.o = 'S';
      break;
    default:
      throw new Error('You, my friend, have totaly fucked up!');
  }

  if (this.x > plane || this.y > plane || this.x < 0 || this.y < 0) throw new Error(`Out of bounds! x:${this.x}, y:${this.y}`);
}

/************* SECOND TASK *************/
let second = (arr) => {

}

/* Helpers for 2nd task */



/* OUT */
console.log(`First answer: ${first(input.slice())}.`);
console.log(`Second answer: ${second(input.slice())}.`);

/*
Text:
Advent of Code[About][Events][Shop][Settings][Log Out]quebez 22*
   int y=2019;[Calendar][AoC++][Sponsors][Leaderboard][Stats]
Our sponsors help make Advent of Code possible:
Formlabs - You don't need elves when you have 3D printers...
--- Day 11: Space Police ---
On the way to Jupiter, you're pulled over by the Space Police.

"Attention, unmarked spacecraft! You are in violation of Space Law! All spacecraft must have a clearly visible registration identifier! You have 24 hours to comply or be sent to Space Jail!"

Not wanting to be sent to Space Jail, you radio back to the Elves on Earth for help. Although it takes almost three hours for their reply signal to reach you, they send instructions for how to power up the emergency hull painting robot and even provide a small Intcode program (your puzzle input) that will cause it to paint your ship appropriately.

There's just one problem: you don't have an emergency hull painting robot.

You'll need to build a new emergency hull painting robot. The robot needs to be able to move around on the grid of square panels on the side of your ship, detect the color of its current panel, and paint its current panel black or white. (All of the panels are currently black.)

The Intcode program will serve as the brain of the robot. The program uses input instructions to access the robot's camera: provide 0 if the robot is over a black panel or 1 if the robot is over a white panel. Then, the program will output two values:

First, it will output a value indicating the color to paint the panel the robot is over: 0 means to paint the panel black, and 1 means to paint the panel white.
Second, it will output a value indicating the direction the robot should turn: 0 means it should turn left 90 degrees, and 1 means it should turn right 90 degrees.
After the robot turns, it should always move forward exactly one panel. The robot starts facing up.

The robot will continue running for a while like this and halt when it is finished drawing. Do not restart the Intcode computer inside the robot during this process.

For example, suppose the robot is about to start running. Drawing black panels as ., white panels as #, and the robot pointing the direction it is facing (< ^ > v), the initial state and region near the robot looks like this:

.....
.....
..^..
.....
.....
The panel under the robot (not visible here because a ^ is shown instead) is also black, and so any input instructions at this point should be provided 0. Suppose the robot eventually outputs 1 (paint white) and then 0 (turn left). After taking these actions and moving forward one panel, the region now looks like this:

.....
.....
.<#..
.....
.....
Input instructions should still be provided 0. Next, the robot might output 0 (paint black) and then 0 (turn left):

.....
.....
..#..
.v...
.....
After more outputs (1,0, 1,0):

.....
.....
..^..
.##..
.....
The robot is now back where it started, but because it is now on a white panel, input instructions should be provided 1. After several more outputs (0,1, 1,0, 1,0), the area looks like this:

.....
..<#.
...#.
.##..
.....
Before you deploy the robot, you should probably have an estimate of the area it will cover: specifically, you need to know the number of panels it paints at least once, regardless of color. In the example above, the robot painted 6 panels at least once. (It painted its starting panel twice, but that panel is still only counted once; it also never painted the panel it ended on.)

Build a new emergency hull painting robot and run the Intcode program on it. How many panels does it paint at least once?

Your puzzle answer was 2211.

--- Part Two ---
You're not sure what it's trying to paint, but it's definitely not a registration identifier. The Space Police are getting impatient.

Checking your external ship cameras again, you notice a white panel marked "emergency hull painting robot starting panel". The rest of the panels are still black, but it looks like the robot was expecting to start on a white panel, not a black one.

Based on the Space Law Space Brochure that the Space Police attached to one of your windows, a valid registration identifier is always eight capital letters. After starting the robot on a single white panel instead, what registration identifier does it paint on your hull?

Your puzzle answer was EFCKUEGC.

Both parts of this puzzle are complete! They provide two gold stars: **

At this point, you should return to your Advent calendar and try another puzzle.

If you still want to see it, you can get your puzzle input.

You can also [Share] this puzzle.
*/