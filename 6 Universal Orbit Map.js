'use strict'

let fs = require('fs');
let file = './6.txt';
//let input = fs.readFileSync(file, 'utf8').split('\r\n').map(v => v.split(')'));
let input = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`.split('\n').map(v => v.split(')'));


/************* FIRST TASK *************/
let first = (arr) => {
  let res = map(arr);
  let nodes = res[0];
  let root = res[1];

  return (countChild(nodes, root, 0));
}

/* Helpers for 1st task */
let map = arr => {
  let nodes = {}; // parent: [...childs]
  let root = arr[0][0];

  for (let i = 0; i < arr.length; i++) {
    if (nodes[arr[i][0]] == undefined) nodes[arr[i][0]] = [arr[i][1]];
    else nodes[arr[i][0]].push(arr[i][1]);

    if (root == arr[i][1]) {
      root = findRoot(arr, i, i);
    }
  }

  return [nodes, root];
}

let findRoot = (arr, susRootPos, i) => {
  //console.log(`finding root, i=${i}, suspecting ${arr[susRootPos][0]}`);
  let root = arr[susRootPos][0];

  for (let j = 0; j < i; j++) {
    if (root == arr[j][1]) {
      root = findRoot(arr, j, i);
      return root;
    }
  }
}

let countChild = (nodes, parent, nodeValue) => {
  let count = 0;
  //console.log(`counting nodes of parent ${parent} who has value ${nodeValue} and these childs ${nodes[parent]}`);

  nodeValue++;
  if (nodes[parent]) {
    for (let i = 0; i < nodes[parent].length; i++) {
      count += nodeValue + countChild(nodes, nodes[parent][i], nodeValue);
    }
  }

  return count;
}


/************* SECOND TASK *************/
let pathYR = [];
let pathSR = [];

let second = (arr) => {
  let res = map(arr);
  let nodes = res[0];
  let root = res[1];
  let arrYouPos;
  let arrSanPos;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i][1] == 'YOU') arrYouPos = i;
    else if (arr[i][1] == 'SAN') arrSanPos = i;
    if (arrYouPos && arrSanPos) break;
  }
  findPath(arr, arrYouPos, arr.length - 1, 'YR');
  findPath(arr, arrSanPos, arr.length - 1, 'SR');

  //console.log(pathSR, pathYR);
  for (let i = 0; i < pathSR.length; i++) {
    //console.log(pathSR[pathSR.length - 1], pathYR[pathYR.length - 1]);
    if (pathSR[pathSR.length - 1] == pathYR[pathYR.length - 1]) {
      pathSR.pop();
      pathYR.pop();
    } else {
      break;
    }
  }

  //console.log(pathSR, pathYR);
  return pathSR.length + pathYR.length;
}

let anotherSecond = (arr) => {
  let nodes = map(arr)[0];

  let res = minimumNumberOfOrbitalTransfers(nodes, arr, 'YOU', 'SAN');
  console.log(res);
  return res.length - 3;
}


/* Helpers for 2nd task */
let minimumNumberOfOrbitalTransfers = (nodes, arr, origin, destination) => {
  let ignoredChildPath;
  let path = [origin];

  while (true) {
    let parent = findParent(arr, origin);
    path.push(parent);
    ignoredChildPath = origin;
    let isInChildNodes = checkChildNodes(nodes, parent, destination, ignoredChildPath);
    if (isInChildNodes.length > 0) {
      //path.push(isInChildNodes); //isInChildNodes + i;
      return path.concat(isInChildNodes);
    }
    origin = parent;
  }
}

let checkPath = (nodes, start, destination) => {
  let hops = [];
  //console.log(start, nodes[start]);
  if (start == destination) {
    return [start];
  };

  if (nodes[start] != undefined) {
    for (let i = 0; i < nodes[start].length; i++) {
      let res = checkPath(nodes, nodes[start][i], destination);
      //console.log(res, "start:", start, "child:", nodes[start][i]);
      if (res != undefined) {
        // hops.push(start, res);
        res.push(start);
        //console.log(res.length);
        /*
        
        if (res == Array) hops.concat(res);
        else hops.push(start, res);
        console.log(hops);*/
        return res;
      }
    }
  }
}

let checkChildNodes = (nodes, parent, destination, ignoredChildPath) => {
  //console.log(parent, nodes[parent]);
  for (let i = 0; i < nodes[parent].length; i++) {
    if (nodes[parent][1] != ignoredChildPath) {
      let x = checkPath(nodes, nodes[parent][i], destination);
      if (x != undefined) return x;
    }
  }
  return [];
}

let findParent = (arr, node) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][1] == node) return arr[i][0];
  }
}

let findPath = (arr, susRootPos, i, path) => {
  //console.log(`finding root, i=${i}, suspecting ${arr[susRootPos][0]}`);
  let root = arr[susRootPos][0];

  for (let j = 0; j < i; j++) {
    if (root == arr[j][1]) {
      if (path == 'SR') pathSR.push(arr[j][1]);
      else if (path == 'YR') pathYR.push(arr[j][1]);
      root = findPath(arr, j, i, path);
      break;
    }
  }
  return root;
}


/* OUT */
console.log(`First answer: ${first(input.slice())}.`);
console.log(`Second answer: ${second(input.slice())}.`);
console.log(`Another second answer: ${anotherSecond(input.slice())}.`);

/*
Text:
Advent of Code[About][Events][Shop][Settings][Log Out]quebez 18*
   0xffff&2019[Calendar][AoC++][Sponsors][Leaderboard][Stats]
Our sponsors help make Advent of Code possible:
Xandr - Improving advertising for brands and consumers.
--- Day 6: Universal Orbit Map ---
You've landed at the Universal Orbit Map facility on Mercury. Because navigation in space often involves transferring between orbits, the orbit maps here are useful for finding efficient routes between, for example, you and Santa. You download a map of the local orbits (your puzzle input).

Except for the universal Center of Mass (COM), every object in space is in orbit around exactly one other object. An orbit looks roughly like this:

                  \
                   \
                    |
                    |
AAA--> o            o <--BBB
                    |
                    |
                   /
                  /
In this diagram, the object BBB is in orbit around AAA. The path that BBB takes around AAA (drawn with lines) is only partly shown. In the map data, this orbital relationship is written AAA)BBB, which means "BBB is in orbit around AAA".

Before you use your map data to plot a course, you need to make sure it wasn't corrupted during the download. To verify maps, the Universal Orbit Map facility uses orbit count checksums - the total number of direct orbits (like the one shown above) and indirect orbits.

Whenever A orbits B and B orbits C, then A indirectly orbits C. This chain can be any number of objects long: if A orbits B, B orbits C, and C orbits D, then A indirectly orbits D.

For example, suppose you have the following map:

COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
Visually, the above map of orbits looks like this:

        G - H       J - K - L
       /           /
COM - B - C - D - E - F
               \
                I
In this visual representation, when two objects are connected by a line, the one on the right directly orbits the one on the left.

Here, we can count the total number of orbits as follows:

D directly orbits C and indirectly orbits B and COM, a total of 3 orbits.
L directly orbits K and indirectly orbits J, E, D, C, B, and COM, a total of 7 orbits.
COM orbits nothing.
The total number of direct and indirect orbits in this example is 42.

What is the total number of direct and indirect orbits in your map data?

Your puzzle answer was 227612.

--- Part Two ---
Now, you just need to figure out how many orbital transfers you (YOU) need to take to get to Santa (SAN).

You start at the object YOU are orbiting; your destination is the object SAN is orbiting. An orbital transfer lets you move from any object to an object orbiting or orbited by that object.

For example, suppose you have the following map:

COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN
Visually, the above map of orbits looks like this:

                          YOU
                         /
        G - H       J - K - L
       /           /
COM - B - C - D - E - F
               \
                I - SAN
In this example, YOU are in orbit around K, and SAN is in orbit around I. To move from K to I, a minimum of 4 orbital transfers are required:

K to J
J to E
E to D
D to I
Afterward, the map of orbits looks like this:

        G - H       J - K - L
       /           /
COM - B - C - D - E - F
               \
                I - SAN
                 \
                  YOU
What is the minimum number of orbital transfers required to move from the object YOU are orbiting to the object SAN is orbiting? (Between the objects they are orbiting - not between YOU and SAN.)

Your puzzle answer was 454.

Both parts of this puzzle are complete! They provide two gold stars: **

At this point, you should return to your Advent calendar and try another puzzle.

If you still want to see it, you can get your puzzle input.

You can also [Share] this puzzle.
*/