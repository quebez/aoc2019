'use strict'

let fs = require('fs');
let file = './14 test.txt';
let input = {};
fs.readFileSync(file, 'utf8').split('\r\n').forEach(v => {
  let a = v.split(' ');
  let aL = a.length;
  let mats = [];
  for (let i = 0; i < aL - 3; i += 2) {
    mats.push([parseInt(a[i]), a[i + 1]]);
  }

  input[a[aL - 1]] = {
    qty: parseInt(a[aL - 2]),
    mats: mats
  };
});
//let input = fs.readFileSync(file, 'utf8').split(',').map(v => parseInt(v));


/************* FIRST TASK *************/
let first = (arr) => {
  Object.keys(arr).forEach(function (key) {

    console.log(key, arr[key]);

  });

}

/* Helpers for 1st task */



/************* SECOND TASK *************/
let second = (arr) => {

}

/* Helpers for 2nd task */



/* OUT */
console.log(`First answer: ${first(input)}.`);
console.log(`Second answer: ${second(input)}.`);

/*
Text:

*/