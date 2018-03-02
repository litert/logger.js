/*
   +----------------------------------------------------------------------+
   | LiteRT Logger.js Library                                             |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/logger.js/blob/master/LICENSE              |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */
import { IDictionary } from "@litert/core";
import * as Abstract from "./Abstracts";
import AbstractLogger from "./AbstractLogger";
import * as Drivers from "./drivers";
import Exception from "./Exception";

type LogWritter = (
    lv: Abstract.Level,
    text: string,
    lvName: string
) => void;

function createStringWriter(
    format: string
): LogWritter {

    let body: string = "if (this._ignored.indexOf(level) !== -1) { return; }\n";

    let matches = format.match(/\$\(([-\w]+)\)/g).map(
        (x: string) => x.substr(2, x.length - 3)
    );

    let vars: IDictionary<string> = {};

    let defineVariable = {
        define(n: string, def: string): void {
            if (vars[n]) {
                return;
            }
            vars[n] = `var ${n} = ${def};`;
        },
        dt(): void { this.define("dt", "new Date()"); },
        tz_offset(): void {
            this.dt();
            this.define("tz_offset", "-dt.getTimezoneOffset()");
        },
        isoDt(): void {
            this.dt();
            this.define("isoDt", "dt.toISOString()");
        },
        lo_y(): void {
            this.dt();
            this.define("lo_y", "dt.getFullYear()");
        },
        lo_mon(): void {
            this.dt();
            this.define(
                "lo_mon",
                "(dt.getMonth() + 1).toString().padStart(2, \"0\")"
            );
        },
        lo_d(): void {
            this.dt();
            this.define(
                "lo_d",
                "dt.getDate().toString().padStart(2, \"0\")"
            );
        },
        lo_h(): void {
            this.dt();
            this.define(
                "lo_h",
                "dt.getHours().toString().padStart(2, \"0\")"
            );
        },
        lo_min(): void {
            this.dt();
            this.define(
                "lo_min",
                "dt.getMinutes().toString().padStart(2, \"0\")"
            );
        },
        lo_sec(): void {
            this.dt();
            this.define(
                "lo_sec",
                "dt.getSeconds().toString().padStart(2, \"0\")"
            );
        },
        lo_ms(): void {
            this.dt();
            this.define(
                "lo_ms",
                "dt.getMilliseconds().toString().padStart(3, \"0\")"
            );
        },
        tz_offset_hour(): void {
            this.tz_offset();
            this.define(
                "tz_offset_hour",
                "(tz_offset >= 0 ? \"+\" : \"\") + " +
                "Math.floor(tz_offset / 60).toString().padStart(2, \"0\")"
            );
        },
        tz_offset_minutes(): void {
            this.tz_offset();
            this.define(
                "tz_offset_minutes",
                "(tz_offset % 60).toString().padStart(2, \"0\")"
            );
        },
        tz_value(): void {
            this.tz_offset_hour();
            this.tz_offset_minutes();
            this.define(
                "tz_value",
                "tz_offset_hour + \":\" + tz_offset_minutes"
            );
        },
        lo_date(): void {
            this.lo_y();
            this.lo_mon();
            this.lo_d();
            this.define(
                "lo_date",
                "lo_y + '-' + lo_mon + '-' + lo_d"
            );
        },
        lo_time(): void {
            this.lo_h();
            this.lo_min();
            this.lo_sec();
            this.lo_ms();
            this.define(
                "lo_time",
                "lo_h + ':' + lo_min + ':' + lo_sec + '.' + lo_ms"
            );
        },
        utc_y(): void {
            this.dt();
            this.define("utc_y", "dt.getUTCFullYear()");
        },
        utc_mon(): void {
            this.dt();
            this.define(
                "utc_mon",
                "(dt.getUTCMonth() + 1).toString().padStart(2, \"0\")"
            );
        },
        utc_d(): void {
            this.dt();
            this.define(
                "utc_d",
                "dt.getUTCDate().toString().padStart(2, \"0\")"
            );
        },
        utc_h(): void {
            this.dt();
            this.define(
                "utc_h",
                "dt.getUTCHours().toString().padStart(2, \"0\")"
            );
        },
        utc_min(): void {
            this.dt();
            this.define(
                "utc_min",
                "dt.getUTCMinutes().toString().padStart(2, \"0\")"
            );
        },
        utc_sec(): void {
            this.dt();
            this.define(
                "utc_sec",
                "dt.getUTCSeconds().toString().padStart(2, \"0\")"
            );
        },
        utc_ms(): void {
            this.dt();
            this.define(
                "utc_ms",
                "dt.getUTCMilliseconds().toString().padStart(3, \"0\")"
            );
        }
    };

    let logsData: string[] = [];

    for (let el of matches) {

        switch (el) {
        case "iso-local-datetime":
            defineVariable.lo_date();
            defineVariable.lo_time();
            defineVariable.tz_value();
            logsData.push(`"${el}": lo_date + "T" + lo_time + tz_value`);
            break;
        case "local-date":
            defineVariable.lo_date();
            logsData.push(`"${el}": lo_date`);
            break;
        case "local-time":
            defineVariable.lo_time();
            logsData.push(`"${el}": lo_time`);
            break;
        case "local-year":
            defineVariable.lo_y();
            logsData.push(`"${el}": lo_y`);
            break;
        case "local-month":
            defineVariable.lo_mon();
            logsData.push(`"${el}": lo_mon`);
            break;
        case "local-day":
            defineVariable.lo_d();
            logsData.push(`"${el}": lo_d`);
            break;
        case "local-hour":
            defineVariable.lo_h();
            logsData.push(`"${el}": lo_h`);
            break;
        case "local-minute":
            defineVariable.lo_min();
            logsData.push(`"${el}": lo_min`);
            break;
        case "local-second":
            defineVariable.lo_sec();
            logsData.push(`"${el}": lo_sec`);
            break;
        case "local-millisecond":
            defineVariable.lo_ms();
            logsData.push(`"${el}": lo_ms`);
            break;
        case "timezone-hours":
            defineVariable.tz_offset_hour();
            logsData.push(`"${el}": tz_offset_hour`);
            break;
        case "timezone-minutes":
            defineVariable.tz_offset_minutes();
            logsData.push(`"${el}": tz_offset_minutes`);
            break;
        case "timezone":
            defineVariable.tz_value();
            logsData.push(`"${el}": tz_value`);
            break;
        case "iso-utc-datetime":
            defineVariable.isoDt();
            logsData.push(`"${el}": isoDt`);
            break;
        case "utc-date":
            defineVariable.isoDt();
            logsData.push(`"${el}": isoDt.split("T")[0]`);
            break;
        case "utc-time":
            defineVariable.isoDt();
            logsData.push(`"${el}": isoDt.split("T")[1].substr(0, 8)`);
            break;
        case "utc-year":
            defineVariable.utc_y();
            logsData.push(`"${el}": utc_y`);
            break;
        case "utc-month":
            defineVariable.utc_mon();
            logsData.push(`"${el}": utc_mon`);
            break;
        case "utc-day":
            defineVariable.utc_d();
            logsData.push(`"${el}": utc_d`);
            break;
        case "utc-hour":
            defineVariable.utc_h();
            logsData.push(`"${el}": utc_h`);
            break;
        case "utc-minute":
            defineVariable.utc_min();
            logsData.push(`"${el}": utc_min`);
            break;
        case "utc-second":
            defineVariable.utc_sec();
            logsData.push(`"${el}": utc_sec`);
            break;
        case "utc-millisecond":
            defineVariable.utc_ms();
            logsData.push(`"${el}": utc_ms`);
            break;
        case "timestamp":
            defineVariable.dt();
            logsData.push(`"${el}": dt.getTime()`);
            break;
        case "timestamp-second":
            defineVariable.dt();
            logsData.push(`"${el}": Math.floor(dt.getTime() / 1000)`);
            break;
        case "level":
            logsData.push(`"${el}": level`);
            break;
        case "level-name":
            logsData.push(`"${el}": lvName`);
            break;
        case "category":
            logsData.push(`"${el}": this._category`);
            break;
        case "text":
            logsData.push(`"${el}": text`);
            break;
        case "trace":
            logsData.push(`"${el}": new Error().stack.split(" at ")[4].trim()`);
            break;
        default:
            logsData.push(`"${el}": ""`);
        }
    }

    for (let key in vars) {

        body += `${vars[key]}\n`;
    }

    body += `var logsData = {${logsData.join(",")}};\n`;

    format = format.replace(/\n/g, "\\n")
    .replace(/"/g, "\\\"")
    .replace(/\$\([-\w]+\)/g, function(x): string {

        return `" + logsData["${x.substr(2, x.length - 3)}"] + "`;
    });

    body += `this._driver.writeText(
    level,
    this._category,
    "${format}"
);\n`.replace(/\+ ""(\s)/g, "$1").replace(/(\s)"" \+/g, "$1");

    return <LogWritter> new Function(
        "level",
        "text",
        "lvName",
        body
    );
}

