'use strict'

let fs = require('fs');
let file = './8.txt';
//let input = '0222112222120000';
let input = fs.readFileSync(file, 'utf8');


/************* FIRST TASK *************/
let first = (arr) => {
  let layerLength = 25 * 6;
  let multiplication;
  let lowestZeroes = Infinity;
  let zeroes = 0;
  let ones = 0;
  let twos = 0;
  for (let i = 0; i < arr.length / layerLength; i++) {
    for (let j = 0; j < layerLength; j++) {
      if (arr[i * layerLength + j] == 1) ones++;
      else if (arr[i * layerLength + j] == 2) twos++;
      else if (arr[i * layerLength + j] == 0) zeroes++;
    }
    if (zeroes < lowestZeroes) {
      lowestZeroes = zeroes;
      multiplication = twos * ones;
    }
    zeroes = 0;
    ones = 0;
    twos = 0;
  }
  return multiplication;
}

/* Helpers for 1st task */



/************* SECOND TASK *************/
let second = (arr) => {
  let painting = Array(6).fill(2).map(v => Array(25).fill(2));
  let layerLength = 25 * 6;
  //let painting = Array(2).fill(2).map(v => Array(2).fill(2));
  //let layerLength = 2 * 2;
  let numberOfLayers = arr.length / layerLength;

  for (let i = 0; i < numberOfLayers; i++) {
    //console.log(i);
    //log(painting);
    painting = getLayer(arr, painting);
    arr = arr.substr(layerLength);
  }
  log(painting);
}

/* Helpers for 2nd task */
let getLayer = (raw, painting) => {
  let x = 0;

  for (let i = 0; i < painting.length; i++) {
    for (let j = 0; j < painting[i].length; j++) {
      if (painting[i][j] === 2 && raw[x] !== '2') {
        //painting[i][j] = raw[x];
        painting[i][j] = raw[x] == 0 ? ' ' : '█';
      }
      x++;
    }
  }

  return painting;
}

let log = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i].join(''));
  }
}


/* OUT */
console.log(`First answer: ${first(input.slice())}.`);
console.log(`Second answer: ${second(input.slice())}.`);

/*
Text:

*/