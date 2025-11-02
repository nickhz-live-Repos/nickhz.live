
/*
    Exercise 6.1 - A Vector Type

    Classy!
*/
{
    const input1 = document.getElementById('exercise-6-1-input-1');
    const input2 = document.getElementById('exercise-6-1-input-2');
    const input3 = document.getElementById('exercise-6-1-input-3');
    const input4 = document.getElementById('exercise-6-1-input-4');
    const output1 = document.getElementById('exercise-6-1-1');
    const output2 = document.getElementById('exercise-6-1-2');
    const output3 = document.getElementById('exercise-6-1-3');
    const output4 = document.getElementById('exercise-6-1-4');

    const Vec = class {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        plus(vector) {
            return new Vec(this.x + vector.x, this.y + vector.y);
        }

        minus(vector) {
            return new Vec(this.x - vector.x, this.y - vector.y);
        }

        get length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    };

    const doExercise = () => {
        const vector1 = new Vec(+input1.value, +input2.value);
        const vector2 = new Vec(+input3.value, +input4.value);
        
        const vecSum = vector1.plus(vector2);
        const vecDiff = vector1.minus(vector2);

        output1.innerText = `[${vecSum.x}, ${vecSum.y}]`;
        output2.innerText = `[${vecDiff.x}, ${vecDiff.y}]`;

        output3.innerText = vector1.length;
        output4.innerText = vector2.length;
    }

    input1.addEventListener('change', doExercise);
    input2.addEventListener('change', doExercise);
    input3.addEventListener('change', doExercise);
    input4.addEventListener('change', doExercise);
    input1.addEventListener('keyup', doExercise);
    input2.addEventListener('keyup', doExercise);
    input3.addEventListener('keyup', doExercise);
    input4.addEventListener('keyup', doExercise);

    doExercise();
};

/*
    Exercise 6.2 - Groups

    The theory underneath it is a lot to take in, but actually writing it just 
    feels so deceptively simple...
*/
{
    const input1 = document.getElementById('exercise-6-2-input-1');
    const input2 = document.getElementById('exercise-6-2-input-2');
    const input3 = document.getElementById('exercise-6-2-input-3');
    const input4 = document.getElementById('exercise-6-2-input-4');
    const input5 = document.getElementById('exercise-6-2-input-5');
    const input6 = document.getElementById('exercise-6-2-input-6');
    const output1 = document.getElementById('exercise-6-2');

    const Group = class {
        #group;

        constructor() {
            this.#group = [];
        }

        add(item) {
            if(!this.has(item)) {
                this.#group.push(item);
            }
        }

        delete(item) {
            const itemIndex = this.#group.indexOf(item);

            if(itemIndex !== -1) {
                this.#group.splice(itemIndex, 1);
            }
        }

        has(item) {
            return this.#group.includes(item);
        }

        static from(iterable) {
            const result = new Group();

            for(const item of iterable) {
                result.add(item);
            }

            return result;
        }
    };

    let group = null;
    const createGroup = () => {
        let arr = null;
        
        try {
            arr = JSON.parse(input1.value);
        } catch(e) {
            return;
        }

        if(arr instanceof Array) {
            group = Group.from(arr);
        }
    };
    input1.addEventListener('change', createGroup);
    input1.addEventListener('keyup', createGroup);
    createGroup();

    
    const doHas = () => {
        output1.innerText = (group?.has(input6.value) ? 'Yes' : 'No');
    };
    input1.addEventListener('change', doHas);
    input1.addEventListener('keyup', doHas);
    input6.addEventListener('change', doHas);
    input6.addEventListener('keyup', doHas);
    doHas();


    const doAdd = () => {
        group?.add(input2.value);
        input2.value = '';
    }
    input3.addEventListener('click', doAdd);
    input3.addEventListener('click', doHas);


    const doDelete = () => {
        group?.delete(input4.value);
        input4.value = '';
    }
    input5.addEventListener('click', doDelete);
    input5.addEventListener('click', doHas);
};

/* 
    Exercise 6.3 - Iterable Groups

    I expected this part to be more of a challenge, since I've never done 
    something quite like this in JavaScript. Albeit, I did double back a few 
    times in the chapter to make sure I understood it. The reading took hours, 
    and the writing took minutes. Is that what it means to learn it well?
*/

{
    const input1 = document.getElementById('exercise-6-3-input-1');
    const input2 = document.getElementById('exercise-6-3-input-2');
    const input3 = document.getElementById('exercise-6-3-input-3');
    const input4 = document.getElementById('exercise-6-3-input-4');
    const input5 = document.getElementById('exercise-6-3-input-5');
    const input6 = document.getElementById('exercise-6-3-input-6');
    const output1 = document.getElementById('exercise-6-3-1');
    const output2 = document.getElementById('exercise-6-3-2');

    const Group = class {
        #group;

        constructor() {
            this.#group = [];
        }

        add(item) {
            if(!this.has(item)) {
                this.#group.push(item);
            }
        }

        delete(item) {
            const itemIndex = this.#group.indexOf(item);

            if(itemIndex !== -1) {
                this.#group.splice(itemIndex, 1);
            }
        }

        has(item) {
            return this.#group.includes(item);
        }

        [Symbol.iterator]() {
            return new GroupIterator(this.#group);
        }

        static from(iterable) {
            const result = new Group();

            for(const item of iterable) {
                result.add(item);
            }

            return result;
        }
    };

    const GroupIterator = class {
        #group;
        #index;

        constructor(groupArray) {
            this.#group = groupArray;
            this.#index = 0;
        }

        next() {
            return {
                value: this.#group[this.#index],
                done: this.#group.length < ++this.#index
            };
        }
    };

    let group = null;
    const createGroup = () => {
        let arr = null;
        
        try {
            arr = JSON.parse(input1.value);
        } catch(e) {
            return;
        }

        if(arr instanceof Array) {
            group = Group.from(arr);
        }
    };
    input1.addEventListener('change', createGroup);
    input1.addEventListener('keyup', createGroup);
    createGroup();

    
    const doHas = () => {
        output1.innerText = (group?.has(input6.value) ? 'Yes' : 'No');
    };
    input1.addEventListener('change', doHas);
    input1.addEventListener('keyup', doHas);
    input6.addEventListener('change', doHas);
    input6.addEventListener('keyup', doHas);
    doHas();


    const doAdd = () => {
        group?.add(input2.value);
        input2.value = '';
    }
    input3.addEventListener('click', doAdd);
    input3.addEventListener('click', doHas);


    const doDelete = () => {
        group?.delete(input4.value);
        input4.value = '';
    }
    input5.addEventListener('click', doDelete);
    input5.addEventListener('click', doHas);

    // the new part
    const doIterate = () => {
        output2.innerHTML = '';

        for(const groupItem of group) {
            output2.appendChild(document.createTextNode(groupItem));
            output2.appendChild(document.createElement('br'));
        }
    }
    input1.addEventListener('change', doIterate);
    input1.addEventListener('keyup', doIterate);
    input3.addEventListener('click', doIterate);
    input5.addEventListener('click', doIterate);
    doIterate();
};
