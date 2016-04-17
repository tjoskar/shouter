import { shouter } from './index';

const checkChannelAndRouteName = (channel, route) => {
    if (!channel || !route) {
        throw new Error('You must specify both channel and route');
    }
};

const triggerOnEvent = (channel, route, getOldMessage = false) => {
    checkChannelAndRouteName(channel, route);

    return function(target, name, descriptor) {
        const {value: fun} = descriptor;
        shouter.on(channel, route, fun, target, getOldMessage);
    };
};

const shoutOnSet = (channel, route) => {
    checkChannelAndRouteName(channel, route);
    return (target, name, descriptor) => {
        const {set: orgFun} = descriptor;
        descriptor.set = function(...args) {
            shouter.trigger(channel, route, ...args);
            return this::orgFun(...args);
        };
    };
};

const shoutOnGet = (channel, route) => {
    checkChannelAndRouteName(channel, route);
    return (target, name, descriptor) => {
        const {get: orgFun} = descriptor;
        descriptor.get = function(...args) {
            const value = this::orgFun(...args);
            shouter.trigger(channel, route, value);
            return value;
        };
    };
};

export { triggerOnEvent, shoutOnSet, shoutOnGet };
export default { triggerOnEvent, shoutOnSet, shoutOnGet };
