"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const offsetDateRegex = /(\d+).(\d+).(\d+),?\s+(\d+).(\d+)(.(\d+))?/;
const offsetFormatOptions = { timeZone: "UTC", hour12: false, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" };
const offsetUsFormatter = new Intl.DateTimeFormat("en-US", offsetFormatOptions);
class DateTimezone {
    static timezoneOffset(timezone, date) {
        if (!date) {
            date = new Date();
        }
        function parseDate(dateString) {
            dateString = dateString.replace(/[\u200E\u200F]/g, "");
            return [].slice.call(offsetDateRegex.exec(dateString), 1).map(Math.floor);
        }
        function diffMinutes(d1, d2) {
            let day = d1[1] - d2[1];
            let hour = d1[3] - d2[3];
            let min = d1[4] - d2[4];
            if (day > 15)
                day = -1;
            if (day < -15)
                day = 1;
            return 60 * (24 * day + hour) + min;
        }
        const formatter = new Intl.DateTimeFormat("en-US", Object.assign({}, offsetFormatOptions, { timeZone: timezone }));
        return diffMinutes(parseDate(offsetUsFormatter.format(date)), parseDate(formatter.format(date)));
    }
    constructor(dateOrEpoch, timezone) {
        this.$constructor(dateOrEpoch, timezone);
    }
    $constructor(dateOrEpoch, timezone) {
        this["timezone"] = timezone;
        if (typeof dateOrEpoch === "number") {
            this["date"] = new Date(dateOrEpoch);
        }
        else if (dateOrEpoch instanceof Date) {
            this["date"] = new Date(dateOrEpoch.getTime());
        }
    }
    toJSON() {
        return { date: this.date.getTime(), timezone: this.timezone };
    }
    fromJSON(json) {
        if (typeof json === "object" && json["timezone"] && json["date"]) {
            this.$constructor(json["date"], json["timezone"]);
        }
        else if (typeof json === "number") {
            this.$constructor(json);
        }
    }
}
exports.DateTimezone = DateTimezone;
//# sourceMappingURL=date-timezone.js.map