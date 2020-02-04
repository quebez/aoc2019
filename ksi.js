// holes and scores
let input = [[2, -3, 1], [100, 4, 2], [10, 2, 4], [9, 3, 3]];
// gets 2 objects with x and y coordinates and returns distance between them
let getDistance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

// input: which player is on turn, their score, current positon on course, max playable distance and all unused holes
// returns: max optimal score
let recourse = (player, score, curPos, maxDistance, arr) => {
  // define which player plays next and empty array for possible scores
  let nextPlayer = player == 'a' ? 'b' : 'a';
  let res = [];

  // loop trough unused holes
  for (let i = 0; i < arr.length; i++) {
    // get holes x and y positions and distance to it
    let hole = { x: arr[i][1], y: arr[i][2] };
    let distance = getDistance(curPos, hole);

    if (distance < maxDistance) {
      let points = arr[i][0];
      // increase and decrease points by value of the hole
      let newScore = { [player]: score[player] + points, [nextPlayer]: score[nextPlayer] - points };
      // create new array without used hole
      let newArr = arr.slice();
      newArr.splice(i, 1);
      // go deeper in tree
      res.push(recourse(nextPlayer, newScore, hole, distance, newArr));
    }
  }

  // return existing score if there was no luck in rest of the tree
  if (res.length <= 0) return score;
  // return only value if there is
  else if (res.length == 1) return res[0];
  // return best possible outcome for current player
  else return res.reduce((prev, curr) => prev[player] > curr[player] ? prev : curr);
}

// logs final answer
console.log(recourse('a', { a: 0, b: 0 }, { x: 0, y: 0 }, Infinity, input));