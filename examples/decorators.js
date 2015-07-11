'use strict';

import {shouter} from '../shouter';
import {triggerOnEvent, shoutOnSet, shoutOnGet} from '../decorators';

class Person {

    @shoutOnSet('name', 'changing')
    set name(name) {
        return (this._name = name);
    }

    @shoutOnGet('name', 'asking')
    get name() {
        return this._name;
    }

    @triggerOnEvent('speek', 'greetings')
    sayHi(name) {
        console.log(`Hello ${name}`);
    }

}

shouter.on('name', 'changing', (newName) => console.log(`My new name is ${newName}`));
shouter.on('name', 'asking', (name) => console.log(`Someone is asking for my name and I told them: ${name}`));

let oskar = new Person();
oskar.name = 'Oskar';
console.log(oskar.name);

shouter.trigger('speek', 'greetings', 'Jon Snow');
