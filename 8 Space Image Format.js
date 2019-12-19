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
Advent of Code[About][Events][Shop][Settings][Log Out]quebez 18*
   int y=2019;[Calendar][AoC++][Sponsors][Leaderboard][Stats]
Our sponsors help make Advent of Code possible:
Xebia - an international network of passionate technologists and craftspeople, dedicated to exploring and creating new frontiers in IT
--- Day 8: Space Image Format ---
The Elves' spirits are lifted when they realize you have an opportunity to reboot one of their Mars rovers, and so they are curious if you would spend a brief sojourn on Mars. You land your ship near the rover.

When you reach the rover, you discover that it's already in the process of rebooting! It's just waiting for someone to enter a BIOS password. The Elf responsible for the rover takes a picture of the password (your puzzle input) and sends it to you via the Digital Sending Network.

Unfortunately, images sent via the Digital Sending Network aren't encoded with any normal encoding; instead, they're encoded in a special Space Image Format. None of the Elves seem to remember why this is the case. They send you the instructions to decode it.

Images are sent as a series of digits that each represent the color of a single pixel. The digits fill each row of the image left-to-right, then move downward to the next row, filling rows top-to-bottom until every pixel of the image is filled.

Each image actually consists of a series of identically-sized layers that are filled in this way. So, the first digit corresponds to the top-left pixel of the first layer, the second digit corresponds to the pixel to the right of that on the same layer, and so on until the last digit, which corresponds to the bottom-right pixel of the last layer.

For example, given an image 3 pixels wide and 2 pixels tall, the image data 123456789012 corresponds to the following image layers:

Layer 1: 123
         456

Layer 2: 789
         012
The image you received is 25 pixels wide and 6 pixels tall.

To make sure the image wasn't corrupted during transmission, the Elves would like you to find the layer that contains the fewest 0 digits. On that layer, what is the number of 1 digits multiplied by the number of 2 digits?

Your puzzle answer was 1463.

--- Part Two ---
Now you're ready to decode the image. The image is rendered by stacking the layers and aligning the pixels with the same positions in each layer. The digits indicate the color of the corresponding pixel: 0 is black, 1 is white, and 2 is transparent.

The layers are rendered with the first layer in front and the last layer in back. So, if a given position has a transparent pixel in the first and second layers, a black pixel in the third layer, and a white pixel in the fourth layer, the final image would have a black pixel at that position.

For example, given an image 2 pixels wide and 2 pixels tall, the image data 0222112222120000 corresponds to the following image layers:

Layer 1: 02
         22

Layer 2: 11
         22

Layer 3: 22
         12

Layer 4: 00
         00
Then, the full image can be found by determining the top visible pixel in each position:

The top-left pixel is black because the top layer is 0.
The top-right pixel is white because the top layer is 2 (transparent), but the second layer is 1.
The bottom-left pixel is white because the top two layers are 2, but the third layer is 1.
The bottom-right pixel is black because the only visible pixel in that position is 0 (from layer 4).
So, the final image looks like this:

01
10
What message is produced after decoding your image?

Your puzzle answer was GKCKH.

Both parts of this puzzle are complete! They provide two gold stars: **

At this point, you should return to your Advent calendar and try another puzzle.

If you still want to see it, you can get your puzzle input.

You can also [Share] this puzzle.
*/