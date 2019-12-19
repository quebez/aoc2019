'use strict'

let fs = require('fs');
let file = './3.txt';
let input = fs.readFileSync(file, 'utf8').split('\r\n').map(v => v.split(','));
//let input = `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
//U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`.split('\n').map(v => v.split(','));

/************* FIRST TASK *************/
let first = (arr) => {
  let x = [[0, 0]];
  let y = [[0, 0]];

  for (let i = 0; i < arr[0].length; i++) {
    x = x.concat(getPath(arr[0][i], x[x.length - 1]));
  }
  for (let i = 0; i < arr[1].length; i++) {
    y = y.concat(getPath(arr[1][i], y[y.length - 1]));
  }

  let crossings = x.filter(v => {
    for (let i = 0; i < y.length; i++) {
      if (v[0] == y[i][0] && v[1] == y[i][1]) return true;
    }
    return false;
  });

  let lowestManhattan = Infinity;
  let index;

  // Starting from 1 b/c crossings[0] is central port ([0, 0])
  for (let i = 1; i < crossings.length; i++) {
    let manhattan = Math.abs(crossings[i][0]) + Math.abs(crossings[i][1]);
    if (manhattan < lowestManhattan) {
      lowestManhattan = manhattan;
      index = i;
    }
  }

  return [crossings[index], lowestManhattan];
}

/* Helpers for 1st task */
let getPath = (vector, lastLoc) => {
  let dirrection = vector.substring(0, 1);
  let path = parseInt(vector.substring(1));
  let res = Array(path);

  for (let i = 0; i < res.length; i++) {
    switch (dirrection) {
      case 'R':
        lastLoc = [lastLoc[0] + 1, lastLoc[1]];
        break;
      case 'L':
        lastLoc = [lastLoc[0] - 1, lastLoc[1]];
        break;
      case 'U':
        lastLoc = [lastLoc[0], lastLoc[1] + 1];
        break;
      case 'D':
        lastLoc = [lastLoc[0], lastLoc[1] - 1];
        break;
    }
    res[i] = lastLoc;
  }
  return res;
}


/************* SECOND TASK *************/
let second = (arr) => {
  let x = [[0, 0]];
  let y = [[0, 0]];

  for (let i = 0; i < arr[0].length; i++) {
    x = x.concat(getPath2(arr[0][i], x[x.length - 1], 'x'));
  }
  for (let i = 0; i < arr[1].length; i++) {
    y = y.concat(getPath2(arr[1][i], y[y.length - 1], 'y'));
  }


  let crossings = [];

  for (let i = 1; i < x.length; i++) {
    for (let j = 1; j < Math.floor(y.length / 2); j++) {
      if ((x[i][0] == y[j][0] && x[i][1] == y[j][1])
        || (x[i][0] == y[j + Math.floor(y.length / 2)][0] && x[i][1] == y[j + Math.floor(y.length / 2)][1])) {
        crossings.push(i + j);
      }
    }
  }

  return Math.min(...crossings);
}

/* Helpers for 2nd task */
let getPath2 = (vector, lastLoc, branch) => {
  let dirrection = vector.substring(0, 1);
  let path = parseInt(vector.substring(1));
  let res = Array(path);

  for (let i = 0; i < res.length; i++) {
    switch (dirrection) {
      case 'R':
        lastLoc = [lastLoc[0] + 1, lastLoc[1]];
        break;
      case 'L':
        lastLoc = [lastLoc[0] - 1, lastLoc[1]];
        break;
      case 'U':
        lastLoc = [lastLoc[0], lastLoc[1] + 1];
        break;
      case 'D':
        lastLoc = [lastLoc[0], lastLoc[1] - 1];
        break;
    }
    res[i] = lastLoc;
  }
  return res;
}


/* OUT */
//console.log(`First answer: ${first(input.slice())}.`);
console.log(`Second answer: ${second(input.slice())}.`);

/*
Text:
Advent of Code[About][Events][Shop][Settings][Log Out]quebez 6*
   var y=2019;[Calendar][AoC++][Sponsors][Leaderboard][Stats]
Our sponsors help make Advent of Code possible:
Formlabs - You don't need elves when you have 3D printers...
--- Day 3: Crossed Wires ---
The gravity assist was successful, and you're well on your way to the Venus refuelling station. During the rush back on Earth, the fuel management system wasn't completely installed, so that's next on the priority list.

Opening the front panel reveals a jumble of wires. Specifically, two wires are connected to a central port and extend outward on a grid. You trace the path each wire takes as it leaves the central port, one wire per line of text (your puzzle input).

The wires twist and turn, but the two wires occasionally cross paths. To fix the circuit, you need to find the intersection point closest to the central port. Because the wires are on a grid, use the Manhattan distance for this measurement. While the wires do technically cross right at the central port where they both start, this point does not count, nor does a wire count as crossing with itself.

For example, if the first wire's path is R8,U5,L5,D3, then starting from the central port (o), it goes right 8, up 5, left 5, and finally down 3:

...........
...........
...........
....+----+.
....|....|.
....|....|.
....|....|.
.........|.
.o-------+.
...........
Then, if the second wire's path is U7,R6,D4,L4, it goes up 7, right 6, down 4, and left 4:

...........
.+-----+...
.|.....|...
.|..+--X-+.
.|..|..|.|.
.|.-X--+.|.
.|..|....|.
.|.......|.
.o-------+.
...........
These wires cross at two locations (marked X), but the lower-left one is closer to the central port: its distance is 3 + 3 = 6.

Here are a few more examples:

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = distance 159
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = distance 135
What is the Manhattan distance from the central port to the closest intersection?

Your puzzle answer was 806.

--- Part Two ---
It turns out that this circuit is very timing-sensitive; you actually need to minimize the signal delay.

To do this, calculate the number of steps each wire takes to reach each intersection; choose the intersection where the sum of both wires' steps is lowest. If a wire visits a position on the grid multiple times, use the steps value from the first time it visits that position when calculating the total value of a specific intersection.

The number of steps a wire takes is the total number of grid squares the wire has entered to get to that location, including the intersection being considered. Again consider the example from above:

...........
.+-----+...
.|.....|...
.|..+--X-+.
.|..|..|.|.
.|.-X--+.|.
.|..|....|.
.|.......|.
.o-------+.
...........
In the above example, the intersection closest to the central port is reached after 8+5+5+2 = 20 steps by the first wire and 7+6+4+3 = 20 steps by the second wire for a total of 20+20 = 40 steps.

However, the top-right intersection is better: the first wire takes only 8+5+2 = 15 and the second wire takes only 7+6+2 = 15, a total of 15+15 = 30 steps.

Here are the best steps for the extra examples from above:

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = 610 steps
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = 410 steps
What is the fewest combined steps the wires must take to reach an intersection?

Your puzzle answer was 66076.

Both parts of this puzzle are complete! They provide two gold stars: **

At this point, you should return to your Advent calendar and try another puzzle.

If you still want to see it, you can get your puzzle input.

You can also [Share] this puzzle.
*/