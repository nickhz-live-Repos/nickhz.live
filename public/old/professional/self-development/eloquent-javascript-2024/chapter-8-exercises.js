
/*
    Exercise 8.1 - Retry

    It got simple again!
*/
{
    const input1 = document.getElementById('exercise-8-1-input-1');
    const input2 = document.getElementById('exercise-8-1-input-2');
    const output1 = document.getElementById('exercise-8-1');

    class MultiplicatorUnitFailure extends Error {}

    function primitiveMultiply(a, b) {
        if (Math.random() < 0.2) {
            return a * b;
        } else {
            throw new MultiplicatorUnitFailure("Klunk");
        }
    }

    function reliableMultiply(a, b) {
        while(true) {
            try {
                return primitiveMultiply(a, b);
            } catch(e) {
                if(e instanceof MultiplicatorUnitFailure) {
                    console.log(e);
                    continue;
                } else {
                    
                }
            }
        }
    }

    const doExercise = () => {
        output1.innerText = reliableMultiply(+input1.value, +input2.value);
    }

    input1.addEventListener('change', doExercise);
    input1.addEventListener('keyup', doExercise);
    input2.addEventListener('change', doExercise);
    input2.addEventListener('keyup', doExercise);

    doExercise();
};

/*
    Exercise 8.2 - Locked Box

    This is encryption now.
*/
{
    class LockedBoxError extends Error {}

    const box = new class {
        locked = true;
        #content = [];

        unlock() { this.locked = false; }
        lock() { this.locked = true;  }
        get content() {
            if (this.locked) throw new LockedBoxError("Locked!");
            return this.#content;
        }
    };

    function withBoxUnlocked(body) {
        try {
            box.unlock();

            body();
        } catch(e) {
            if(e instanceof LockedBoxError) {
                console.log(e);
            }

            throw e;
        } finally {
            box.lock();
        }
    }

    // withBoxUnlocked(() => {
    //     box.content.push("gold piece");
    // });

    // try {
    //     withBoxUnlocked(() => {
    //         throw new Error("Pirates on the horizon! Abort!");
    //     });
    // } catch (e) {
    //     console.log("Error raised: " + e);
    // }

    // console.log(box.locked);
    // // → true

    // box.unlock();
    // console.log(box.content);
};
