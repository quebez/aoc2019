'use strict'

require('./intcode.js');
let fs = require('fs');
let file = './5.txt';
let input = fs.readFileSync(file, 'utf8').split(',').map(val => parseInt(val));
//let input = '3,0,4,0,99'.split(',').map(val => parseInt(val));
//let input = '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99'.split(',').map(val => parseInt(val));


/************* FIRST TASK *************/
let first = (arr) => {
  return intcode(arr, 1);
}

/* Helpers for 1st task */



/************* SECOND TASK *************/
let second = (arr) => {
  return intcode(arr, 5);
}

/* Helpers for 2nd task */



/* OUT */
console.log(`First answer: ${first(input.slice())}.`);
console.log(`Second answer: ${second(input.slice())}.`);

/*
Text:

*/