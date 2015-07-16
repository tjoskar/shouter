'use strict';

import {shouter} from '../src/shouter';

let checkChannelAndRouteName = (channel, route) => {
    if (!channel || !route) {
        throw new Error('You must specify both channel and route');
    }
};

var triggerOnEvent = (channel, route, getOldMessage = false) => {
    checkChannelAndRouteName(channel, route);

    return function(target, name, descriptor) {
        var {value: fun} = descriptor;
        shouter.on(channel, route, fun, target, getOldMessage);
    };
};

var shoutOnSet = (channel, route) => {
    checkChannelAndRouteName(channel, route);
    return (target, name, descriptor) => {
        var {set: orgFun} = descriptor;
        descriptor.set = function(...args) {
            shouter.trigger(channel, route, ...args);
            return this::orgFun(...args);
        };
    };
};

var shoutOnGet = (channel, route) => {
    checkChannelAndRouteName(channel, route);
    return (target, name, descriptor) => {
        var {get: orgFun} = descriptor;
        descriptor.get = function(...args) {
            var value = this::orgFun(...args);
            shouter.trigger(channel, route, value);
            return value;
        };
    };
};

export {triggerOnEvent, shoutOnSet, shoutOnGet};
export default {triggerOnEvent, shoutOnSet, shoutOnGet};
