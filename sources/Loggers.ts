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

import { Dict } from "@litert/core";
import * as E from "./Exception";
import {

    Logger,
    LoggerFactory,
    LogLevel,
    LogFormatter,
    LogDriver,
    LOG_LEVELS,
    DEFAULT_DRIVER,
    DEFAULT_SUBJECT,
    DEFAULT_FORMATTER

} from "./Common";

interface LogLevelOptions {

    "enabled": boolean;

    "trace": boolean;

    "fullTrace": boolean;
}

const FULL_TRACE = `new Error().stack.split(" at ").slice(3).map(function(x) {
    return x.trim();
})`;

const SHORT_TRACE = `new Error().stack.split(" at ")[3].trim()`;

function createLogMethod(
    subject: string,
    lv: string,
    tracing: boolean,
    fullTrace: boolean,
    driver: LogDriver,
    formatter: LogFormatter<any>
): any {

    let $trace = ``;

    subject = subject.replace(/"/, "\\\"");

    if (formatter) {

        if (tracing) {

            $trace = fullTrace ?
            `undefined,${FULL_TRACE}` :
            `${SHORT_TRACE}`;
        }

        return (new Function("formatter", "driver", `return function(log) {
            driver.log(formatter(
                log,
                "${subject}",
                "${lv.toUpperCase()}",
                new Date(),
                $trace
            ));
            return this;
        }`))(formatter, driver);
    }

    if (tracing) {

        if (fullTrace) {

            $trace = `driver.log(${FULL_TRACE}.join("\\n"));`;
        }
        else {

            $trace = `driver.log(${SHORT_TRACE});`;
        }
    }

    return (new Function("driver", `return function(text) {
        driver.log(
            "[" + new Date().toISOString() + "][${lv.toUpperCase()}] ${subject}: " + text
        );
        ${$trace}
        return this;
    }`))(driver);
}

class CLogger<T>
implements Logger<T> {

    protected _options: Dict<LogLevelOptions>;

    protected _subject: string;

    protected _formatter!: LogFormatter<T>;

    protected _driver: LogDriver;

    public constructor(
        subject: string,
        driver: LogDriver,
        settings: Dict<LogLevelOptions>,
        wraper?: LogFormatter<T>
    ) {

        this._options = {};

        this._driver = driver;

        this._subject = subject;

        this._formatter = <any> wraper;

        for (let lv of LOG_LEVELS) {

            this._options[lv] = {
                enabled: settings[lv].enabled,
                trace: settings[lv].trace,
                fullTrace: settings[lv].fullTrace
            };

            this._updateMethod(lv);
        }
    }

    public getSubject(): string {

        return this._subject;
    }

    public error(log: T): this {

        return this;
    }

    public warning(log: T): this {

        return this;
    }

    public notice(log: T): this {

        return this;
    }

    public info(log: T): this {

        return this;
    }

    public debug(log: T): this {

        return this;
    }

    public useFullTrace(enable: boolean = true, lv?: LogLevel): this {

        if (lv !== undefined) {

            this._options[lv].fullTrace = enable;
            this._updateMethod(lv);
        }
        else {

            for (let level in this._options) {

                this._options[level].fullTrace = enable;
                this._updateMethod(<any> level);
            }
        }

        return this;
    }

    public enableTrace(enable: boolean = true, lv?: LogLevel): this {

        if (lv !== undefined) {

            this._options[lv].trace = enable;
            this._updateMethod(lv);
        }
        else {

            for (let level in this._options) {

                this._options[level].trace = enable;
                this._updateMethod(<any> level);
            }
        }

        return this;
    }

    public unmute(lv?: LogLevel): this {

        if (lv !== undefined) {

            this._options[lv].enabled = true;
            this._updateMethod(lv);
        }
        else {

            for (let level in this._options) {

                this._options[level].enabled = true;
                this._updateMethod(<any> level);
            }
        }

        return this;
    }

    public mute(lv?: LogLevel): this {

        if (lv !== undefined) {

            this._options[lv].enabled = false;
            this._updateMethod(lv);
        }
        else {

            for (let level in this._options) {

                this._options[level].enabled = false;
                this._updateMethod(<any> level);
            }
        }

        return this;
    }

    protected _updateMethod(
        lv: keyof Logger<T>
    ): void {

        const opts = this._options[lv];

        if (opts.enabled) {

            this[lv] = createLogMethod(
                this._subject,
                lv,
                opts.trace,
                opts.fullTrace,
                this._driver,
                this._formatter
            );
        }
        else {

            this[lv] = function(x: T) { return this; };
        }
    }
}

