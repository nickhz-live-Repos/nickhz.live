
// the "oops, i wasn't supposed to use functions last chapter" chapter 

/*
    Exercise 3.1 - Minimum

    The shortest one yet, in spite of the added inputs. SonarQube 
    for Java says that ternaries are too complicated to use 
    regularly, but look how simple a ternary made this!
*/
{
    const input1 = document.getElementById('exercise-3-1-input-1');
    const input2 = document.getElementById('exercise-3-1-input-2');
    const output = document.getElementById('exercise-3-1');

    const min = (a, b) => {
        return a < b ? a : b;
    };

    const doCompare = () => {
        output.innerText = min(+input1.value, +input2.value);
    };

    input1.addEventListener('change', doCompare);
    input2.addEventListener('change', doCompare);
    input1.addEventListener('keyup', doCompare);
    input2.addEventListener('keyup', doCompare);
};

/*
    Exercise 3.2 - Recursion

    I figured out recursion on my own during a Project Euler 
    problem many moons ago. 
*/
{
    const input = document.getElementById('exercise-3-2-input');
    const output = document.getElementById('exercise-3-2');

    const checkParity = (num) => {
        if(num < 0) {
            num = -num;
        }
        
        switch(num) {
            case 0:
                return 'Even';
            case 1:
                return 'Odd';
            default:
                return checkParity(num - 2);
        }
    };

    const doCheck = () => {
        output.innerText = checkParity(+input.value);
    };

    input.addEventListener('change', doCheck);
    input.addEventListener('keyup', doCheck);
};

/*
    Exercise 3.3 - Bean Counting

    2 inputs, 2 outputs! I wonder how many channels any one 
    exercise will have to interface through? 
*/
{
    const input1 = document.getElementById('exercise-3-3-input-1');
    const input2 = document.getElementById('exercise-3-3-input-2');
    const output1 = document.getElementById('exercise-3-3-1');
    const output2 = document.getElementById('exercise-3-3-2');

    const countChar = (text, char) => {
        let count = 0;
        
        for(let i = 0; i < text.length; i++) {
            if(text[i] == char) {
                count++;
            }
        }

        return count;
    };

    const countBs = (text) => {
        return countChar(text, 'B');
    }

    const doCount = () => {
        output1.innerText = countBs(input1.value);
        output2.innerText = countChar(input1.value, input2.value);
    };

    input1.addEventListener('keyup', doCount);
    input2.addEventListener('keyup', doCount);
};
