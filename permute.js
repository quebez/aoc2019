let variation = (nums) => {
    let result = [];

    let recursion = (inProgress) => {
        for (let i = 0; i < nums.length; i++) {
            inProgress.push(nums[i]);
            if (inProgress.length >= nums.length) result.push(inProgress.slice());
            else recursion(inProgress);
            inProgress.pop();
        }
    }

    recursion([]);
    return result;
}

console.log(variation([0, 1, 2, 3, 4]).length);

let permute = (nums) => {
    let result = [];

    let recursion = (inProgress) => {
        for (let i = 0; i < nums.length; i++) {
            //console.log(i, inProgress);
            if (inProgress.find(v => v === nums[i]) === undefined) {
                inProgress.push(nums[i]);
                if (inProgress.length >= nums.length) result.push(inProgress.slice());
                else recursion(inProgress);
                inProgress.pop();
            }
        }
    }
    
    recursion([]);
    return result;
}

console.log(permute([0, 1, 2, 3, 4]).length);