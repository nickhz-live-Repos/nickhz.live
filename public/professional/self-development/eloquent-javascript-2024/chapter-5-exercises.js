
/*
    Exercise 5.1 - Flattening

    And all of a sudden, the task was simple again...
*/
{
    const input1 = document.getElementById('exercise-5-1-input');
    const output1 = document.getElementById('exercise-5-1');

    // oh, it's one line
    const flatten = (arr) => {
        return arr.reduce((subarray1, subarray2) => subarray1.concat(subarray2));
    };

    // everything except the one line is just to take input from the user and render output to the page...
    const doExercise = () => {
        let arr = null;
        
        try {
            arr = JSON.parse(input1.value);
        } catch(e) {
            return;
        }

        if(arr instanceof Array) {
            output1.innerText = JSON.stringify(flatten(arr));
        }
    };

    input1.addEventListener('change', doExercise);
    input1.addEventListener('keyup', doExercise);

    doExercise();
};

/*
    Exercise 5.2 - Your Own Loop

    USER INPUT AND PAGE OUTPUT WILL NOT BE ENABLED FOR THIS. It's arbitrary 
    code execution; can't be having it run from user input on the live page, 
    not when I plan to make this a dynamic site where the origin environment 
    can matter. Instead, this will run on the textbook site.
*/

{
    const loop = (value, test, update, body) => {
        let i = value;

        while(test(i)) {
            body(i);
            i = update(i);

            // console.log(i);
            // console.log(output1.innerText);
        }

        return i;
    };

    loop(3, n => n > 0, n => n - 1, console.log);
    // → 3
    // → 2
    // → 1
};

/* 
    Exercise 5.3 - Everything

    Anything that allows the user to write on-page-executable functions can't 
    be allowed right now.
*/
{
    const every = (arr, test) => {
        for(const item of arr) {
            if(!test(item)) {
                return false;
            }
        }

        return true;
    }

    console.log(every([1, 3, 5], n => n < 10));
    // → true
    console.log(every([2, 4, 16], n => n < 10));
    // → false
    console.log(every([], n => n < 10));
    // → true
};

/* 
    Exercise 5.4 - Dominant Writing Direction

    Welp, this one requires a resource on the site. I'll just paste the 
    working code here, but it won't work unless it's run on the textbook site. 
*/
{

    // this code runs here: https://eloquentjavascript.net/05_higher_order.html#i-4ccl4J1nOw
    const dominantDirection = (text) => 
        countBy(text, n => characterScript(n.codePointAt(0)))
        .filter(n => n.name != null)
        .reduce((a, b) => a.count > b.count ? a : b)
        .name
        .direction
    ;
};
