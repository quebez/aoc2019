let fs = require('fs');
let file = './6.txt';

const calculateOrbits = (planet, map, jumps = 0) =>
  map[planet] !== undefined ? calculateOrbits(map[planet], map, ++jumps) : jumps;

const part1 = input => {
  const estellarMap = {};

  input.forEach(value => {
    const [center, inOrbit] = value.split(')');
    if (!estellarMap[inOrbit]) estellarMap[inOrbit] = [center];
  });

  return Object.keys(estellarMap).reduce(
    (accumulator, currentValue) => accumulator + calculateOrbits(currentValue, estellarMap),
    0
  );
};

const navigator = (planet, map, origin = 'YOU', jumps = 0) => {
  for (let index = 0; index < map[planet].length; index++) {
    const orbitObject = map[planet][index];
    let currentJumps = jumps;
    if (orbitObject === 'SAN') {
      //console.log(`Found Santa on ${planet} at ${jumps} jumps`);
      return jumps;
    }
    if (orbitObject !== origin) {
      //console.log(`Going from ${planet} to ${orbitObject} with ${jumps} jumps`);
      const isValidRoute = navigator(orbitObject, map, planet, ++currentJumps);
      if (isValidRoute !== -1) return isValidRoute;
    }
  }

  //console.log(`Dead end on planet ${planet}`);
  return -1;
};

const part2 = () => {
  let input = fs.readFileSync(file, 'utf8').split('\r\n');
  const estellarMap = {};

  input.forEach(value => {
    const [center, inOrbit] = value.split(')');
    if (estellarMap[center] === undefined) {
      estellarMap[center] = [inOrbit];
      if (estellarMap[inOrbit] === undefined) {
        estellarMap[inOrbit] = [center];
      } else {
        estellarMap[inOrbit].push(center);
      }
    } else {
      estellarMap[center].push(inOrbit);
      if (estellarMap[inOrbit] === undefined) {
        estellarMap[inOrbit] = [center];
      } else {
        estellarMap[inOrbit].push(center);
      }
    }
  });

  return navigator(estellarMap['YOU'], estellarMap);
};

console.log(part2());

// Estellar map template part 1
// const estellarMap = {
//   B: ['COM'],
//   C: ['B'],
//   D: ['C'],
//   E: ['D'],
//   F: ['E'],
//   G: ['B'],
//   H: ['G'],
//   I: ['D'],
//   J: ['E'],
//   K: ['J'],
//   L: ['K'],
//   YOU: ['K'],
//   SAN: ['I']
// };

// Estellar map template part 2
// const estellarMap = {
//   COM: ['B'],
//   B: ['COM', 'C', 'G'],
//   C: ['B', 'D'],
//   D: ['C', 'E', 'I'],
//   E: ['D', 'F', 'J'],
//   F: ['E'],
//   G: ['B', 'H'],
//   H: ['G'],
//   I: ['D', 'SAN'],
//   J: ['E', 'K'],
//   K: ['J', 'L', 'YOU'],
//   L: ['K'],
//   YOU: ['K'],
//   SAN: ['I']
// };