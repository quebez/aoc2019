/*
iProgram: An Intcode program is a list of integers.
input: a single integer.
*/
module.exports.compute = function* (iProgram) {
  let output = null;
  let relativeBase = 0;

  for (let i = 0; i < iProgram.length; i) {
    let fullOpcode = iProgram[i].toString();
    let modes = [0, 0, 0];
    let opcode = parseInt(fullOpcode.slice(-2));

    if (fullOpcode.length > 2) {
      modes[0] = parseInt(fullOpcode.slice(-3, -2)) || 0;
      modes[1] = parseInt(fullOpcode.slice(-4, -3)) || 0;
      modes[2] = parseInt(fullOpcode.slice(-5, -4)) || 0;
    }

    let threeParameters = opcode === 1 || opcode === 2 || opcode === 7 || opcode === 8;
    let twoParameters = threeParameters || opcode === 5 || opcode === 6 || opcode === 8;
    let oneParameter = twoParameters || opcode === 3 || opcode === 4 || opcode === 9;
    let a;
    let b;
    let aIndex;
    let cIndex;

    //console.log(opcode, oneParameter, twoParameters, threeParameters);
    //console.log(iProgram.join());
    /* 
      mode = 0: position (index)
      mode = 1: immediate (this number)
      mode = 2: relalative (index + base offset)
    */
    if (oneParameter) {
      aIndex = modes[0] === 0 ? iProgram[i + 1] : modes[0] === 2 ? iProgram[i + 1] + relativeBase : 0;
      if (aIndex > iProgram.length) iProgram = prolong(iProgram, aIndex - iProgram.length);
      a = modes[0] === 1 ? iProgram[i + 1] : iProgram[aIndex];

      if (twoParameters) {
        let bIndex = modes[1] === 0 ? iProgram[i + 2] : modes[1] === 2 ? iProgram[i + 2] + relativeBase : 0;
        if (bIndex >= iProgram.length) iProgram = prolong(iProgram, bIndex - iProgram.length);
        b = modes[1] === 1 ? iProgram[i + 2] : iProgram[bIndex];

        if (threeParameters) {
          cIndex = modes[2] === 0 ? iProgram[i + 3] : modes[2] === 2 ? iProgram[i + 3] + relativeBase : 0;
          if (cIndex >= iProgram.length) iProgram = prolong(iProgram, cIndex - iProgram.length);
        }
      }
    }

    switch (opcode) {
      /* Opcode 1 adds together numbers read from two positions and stores the result in a third position. The three integers immediately after the opcode tell you these three positions - the first two indicate the positions from which you should read the input values, and the third indicates the position at which the output should be stored. */
      case 1:
        iProgram[cIndex] = a + b;
        i += 4;
        break;
      /* Opcode 2 works exactly like opcode 1, except it multiplies the two inputs instead of adding them. Again, the three integers after the opcode indicate where the inputs and outputs are, not their values. */
      case 2:
        iProgram[cIndex] = a * b;
        i += 4;
        break;
      /* Opcode 3 takes a single integer as input and saves it to the position given by its only parameter. For example, the instruction 3,50 would take an input value and store it at address 50. */
      case 3:
        iProgram[aIndex] = yield;
        i += 2;
        break;
      /* Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 would output the value at address 50. */
      case 4:
        // console.log(`Requested output: ${a}`);
        yield a;
        i += 2;
        break;
      /* Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing. */
      case 5:
        if (a != 0) i = b;
        else i += 3;
        break;
      /* Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing. */
      case 6:
        if (a == 0) i = b;
        else i += 3;
        break;
      /* Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0. */
      case 7:
        iProgram[cIndex] = a < b ? 1 : 0;
        i += 4;
        break;
      /* Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0. */
      case 8:
        iProgram[cIndex] = a == b ? 1 : 0;
        i += 4;
        break;
      /* Opcode 9 adjusts the relative base by the value of its only parameter. The relative base increases (or decreases, if the value is negative) by the value of the parameter. */
      case 9:
        relativeBase += a;
        i += 2;
        break;
      /* Opcode 99 halts the program. No parameters. */
      case 99:
        //console.log(output);
        return output;// || output == 0 ? output : iProgram;
      default:
        throw new Error(`You've fucked up. No code defined for code ${opcode}.`);
    }
  }
}

let prolong = (arr, numOfElements) => {
  return arr.concat(Array(numOfElements + 1).fill(0));
}