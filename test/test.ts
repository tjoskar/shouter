import { on, off, trigger, shouter } from '../';
import { triggerOnEvent } from '../decorators';

class Name {

    @triggerOnEvent('say', 'hello')
    hello(name) {
        console.log(`Hello ${name}`);
    }
}

trigger('say', 'hello', 'Dexter Morgan');

let fun1 = () => 1;
let fun2 = () => 1;

shouter.on('channel', 'event', fun1);
on('channel', 'event', fun2);

shouter
    .trigger<number[]>('channel', 'event')
    .results
    .then(r => r.map(v => v + 1))
    .then(r => console.log(r))
    .catch(error => console.error(error));

off('channel', 'event', fun1);
off('channel', 'event', fun2);
