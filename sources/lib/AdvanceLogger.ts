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

export type DataStringifier<T> = (
    lv: Abstract.Level,
    category: string,
    date: Date,
    trace: string,
    data: T
) => string;

export type DataSeriailizer<T> = (
    lv: Abstract.Level,
    category: string,
    date: Date,
    trace: string,
    data: T
) => Buffer;

type LogWritter<T> = (
    lv: Abstract.Level,
    detail: T
) => void;

function createCustomWriter<T>(output: "binary" | "text"): LogWritter<T> {

    if (output === "binary") {

        return <LogWritter<T>> new Function(
            "level",
            "data",
            `
    if (this._ignored.indexOf(level) !== -1) { return; }
    this._driver.writeBinary(
        this._serializer(
            level,
            this._category,
            new Date(),
            new Error().stack.split(" at ")[4].trim(),
            data
        )
    );`
        );
    }

    return <LogWritter<T>> new Function(
        "level",
        "data",
        `
    if (this._ignored.indexOf(level) !== -1) { return; }
    this._driver.writeText(
        level,
        this._category,
        this._stringifier(
            level,
            this._category,
            new Date(),
            new Error().stack.split(" at ")[4].trim(),
            data
        )
    );`
    );
}

class AdvanceLogger<T>
extends AbstractLogger<T>
implements Abstract.AdvanceLogger<T> {

    private _write: LogWritter<T>;

    private _stringifier: DataStringifier<T>;

    // @ts-ignore
    private _serializer: DataSeriailizer<T>;

    public constructor(
        output: "binary" | "text",
        ignored: Abstract.Level[],
        driver: Abstract.Driver,
        category: string = "default",
        wrapper: any
    ) {
        super(output, driver, ignored, category);

        if (output === "binary") {

            this._serializer = wrapper;
        }
        else {

            this._stringifier = wrapper;
        }

        this._write = createCustomWriter<T>(output);
    }

    /**
     * Write a piece of fetal error log.
     */
    public fetal(detail: T): this {

        this._write(
            Abstract.Level.FETAL,
            detail
        );

        return this;
    }

    /**
     * Write a piece of fetal error log.
     */
    public verbose(detail: T): this {

        this._write(
            Abstract.Level.VERBOSE,
            detail
        );

        return this;
    }

    /**
     * Write a piece of warning log.
     */
    public warning(detail: T): this {

        this._write(
            Abstract.Level.WARNING,
            detail
        );

        return this;
    }

    /**
     * Write a piece of debug log.
     */
    public debug(detail: T): this {

        this._write(
            Abstract.Level.DEBUG,
            detail
        );

        return this;
    }

    /**
     * Write a piece of ERROR log.
     */
    public error(detail: T): this {

        this._write(
            Abstract.Level.ERROR,
            detail
        );

        return this;
    }

    /**
     * Write a piece of INFO log.
     */
    public info(detail: T): this {

        this._write(
            Abstract.Level.INFO,
            detail
        );

        return this;
    }

    /**
     * Write a piece of NOTICE log.
     */
    public notice(detail: T): this {

        this._write(
            Abstract.Level.NOTICE,
            detail
        );

        return this;
    }

    public pick(category: string): this {

        return <any> new AdvanceLogger<T>(
            this._output,
            this._ignored,
            this._driver,
            category,
            this._output === "binary" ? this._serializer : this._stringifier
        );
    }
}

let defaultConfig: IDictionary<any> = {

    "output": "text",

    "driver": "console",

    "ignore": [],

    "category": "default",

    "wrapper": (
        level: Abstract.Level,
        category: string,
        date: Date,
        trace: string,
        data: any
    ) => {
        return JSON.stringify({
            category,
            date,
            level,
            trace,
            data
        });
    }
};

let _createAdvanceLogger = function<T>(
    cfg: IDictionary<any> = defaultConfig
): Abstract.AdvanceLogger<T> {

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

    return new AdvanceLogger(
        cfg.output,
        cfg.ignore,
        driver,
        cfg.category,
        cfg.wrapper
    );
};

export interface CreateLoggerOptions {

    "driver"?: string;

    "ignore"?: Abstract.Level[];

    "category"?: string;
}

export interface CreateTextLoggerOptions<T>
extends CreateLoggerOptions {

    "output": "text";

    "wrapper"?: DataStringifier<T>;
}

export interface CreateBinaryLoggerOptions<T>
extends CreateLoggerOptions {

    "output": "binary";

    "wrapper"?: DataSeriailizer<T>;
}

export let createAdvanceLogger: <T>(
    cfg?: CreateBinaryLoggerOptions<T> | CreateTextLoggerOptions<T>
) => Abstract.AdvanceLogger<T> = <any> _createAdvanceLogger;
