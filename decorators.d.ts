declare function triggerOnEvent(channel: string, route: string, getOldMessage?: boolean): any;
declare function shoutOnSet(channel: string, route: string): any;
declare function shoutOnGet(channel: string, route: string): any;

export {triggerOnEvent, shoutOnSet, shoutOnGet};
export default {triggerOnEvent, shoutOnSet, shoutOnGet};
