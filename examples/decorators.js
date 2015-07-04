'use strict';

import {shouter} from '../shouter';

class MyClass {

    phrase;

    constructor(phrase) {
        this.phrase = phrase;
    }

    @shouter('speek', 'greetings')
    sayHi(name) {
        console.log(`${this.phrase} ${name}`);
    }

}

let myClass = new MyClass('Hello');

myClass.sayHi('Tyrion Lannister');

shouter.trigger('speek', 'greetings', 'Jon Snow');
