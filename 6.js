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

*/