/// <reference path="./promise.d.ts"/>

interface triggerResult<T> {
    results: Promise<T>
}

interface triggerReturn<T> extends triggerResult<T> {
    save() : triggerResult<T>
}

interface shouter {
    on(channelName: string, routeName: string, callback: (args: any) => any, context?: any, getOldMessage?: boolean): void;
    off(channelName: string, routeName: string, callback: (args: any) => any): void;
    trigger<T>(channelName: string, routeName: string, ...args: Array<any>): triggerReturn<T>;
}

interface Window { shouter: shouter; }

declare module shouter {
    export function on(channelName: string, routeName: string, callback: (args: any) => any, context?: any, getOldMessage?: boolean): void;
    export function off(channelName: string, routeName: string, callback?: (args: any) => any): void;
    export function trigger<T>(channelName: string, routeName: string, ...args: Array<any>): triggerReturn<T>;
    export function triggerOnEvent(channelName: string, routeName: string);
    export function shoutOnSet(channelName: string, routeName: string);
    export function shoutOnGet(channelName: string, routeName: string);
    export var shouter: shouter;
}

declare module 'shouter' {
    export = shouter;
}
