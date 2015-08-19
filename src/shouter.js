'use strict';

// Shouter
// ---------------
// Bind a callback function to an event.
//
//        var help = function() { alert('HELP!'); };
//        shouter.on('avalanche', '*', help);
//        shouter.trigger('avalanche', 'danger');
//        shouter.off('avalanche', help);
//

// For some reason some people are still using old browsers and systems
import './lib/promise-polyfill';

/**
 * List of registered events
 * @type {Object}
 */
let eventList = {};

/**
 * Storage of old messages.
 * Used if a listener wants an already emited message
 * @type {Object}
 */
let oldMessage = {};

/**
 * Helper function to make async calls
 * @param {Object}  event
 * @param {Array}   args
 * @return {Promise}
*/
let caller = (event, args)  => {
    return Promise.resolve().then(() => {
        return event.context::event.callback(...args);
    });
};


/**
 * Binds a 'callback' to an event.
 * @param  {String}   channel       Name of the channel
 * @param  {String}   route         Name of the route, optional
 * @param  {function} callback      Callback function
 * @param  {Object}   context       Context of the function 'callback'
 * @param  {Boolian}  getOldMessage Determines if old triggers should be taken under account
 * @return {undefined}
 */
let on = function(channel, route, callback, context, getOldMessage) {

    if (!(channel in eventList)) {
        eventList[channel] = {};
    }

    if (!(route in eventList[channel])) {
        eventList[channel][route] = [];
    }

    eventList[channel][route].push({
        callback: callback,
        context: context
    });

    if (getOldMessage && channel in oldMessage) {
        oldMessage[channel].forEach((val) => {
            if (route === val.route || route === '*') {
                context::callback(...val.args);
            }
        });
    }
};

/**
 * Remove event(s) from the event-list.
 * @param  {String}   channel    Name of the channel
 * @param  {String}   route      Name of the route, optional
 * @param  {Function} callback   Callback function for selecting a specific event
 * @return {undefined}
 */
let off = function(channel, route, callback) {
    if (arguments.length === 2) {
        callback = route;
        route = '*';
    }

    if (channel in eventList && route in eventList[channel]) {
        var evList = eventList[channel][route];
        for (var i = evList.length - 1; i >= 0; i--) {
            if (evList[i].callback === callback) {
                evList.splice(i, 1);
            }
        }
    }
};

/**
 * Trigger one or many events, firing all bound callbacks. All arguments will
 * be passed throw to the callback function.
 * @param  {String} eventName   Name of the event
 * @param  {*args}  arguments   Will be passed throw to the callback function
 * @return {object}
 */
let trigger = function(channel, route, ...args) {
    let results = [];

    if (channel in eventList) {
        var events = eventList[channel];
        Object.keys(events)
            .forEach(routName => {
                if (route === routName || route === '*' || routName === '*') {
                    events[routName].forEach(event => results.push(caller(event, args)));
                }
            });
    }

    var promiseResult = Promise.all(results);

    return {
        save: function() {
            if (!(channel in oldMessage)) {
                oldMessage[channel] = [];
            }
            oldMessage[channel].push({
                route: route,
                args: args
            });

            return {results: promiseResult};
        },
        results: promiseResult
    };
};

/**
 * Remove all events
 * Should only be used under test
 * @return {undefined}
 */
let _deleteAllEvents = function() {
    eventList = {};
    oldMessage = {};
};

let shouter = {on, off, trigger, _deleteAllEvents};

export {shouter, on, off, trigger};
export default shouter;
