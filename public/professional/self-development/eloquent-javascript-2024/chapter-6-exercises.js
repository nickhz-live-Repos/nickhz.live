
/*
    Exercise 6.1 - A Vector Type

    Classy!
*/
{
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
};

/*
    Exercise 6.2 - Groups

    The theory underneath it is a lot to take in, but actually writing it just 
    feels so deceptively simple...
*/
{
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
};

/* 
    Exercise 6.3 - Iterable Groups

    I expected this part to be more of a challenge, since I've never done 
    something quite like this in JavaScript. Albeit, I did double back a few 
    times in the chapter to make sure I understood it. The reading took hours, 
    and the writing took minutes. Is that what it means to learn it well?
*/

{
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
    }
};
