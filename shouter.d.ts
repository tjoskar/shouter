interface shouter {
	on(eventName: string, callback: (args: any) => any, context?: any, getOldMessage?: boolean): void;
	off(eventName: string, callback?: (args: any) => any): void;
}

declare var shouter: shouter;
interface Window { shouter: shouter; }
