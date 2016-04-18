declare function on(eventName: string, routeName: string, callback: (args: any) => any, context?: any, getOldMessage?: boolean): void;
declare function off(eventName: string, routeName: string, callback?: (args: any) => any): void;
declare function off(eventName: string, callback?: (args: any) => any): void;
declare function trigger(channel: any, route: any, ...args: any[]): {
    save: () => ({
        results: Promise<any>;
    });
    results: Promise<any>;
};

interface shouter {
    on(eventName: string, routeName: string, callback: (args: any) => any, context?: any, getOldMessage?: boolean): void;
    on(eventName: string, callback: (args: any) => any, context?: any, getOldMessage?: boolean): void;
    off(eventName: string, routeName: string, callback?: (args: any) => any): void;
    off(eventName: string, callback?: (args: any) => any): void;
    trigger(channel: any, route: any, ...args: any[]): {
        save: () => ({
            results: Promise<any>;
        });
        results: Promise<any>;
    };
    trigger<T>(channel: any, route: any, ...args: any[]): {
        save: () => ({
            results: Promise<T>;
        });
        results: Promise<T>;
    };
    _deleteAllEvents(): void;
}

declare const shouter: shouter;
export { shouter, on, off, trigger };
export default shouter;
