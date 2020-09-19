export declare class TimeZoneDate extends Date {
    static timezoneOffset(timezone: string, date?: Date): number;
    static fromJSON(json: any): TimeZoneDate;
    constructor(epoch: number, timeZone?: string);
    constructor(date: Date, timeZone?: string);
    constructor(isoDateString: string, timeZone?: string);
    readonly timeZone: string;
    toJSON(): any;
}
