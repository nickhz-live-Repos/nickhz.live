
/*
    Exercise 9.2 - Quoting Style

    Because Exercise 9.1 only runs on the page in the textbook site!
*/
{
    const textBox = document.getElementById('exercise-9-2-1');
    const btn = document.getElementById('exercise-9-2-2');

    const regex = /(^|\W)'/g;
    const doExercise = () => {
        textBox.value = textBox.value.replace(regex, "$1\"");
    };

    btn.addEventListener('click', doExercise);
};

/*
    Exercise 9.3 - Numbers Again


*/
{
    const input1 = document.getElementById('exercise-9-3-input');
    const output1 = document.getElementById('exercise-9-3');

    const regex = /^[+-]?(\d+\.?\d*|\d*\.?\d+)(e[+-]?\d+)?$/i;
    const doExercise = () => {
        output1.innerText = regex.test(input1.value) ? 'YES' : 'NO';
    };

    input1.addEventListener('keyup', doExercise);
    input1.addEventListener('change', doExercise);

    doExercise();
};