class CLoggerFactory
implements LoggerFactory {

    protected _drivers: Dict<LogDriver>;

    protected _loggers: Dict<Logger<any>>;

    protected _globalConfig: Dict<LogLevelOptions>;

    public constructor() {

        this._loggers = {};

        this._drivers = {
            console
        };

        this._globalConfig = {};

        for (let lv of LOG_LEVELS) {

            this._globalConfig[lv] = {
                enabled: false,
                trace: false,
                fullTrace: false
            };
        }
    }

    public mute(lv?: LogLevel): this {

        if (lv) {

            this._globalConfig[lv].enabled = false;
        }
        else {

            for (let level of LOG_LEVELS) {

                this._globalConfig[level].enabled = false;
            }
        }

        for (let subject in this._loggers) {

            this._loggers[subject].mute(lv);
        }

        return this;
    }

    public unmute(lv?: LogLevel): this {

        if (lv) {

            this._globalConfig[lv].enabled = true;
        }
        else {

            for (let level of LOG_LEVELS) {

                this._globalConfig[level].enabled = true;
            }
        }

        for (let subject in this._loggers) {

            this._loggers[subject].unmute(lv);
        }

        return this;
    }

    public useFullTrace(enabled: boolean = true, lv?: LogLevel): this {

        if (lv) {

            this._globalConfig[lv].fullTrace = enabled;
        }
        else {

            for (let level of LOG_LEVELS) {

                this._globalConfig[level].fullTrace = enabled;
            }
        }

        for (let subject in this._loggers) {

            this._loggers[subject].useFullTrace(enabled, lv);
        }

        return this;
    }

    public enableTrace(enabled: boolean = true, lv?: LogLevel): this {

        if (lv) {

            this._globalConfig[lv].trace = enabled;
        }
        else {

            for (let level of LOG_LEVELS) {

                this._globalConfig[level].trace = enabled;
            }
        }

        for (let subject in this._loggers) {

            this._loggers[subject].enableTrace(enabled, lv);
        }

        return this;
    }

    public registerDriver(name: string, driver: LogDriver): this {

        if (this._drivers[name]) {

            throw new E.Exception(
                E.E_DRIVER_FOUND,
                `The driver of name "${name}" already exists.`
            );
        }

        this._drivers[name] = driver;

        return this;
    }

    public getDriver(name: string): LogDriver | null {

        if (!this._drivers[name]) {

            throw new E.Exception(
                E.E_DRIVER_NOT_FOUND,
                `The driver of name "${name}" doesn't exist.`
            );
        }

        return this._drivers[name] || null;
    }

    public createTextLogger(
        subject: string = DEFAULT_SUBJECT,
        driver: string = DEFAULT_DRIVER
    ): Logger<string> {

        if (this._loggers[subject]) {

            return this._loggers[subject];
        }

        return this._loggers[subject] = new CLogger<string>(
            subject,
            this.getDriver(driver),
            this._globalConfig
        );
    }

    public createDataLogger<T = any>(
        subject: string = DEFAULT_SUBJECT,
        formatter: LogFormatter<T> = DEFAULT_FORMATTER,
        driver: string = DEFAULT_DRIVER
    ): Logger<T> {

        if (this._loggers[subject]) {

            return this._loggers[subject];
        }

        return this._loggers[subject] = new CLogger<T>(
            subject,
            this.getDriver(driver),
            this._globalConfig,
            formatter
        );
    }
}

const factory = new CLoggerFactory();

export function getLoggerFactory(): LoggerFactory {

    return factory;
}

export default getLoggerFactory;
