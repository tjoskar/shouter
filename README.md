## Shouter

[![Build Status](https://travis-ci.org/tjoskar/shouter.svg)](https://travis-ci.org/tjoskar/shouter)

Simple, yet powerful micro framework for event broadcasts.

```javascript
import {shouter} from 'shouter';

let help = () => alert('HELP!');
shouter.on('avalanche', '*', help);
shouter.trigger('avalanche', 'danger');
shouter.off('avalanche', help);
```

### Listening to channels and routes
---
When subscribing to an event you must specify a channel, route and a callback:
```javascript
shouter.on('channel', 'route', callback);
```

The route can however be a asterisk, `*`, to subscribe on all routes on the specific channel:
```javascript
shouter.on('channel', '*', callback);
shouter.trigger('channel', 'route'); // this will trigger "callback".
```

You can also choose to trigger all routes:
```javascript
shouter.on('channel', 'route', callback);
shouter.trigger('channel', '*'); // this will trigger "callback".
```

You can also bind a context to the callback:
```javascript
let context = {called: 0};
let fun = function() {
    this.called++;
}
shouter.on('channel', 'route', callback, context);
// Same as: shouter.on('channel', 'route', callback.bind(context));
```

You can also pass a number of arguments:
```javascript
let fun = (a, b, c) => a+b+c;
shouter.on('channel', 'route', callback);
shouter.trigger('channel', 'route', 1, 2, 3);
```

Or something as this:
```javascript
shouter.on('math', 'min', Math.min);
shouter.trigger('math', 'min', 1, 2, 3);
```

### Async
---
All events will be trigged as async events:
```javascript
let callback = () => console.log('callback');
shouter.on('channel', 'route', callback);
shouter.trigger('channel', 'route');
console.log('last one');

// This will output:
// last one
// callback
```

`trigger` will however return a promise object with the result of all trigged events:
```javascript
let callback = () => console.log('callback');
shouter.on('channel', 'route', callback);
shouter
    .trigger('channel', 'route')
    .results
    .then(() => console.log('last one'));

// This will output:
// callback
// last one
```

`results` will contain the result of all trigged events:
```javascript
let pi = () => 3.142;
let e = () => 2.718;
shouter.on('calc', 'pi', pi);
shouter.on('calc', 'e', e);
shouter
    .trigger('channel', '*')
    .results
    .then(calc => {
        calc.forEach(result => console.log(result));
    });

// This will output (or in reverse order):
// 3.142
// 2.718
```

`results` is wrapped in `Promise.all`:
```javascript
let pi = () => throw new Error('I forgot pi');
let e = () => 2.718;
shouter.on('calc', 'pi', pi);
shouter.on('calc', 'e', e);
shouter
    .trigger('channel', '*')
    .results
    .then(calc => {
        calc.forEach(result => console.log(result));
    })
    .catch(error => {
        console.log(error);
    });

// This will output:
// I forgot pi
```

You can save an event if you don't know if the subscriber has started yet:
```javascript
shouter
    .trigger('channel', 'route')
    .save(); // Save the event to future subscriber

let callback = () => console.log('callback');
let context = undefined; // default: undefined
let getAlreadySubmittedEvents = true; // default: false
shouter.on('channel', 'route', callback, context, getAlreadySubmittedEvents); // will trigger callback
```

See more examples in `test` or `exampels` folder.
All code are written in ES6/7 (ES2016/ES2017).
To run the `exampels`: `babel-node {file}`, eg: `babel-node examples/ping_pong.js`
To build the source to ES5: `gulp`.
To test: `npm test`
