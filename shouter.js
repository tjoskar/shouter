'use strict';

// Shouter
// ---------------
// Bind a callback function to an event.
//
//        var help = function() { alert('HELP!'); };
//        shouter.on('avalanche', '*', help);
//        shouter.trigger('avalanche', '*');
//        shouter.off('avalanche', fun);
//

/**
 * Decorator
 * @param  {string} channel
 * @param  {string} route
 * @param  {boolian} getOldMessage
 * @return {function}
 */
var shouter = function shouter(channel, route, getOldMessage) {
    if (!channel || !route) {
        throw new Error('You must specify both channel and route');
    }

    return function(target, name, descriptor) {
        var orginalFunction = descriptor.value;
        let fun = orginalFunction.bind(target);

        descriptor.value = function() {
            if (this !== target) {
                fun = orginalFunction.bind(this);
                target = this;
            }
            fun(...arguments);
            shouter.on(channel, route, orginalFunction, target, getOldMessage);
        };
    };
};

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

    if (channel in eventList) {
        var events = eventList[channel];
        Object.keys(events)
            .forEach(function (routName) {
                if (route === routName || route === '*' || routName === '*') {
                    events[routName].forEach(function(event) {
                        event.callback.apply(event.context, args);
                    });
                }
            });
    }

    return {
        save: function() {
            if (!(channel in oldMessage)) {
                oldMessage[channel] = [];
            }
            oldMessage[channel].push({
                route: route,
                args: args
            });
        }
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