function createCustomWriter(
    formatter: Abstract.CustomFormatter
): LogWritter {

    return (new Function(
        "format",
        `return function(level, text, lvName) {
    if (this._ignored.indexOf(level) !== -1) { return; }
    this._driver.writeText(
        level,
        this._category,
        format({
            "level": level,
            "text": text,
            "category": this._category,
            "date": new Date(),
            "trace": new Error().stack.split(" at ")[4].trim()
        })
    );
};`
        ))(formatter);
}

class SimpleLogger
extends AbstractLogger<string>
implements Abstract.SimpleLogger {

    private _format: string | Abstract.CustomFormatter;

    private _write: LogWritter;

    public constructor(
        format: string | Abstract.CustomFormatter,
        ignored: Abstract.Level[],
        driver: Abstract.Driver,
        category: string = "default"
    ) {
        super("text", driver, ignored, category);

        this._format = format;

        if (typeof this._format === "string") {

            this._write = createStringWriter(this._format);
        }
        else {

            this._write = createCustomWriter(this._format);
        }
    }

    /**
     * Get the output format or formatter of logs.
     */
    public get format(): string | Abstract.CustomFormatter {

        return this._format;
    }

    /**
     * Write a piece of fetal error log.
     */
    public fetal(text: string): this {

        this._write(
            Abstract.Level.FETAL,
            text,
            Abstract.Level[Abstract.Level.FETAL]
        );

        return this;
    }

    /**
     * Write a piece of error log.
     */
    public error(text: string): this {

        this._write(
            Abstract.Level.ERROR,
            text,
            Abstract.Level[Abstract.Level.ERROR]
        );

        return this;
    }

    /**
     * Write a piece of fetal error log.
     */
    public verbose(text: string): this {

        this._write(
            Abstract.Level.VERBOSE,
            text,
            Abstract.Level[Abstract.Level.VERBOSE]
        );

        return this;
    }

    /**
     * Write a piece of warning log.
     */
    public warning(text: string): this {

        this._write(
            Abstract.Level.WARNING,
            text,
            Abstract.Level[Abstract.Level.WARNING]
        );

        return this;
    }

    /**
     * Write a piece of debug log.
     */
    public debug(text: string): this {

        this._write(
            Abstract.Level.DEBUG,
            text,
            Abstract.Level[Abstract.Level.DEBUG]
        );

        return this;
    }

    /**
     * Write a piece of INFO log.
     */
    public info(text: string): this {

        this._write(
            Abstract.Level.INFO,
            text,
            Abstract.Level[Abstract.Level.INFO]
        );

        return this;
    }

    /**
     * Write a piece of NOTICE log.
     */
    public notice(text: string): this {

        this._write(
            Abstract.Level.NOTICE,
            text,
            Abstract.Level[Abstract.Level.NOTICE]
        );

        return this;
    }

    public pick(categody: string): this {

        return <any> new SimpleLogger(
            this._format,
            this._ignored,
            this._driver,
            categody
        );
    }
}

let defaultConfig: IDictionary<any> = {

    "driver": "console",

    "format": "[$(type)][$(date)] $(text)",

    "ignore": [],

    "category": "default"
};

let _createSimpleLogger = function(
    cfg: IDictionary<any> = defaultConfig
): Abstract.SimpleLogger {

    for (let k in defaultConfig) {

        if (!cfg[k]) {

            cfg[k] = defaultConfig[k];
        }
    }

    let driver: Abstract.Driver = Drivers.getDriver(cfg.driver);

    if (!driver) {

        throw new Exception(
            Abstract.Errors.DRIVER_NOT_FOUNT,
            `The driver "${cfg.driver}" doesn't exist.`
        );
    }

    return new SimpleLogger(
        cfg.format,
        cfg.ignore,
        driver,
        cfg.category
    );
};

export interface CreateLoggerOptions {

    "driver"?: string;

    "format"?: string | Abstract.CustomFormatter;

    "ignore"?: Abstract.Level[];

    "category"?: string;
}

export let createSimpleLogger: (
    cfg?: CreateLoggerOptions
) => Abstract.SimpleLogger = <any> _createSimpleLogger;
