'use strict'

let fs = require('fs');
let file = './16.txt';
let input = fs.readFileSync(file, 'utf8').split('').map(Number);

/************* FIRST TASK *************/
let first = (arr) => {
  for (let x = 0; x < 100; x++) {
    let newArr = Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      let n = 0;
      let positive = true;
      for (let j = i; j < arr.length; j += (i + 1) * 2) {
        for (let k = j; k < j + i + 1 && k < arr.length; k++) {
          n = positive ? n + arr[k] : n - arr[k];
        }
        positive = !positive;
      }
      newArr[i] = parseInt(n.toString()[n.toString().length - 1]);
    }
    arr = newArr.slice();
  }
  return (arr.join('').substring(0, 8));
}

/* Helpers for 1st task */



/************* SECOND TASK *************/
let second = (arr) => { }

/* Helpers for 2nd task */



/* OUT */
console.log(`First answer: ${first(input.slice())}.`);
console.log(`Second answer: ${second(input.slice())}.`);

/*
Text:

*/