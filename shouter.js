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
import 'promise-polyfill';

var shouter = {};

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
 * Binds a 'callback' to an event.
 * @param  {String}   channel       Name of the channel
 * @param  {String}   route         Name of the route, optional
 * @param  {function} callback      Callback function
 * @param  {Object}   context       Context of the function 'callback'
 * @param  {Boolian}  getOldMessage Determines if old triggers should be taken under account
 * @return {undefined}
 */
shouter.on = function(channel, route, callback, context, getOldMessage) {

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
        oldMessage[channel].forEach(function(val) {
            if (route === val.route || route === '*') {
                callback.apply(context, val.args);
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
shouter.off = function(channel, route, callback) {
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
shouter.trigger = function(channel, route) {
    var args = Array.prototype.slice.call(arguments);
    args.splice(0, 2);
    let results = [];

    if (channel in eventList) {
        var events = eventList[channel];
        Object.keys(events)
            .forEach(function (routName) {
                if (route === routName || route === '*' || routName === '*') {
                    events[routName].forEach(function(event) {
                        results.push(
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    let result;
                                    try {
                                        result = event.callback.apply(event.context, args);
                                        resolve(result);
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            })
                        );
                    });
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
shouter._deleteAllEvents = function() {
    eventList = {};
    oldMessage = {};
};

export default shouter;
export {shouter};
