
/*
    Exercise 2.1 - Looping a Triangle

    I think this is one of the first things I did in Java, too.
*/
{
    const output = document.getElementById('exercise-2-1');

    const iterations = 7;
    const character = '#';

    let result = '';
    let addend = character;
    let count = 0;
    while(count++ < iterations) {
        result += addend + '\n';
        addend += character;
    }

    output.innerText = result;
};


/*
    Exercise 2.2 - FizzBuzz

    I feel so silly doing FizzBuzz, but I enjoy silly things.
*/
{
    const output = document.getElementById('exercise-2-2');

    const doFizzBuzz = (num) => {
        let value = '';

        if(num % 3 === 0) {
            value += 'Fizz';
        }

        if(num % 5 === 0) {
            value += 'Buzz';
        }

        return value || num;
    };

    let result = '';
    for(let i = 1; i <= 100; i++) {
        result += doFizzBuzz(i) + '\n'
    }

    output.innerText = result;
};

/*
    Exercise 2.3 - Chessboard

    The book hints at nesting loops, but the O(n) runtime was too 
    tempting...
*/
{
    const input = document.getElementById('exercise-2-3-input');
    const output = document.getElementById('exercise-2-3');

    const black = '#', white = '_';
    const makeChessboard = (num) => {
        let result = '';

        num = parseInt(num);
        for(let i = 0, next = white; i < num; i++) {
            result += next;
            next = next === black ? white : black;
        }


        const oddLine = result;
        const evenLine = oddLine.substring(1) + (num % 2 === 0 ? white : black);
        result += '\n';
        for(let i = 1, next = evenLine; i < num; i++) {
            result += next + '\n';
            next = next === evenLine ? oddLine : evenLine;
        }

        return result;
    };

    const setOutput = () => {
        output.innerText = makeChessboard(input.value <= 100 ? input.value : 100);
    };

    input.addEventListener('change', setOutput);
    input.addEventListener('keyup', setOutput);

    setOutput();
};
