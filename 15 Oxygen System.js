'use strict'

var intcode = require('./intcode.js');
let fs = require('fs');
let ImageJS = require("imagejs");
let file = './15.txt';
let input = fs.readFileSync(file, 'utf8').split(',').map(v => parseInt(v));

let white = { r: 255, g: 255, b: 255 };
let gray = { r: 100, g: 100, b: 100 };
let red = { r: 255, g: 0, b: 0 };
let plane = 50;
let mid = plane / 2;
let pg = new ImageJS.Bitmap({ width: plane, height: plane });
pg.setPixel(mid, mid, red);


/************* FIRST TASK *************/
let first = (arr) => {
  // init intcode
  let ic = intcode.compute(arr);
  ic.next();

  let curLoc = { x: mid, y: mid };

  let r = (fromDir) => {
    // Check all 4 directions
    for (let curDir = 1; curDir < 5; curDir++) {
      if (fromDir != curDir) {
        // Lets try to step somewhere
        let res = ic.next(curDir).value;
        ic.next();

        if (res > 0) {
          curLoc = getLoc(curLoc, curDir);
          if (res == 1) {
            // Found path, going to explore!
            pg.setPixel(curLoc.x, curLoc.y, white);
            let steps = r(getOppositeDir(curDir));
            if (steps >= 1) return ++steps;
          } else {
            // I found the oxygen tank!
            console.log(curLoc.x, curLoc.y);
            pg.setPixel(curLoc.x, curLoc.y, red);
            pg.writeFile("15.jpg", { quality: 100 });
            return 1;
          }
        } else {
          // I hit the wall, oh no!
          let wall = getLoc(curLoc, curDir);
          pg.setPixel(wall.x, wall.y, gray);
        }
      }
    }
    // All paths has been explored, going where I came from...
    curLoc = getLoc(curLoc, fromDir);
    ic.next(fromDir);
    ic.next();
  };

  return r(0);
}

/* Helpers for 1st task */
let getLoc = (xy, direction) => {
  if (xy.x <= 0 || xy.y <= 0) throw 'too small map!';
  switch (direction) {
    case 1: return { x: xy.x, y: xy.y - 1 }; // N
    case 2: return { x: xy.x, y: xy.y + 1 }; // S
    case 3: return { x: xy.x - 1, y: xy.y }; // W
    case 4: return { x: xy.x + 1, y: xy.y }; // E
  }
}

let getOppositeDir = d => {
  switch (d) {
    case 1: return 2;
    case 2: return 1;
    case 3: return 4;
    case 4: return 3;
  }
}

/************* SECOND TASK *************/
let second = (arr) => {
  let max = 0;

  let r = (loc, minutes, fromDir) => {
    let possibleDirs = getPossibleDirs(loc, fromDir);
    if (possibleDirs.lenght == 0) return minutes;

    for (let i = 0; i < possibleDirs.length; i++) {
      let p = r(getLoc(loc, possibleDirs[i]), minutes + 1, getOppositeDir(possibleDirs[i]));
      if (p > max) max = p;
    }

    return minutes;
  }

  r({ x: 39, y: 39 }, 0, 0);
  return max;
}

/* Helpers for 2nd task */

let getPossibleDirs = (loc, fromDir) => {
  let possibleDirs = [];

  for (let i = 1; i < 5; i++) {
    if (i != fromDir && isPath(getLoc(loc, i))) possibleDirs.push(i);
  }

  return possibleDirs;
}

let isPath = xy => pg.getPixel(xy.x, xy.y).g == 255;


/* OUT */
console.log(`First answer: ${first(input.slice())}.`);
console.log(`Second answer: ${second(input.slice())}.`);

