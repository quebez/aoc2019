'use strict'

var intcode = require('./intcode.js');
let fs = require('fs');
let file = './7.txt';
let input = fs.readFileSync(file, 'utf8').split(',').map(v => parseInt(v));
//let input = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0'.split(',').map(v => parseInt(v));
//let input = '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10'.split(',').map(v => parseInt(v));
//let input = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5'.split(',').map(v => parseInt(v));


/************* FIRST TASK *************/
let first = (arr) => {
  let res = [];
  let combos = permute([0, 1, 2, 3, 4]);

  for (let i = 0; i < combos.length; i++) {
    res.push(intcode5times(arr, combos[i]));
  }

  return Math.max(...res);
}

/* Helpers for 1st task */
let intcode5times = (arr, inputs) => {
  let carry = 0;

  for (let i = 0; i < inputs.length; i++) {
    let pc = intcode.compute(arr);
    pc.next();
    pc.next(inputs[i]);
    carry = pc.next(carry).value;
  }

  return carry;
}

let permute = permutation => {
  let length = permutation.length,
    result = [permutation.slice()],
    c = new Array(length).fill(0),
    i = 1, k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}


/************* SECOND TASK *************/
let second = (arr) => {
  let res = [];
  let phaseSettings = permute([5, 6, 7, 8, 9]);

  for (let i = 0; i < phaseSettings.length; i++) {
    res.push(compute(arr.slice(), phaseSettings[i]));
  }

  return Math.max(...res);
}

/* Helpers for 2nd task */
function generator(arr, phaseSetting) {
  let pc = intcode.compute(arr);
  pc.next();
  pc.next(phaseSetting);
  return pc;
}

let compute = (arr, phaseSettings) => {
  let first = generator(arr.slice(), phaseSettings[0]);
  let second = generator(arr.slice(), phaseSettings[1]);
  let third = generator(arr.slice(), phaseSettings[2]);
  let fourth = generator(arr.slice(), phaseSettings[3]);
  let fifth = generator(arr.slice(), phaseSettings[4]);
  let generators = [first, second, third, fourth, fifth];
  let carry = 0;
  let completed = false;

  while (!completed) {
    for (let i = 0; i < generators.length; i++) {
      let res = generators[i].next(carry);
      generators[i].next(phaseSettings[i]);

      if (res.done == true) return carry;
      else carry = res.value;
    }
  }
}


/* OUT */
//console.log(`First answer: ${first(input.slice())}. Correct is 14902.`);
console.log(`Second answer: ${second(input.slice())}.`);

/*
Text:

*/