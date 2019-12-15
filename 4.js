'use strict'

let input = [172930, 683082];


/************* FIRST TASK *************/
let first = (arr) => {
  let pws = [];
  for (let i = arr[0]; i <= arr[1]; i++) {
    if (testIfFitsTheRule(i.toString())) pws.push(i);
  }
  return pws;
}

/* Helpers for 1st task */
let testIfFitsTheRule = x => {
  if ((
    x[5] == x[4] ||
    x[4] == x[3] ||
    x[3] == x[2] ||
    x[2] == x[1] ||
    x[1] == x[0]
  ) && (
      x[0] <= x[1] &&
      x[1] <= x[2] &&
      x[2] <= x[3] &&
      x[3] <= x[4] &&
      x[4] <= x[5]
    )) return true;
  return false;
}


/************* SECOND TASK *************/
let second = (arr) => {
  let a = first(arr);
  let res = [];

  for (let i = 0; i < a.length; i++) {
    let x = a[i].toString();
    if (
      (x[0] == x[1] && x[1] != x[2]) ||
      (x[1] == x[2] && x[0] != x[1] && x[2] != x[3]) ||
      (x[2] == x[3] && x[1] != x[2] && x[3] != x[4]) ||
      (x[3] == x[4] && x[2] != x[3] && x[4] != x[5]) ||
      (x[4] == x[5] && x[3] != x[4])
    ) res.push(a[i]);
  }

  return res;
}

/* Helpers for 2nd task */

/* OUT */
console.log(`First answer: ${first(input.slice()).length}.`);
console.log(`Second answer: ${second(input.slice()).length}.`);

/*
Text:
Advent of Code[About][Events][Shop][Settings][Log Out]quebez 8*
      [Calendar][AoC++][Sponsors][Leaderboard][Stats]
      Our sponsors help make Advent of Code possible:
      Xebia - an international network of passionate technologists and craftspeople, dedicated to exploring and creating new frontiers in IT
      --- Day 4: Secure Container ---
      You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.

      However, they do remember a few key facts about the password:

      It is a six-digit number.
      The value is within the range given in your puzzle input.
      Two adjacent digits are the same (like 22 in 122345).
      Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
      Other than the range rule, the following are true:

      111111 meets these criteria (double 11, never decreases).
      223450 does not meet these criteria (decreasing pair of digits 50).
      123789 does not meet these criteria (no double).
      How many different passwords within the range given in your puzzle input meet these criteria?

      Your puzzle answer was 1675.

      --- Part Two ---
      An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.

      Given this additional criterion, but still ignoring the range rule, the following are now true:

      112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
      123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
      111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).
      How many different passwords within the range given in your puzzle input meet all of the criteria?

      Your puzzle answer was 1142.

      Both parts of this puzzle are complete! They provide two gold stars: **

      At this point, you should return to your Advent calendar and try another puzzle.

      Your puzzle input was 172930-683082.

      You can also [Share] this puzzle.
*/