/*
Text:
Advent of Code[About][Events][Shop][Settings][Log Out]quebez 32*
       λy.2019[Calendar][AoC++][Sponsors][Leaderboard][Stats]
Our sponsors help make Advent of Code possible:
TNG - The Nerd Group. Solving hard IT problems all year round.
--- Day 15: Oxygen System ---
Out here in deep space, many things can go wrong. Fortunately, many of those things have indicator lights. Unfortunately, one of those lights is lit: the oxygen system for part of the ship has failed!

According to the readouts, the oxygen system must have failed days ago after a rupture in oxygen tank two; that section of the ship was automatically sealed once oxygen levels went dangerously low. A single remotely-operated repair droid is your only option for fixing the oxygen system.

The Elves' care package included an Intcode program (your puzzle input) that you can use to remotely control the repair droid. By running that program, you can direct the repair droid to the oxygen system and fix the problem.

The remote control program executes the following steps in a loop forever:

Accept a movement command via an input instruction.
Send the movement command to the repair droid.
Wait for the repair droid to finish the movement operation.
Report on the status of the repair droid via an output instruction.
Only four movement commands are understood: north (1), south (2), west (3), and east (4). Any other command is invalid. The movements differ in direction, but not in distance: in a long enough east-west hallway, a series of commands like 4,4,4,4,3,3,3,3 would leave the repair droid back where it started.

The repair droid can reply with any of the following status codes:

0: The repair droid hit a wall. Its position has not changed.
1: The repair droid has moved one step in the requested direction.
2: The repair droid has moved one step in the requested direction; its new position is the location of the oxygen system.
You don't know anything about the area around the repair droid, but you can figure it out by watching the status codes.

For example, we can draw the area using D for the droid, # for walls, . for locations the droid can traverse, and empty space for unexplored locations. Then, the initial state looks like this:



   D


To make the droid go north, send it 1. If it replies with 0, you know that location is a wall and that the droid didn't move:


   #
   D


To move east, send 4; a reply of 1 means the movement was successful:


   #
   .D


Then, perhaps attempts to move north (1), south (2), and east (4) are all met with replies of 0:


   ##
   .D#
    #

Now, you know the repair droid is in a dead end. Backtrack with 3 (which you already know will get a reply of 1 because you already know that location is open):


   ##
   D.#
    #

Then, perhaps west (3) gets a reply of 0, south (2) gets a reply of 1, south again (2) gets a reply of 0, and then west (3) gets a reply of 2:


   ##
  #..#
  D.#
   #
Now, because of the reply of 2, you know you've found the oxygen system! In this example, it was only 2 moves away from the repair droid's starting position.

What is the fewest number of movement commands required to move the repair droid from its starting position to the location of the oxygen system?

Your puzzle answer was 404.

--- Part Two ---
You quickly repair the oxygen system; oxygen gradually fills the area.

Oxygen starts in the location containing the repaired oxygen system. It takes one minute for oxygen to spread to all open locations that are adjacent to a location that already contains oxygen. Diagonal locations are not adjacent.

In the example above, suppose you've used the droid to explore the area fully and have the following map (where locations that currently contain oxygen are marked O):

 ##
#..##
#.#..#
#.O.#
 ###
Initially, the only location which contains oxygen is the location of the repaired oxygen system. However, after one minute, the oxygen spreads to all open (.) locations that are adjacent to a location containing oxygen:

 ##
#..##
#.#..#
#OOO#
 ###
After a total of two minutes, the map looks like this:

 ##
#..##
#O#O.#
#OOO#
 ###
After a total of three minutes:

 ##
#O.##
#O#OO#
#OOO#
 ###
And finally, the whole region is full of oxygen after a total of four minutes:

 ##
#OO##
#O#OO#
#OOO#
 ###
So, in this example, all locations contain oxygen after 4 minutes.

Use the repair droid to get a complete map of the area. How many minutes will it take to fill with oxygen?

Your puzzle answer was 406.

Both parts of this puzzle are complete! They provide two gold stars: **

At this point, you should return to your Advent calendar and try another puzzle.

If you still want to see it, you can get your puzzle input.

You can also [Share] this puzzle.
*/