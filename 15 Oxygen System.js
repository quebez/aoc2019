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
    case 1: return { x: xy.x, y: xy.y - 1 };
    case 2: return { x: xy.x, y: xy.y + 1 };
    case 3: return { x: xy.x - 1, y: xy.y };
    case 4: return { x: xy.x + 1, y: xy.y };
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

}

/* Helpers for 2nd task */



/* OUT */
console.log(`First answer: ${first(input.slice())}.`);
console.log(`Second answer: ${second(input.slice())}.`);

/*
Text:

*/