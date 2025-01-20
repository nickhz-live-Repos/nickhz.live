
/*
    Exercise 4.1 - The Sum of a Range

    3 inputs, 2 outputs. The conplexity builds...
*/
{
    const input1 = document.getElementById('exercise-4-1-input-1');
    const input2 = document.getElementById('exercise-4-1-input-2');
    const input3 = document.getElementById('exercise-4-1-input-3');
    const output1 = document.getElementById('exercise-4-1-1');
    const output2 = document.getElementById('exercise-4-1-2');

    const range = (start, end, step = 1) => {
        // failsafe for cases of 0
        step = step || 1;

        // for impossible ranges, like going from 1 to 5 with -1 per step
        if(step > 0 && start > end || step < 0 && start < end) {
            return [];
        }

        const evaluate = step > 0 
            ?
                num => num <= end
            :
                num => num >= end
        ;

        const result = new Array();
        for(let i = start; evaluate(i); i += step) {
            result.push(i);
        }

        return result;
    };

    const sum = (...nums) => {
        let result = 0;

        for(const num of nums) {
            result += num;
        }

        return result;
    };

    const doExercise = () => {
        const rangeOutput = range(+input1.value, +input2.value, +input3.value);

        output1.innerText = JSON.stringify(rangeOutput);
        output2.innerText = sum(...rangeOutput);
    };

    input1.addEventListener('change', doExercise);
    input2.addEventListener('change', doExercise);
    input3.addEventListener('change', doExercise);
    input1.addEventListener('keyup', doExercise);
    input2.addEventListener('keyup', doExercise);
    input3.addEventListener('keyup', doExercise);

    doExercise();
};

/*
    Exercise 4.2 - Reversing an Array

    In programming communities, you hear horror stories about 
    nightmare hires, people who showed up to coding interviews 
    being unprepared for exercises like FizzBuzz or binary search, 
    and reversing an array was one of those problems that shows up 
    in these stories a lot. So doing this here feels like I'm 
    passing along an injoke, too.
*/
{
    const input1 = document.getElementById('exercise-4-2-input');
    const output1 = document.getElementById('exercise-4-2-1');
    const output2 = document.getElementById('exercise-4-2-2');
    const output3 = document.getElementById('exercise-4-2-3');

    const reverseArray = (arr) => {
        const result = new Array();

        for(const element of arr) {
            result.unshift(element);
        }

        return result;
    };

    const reverseArrayInPlace = (arr) => {
        const midpoint = parseInt(arr.length / 2);


        for(let i = 0, j = arr.length - 1; i < midpoint; i++, j--) {
            // hotswap!
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    };

    const doExercise = () => {
        let arr = null;
        
        try {
            arr = JSON.parse(input1.value);
        } catch(e) {
            return;
        }

        if(arr instanceof Array) {
            output1.innerText = JSON.stringify(reverseArray(arr));

            output2.innerText = JSON.stringify(arr);

            // arr reversal as a side effect
            reverseArrayInPlace(arr);
            output3.innerText = JSON.stringify(arr);
        }
    };

    input1.addEventListener('keyup', doExercise);

    doExercise();
};

/*
    Exercise 4.3 - A List

    For lack of formal training, I didn't know lists worked like 
    this by default. I thought they were wrappers for underlying 
    arrays, just with useful functionality attached.
*/
{
    const input1 = document.getElementById('exercise-4-3-input-1');
    const input2 = document.getElementById('exercise-4-3-input-2');
    const output1 = document.getElementById('exercise-4-3-1');
    const output2 = document.getElementById('exercise-4-3-2');
    const output3 = document.getElementById('exercise-4-3-3');

    // list prepend
    const prepend = (element, list) => {
        list = {
            value: element,
            rest: list
        };

        return list;
    };

    //
    const arrayToList = (arr) => {
        let list = null;
        
        for(let i = arr.length - 1; i >= 0; i--) {
            list = prepend(arr[i], list);
        }

        return list;
    };

    //
    const listToArray = (list) => {
        const arr = new Array();

        while(list !== null) {
            arr.push(list.value);
            list = list.rest;
        }

        return arr;
    };

    // recursive nth
    const nth = (list, num) => {
        if(!list || num < 0) {
            return undefined;
        } else if(num === 0) {
            return list.value;
        } else {
            return nth(list.rest, num - 1);
        }
    };

    const doExercise = () => {
        let arr = null;
        
        try {
            arr = JSON.parse(input1.value);
        } catch(e) {
            return;
        }

        if(arr instanceof Array) {
            const list = arrayToList(arr);

            output1.innerText = JSON.stringify(list);
            output2.innerText = JSON.stringify(listToArray(list));
            output3.innerText = JSON.stringify(nth(list, +input2.value));
        }
    };

    input1.addEventListener('keyup', doExercise);
    input2.addEventListener('change', doExercise);
    input2.addEventListener('keyup', doExercise);

    doExercise();
};

/*
    Exercise 4.4 - Deep Comparison

    I was thinking it was gonna be a problem to have inputs & 
    outputs as objects if I want to display them on the page, but 
    the JSON methods solve that problem outright!
*/
{
    const input1 = document.getElementById('exercise-4-4-input-1');
    const input2 = document.getElementById('exercise-4-4-input-2');
    const output1 = document.getElementById('exercise-4-4');

    const deepEqual = (obj1, obj2) => {
        if(obj1 === obj2) {
            return true;
        } else if(
            typeof obj1 !== 'object' || typeof obj2 !== 'object'
            || obj1 === null || obj2 === null
        ) {
            return false;
        }

        for(const key in obj1) {
            if(!(key in obj2)) {
                return false;
            }

            const [val1, val2] = [obj1[key], obj2[key]];

            if(deepEqual(val1, val2)) {
                continue;
            }
            return false;
        }

        // checking if all obj2 keys are in obj1
        for(const key in obj2) {
            if(!(key in obj1)) {
                return false;
            }
        }

        return true;
    };

    const doExercise = () => {
        let obj1 = null, obj2 = null;
        
        try {
            obj1 = JSON.parse(input1.value);
            obj2 = JSON.parse(input2.value);
        } catch(e) {
            return;
        }

        if(obj1 === null) {
            output1.innerText = obj2 === null;
        }

        if(typeof obj1 === 'object' && typeof obj2 === 'object') {
            output1.innerText = JSON.stringify(deepEqual(obj1, obj2));
        }
    };

    input1.addEventListener('keyup', doExercise);
    input2.addEventListener('keyup', doExercise);

    doExercise();
};
