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
import * as Abstract from "./Abstracts";
import Exception from "./Exception";

abstract class AbstractLogger<T> implements Abstract.Logger<T> {

    protected _category: string;

    protected _ignored: Abstract.Level[];

    protected _output: Abstract.OutputType;

    protected _driver: Abstract.Driver;

    public constructor(
        output: Abstract.OutputType,
        driver: Abstract.Driver,
        ignored: Abstract.Level[] = [],
        category: string = "default"
    ) {

        if (output === "binary" && !driver.isBinary()) {

            throw new Exception(
                Abstract.Errors.DRIVER_NOT_BINARY,
                `The driver "${driver.name}" doesn't support binary output.`
            );
        }

        this._output = output;
        this._category = category;
        this._ignored = ignored.slice();
        this._driver = driver;
    }

    public get output(): Abstract.OutputType {

        return this._output;
    }

    public get driver(): string {

        return this._driver.name;
    }

    public get ignoredLevels(): Abstract.Level[] {

        return this._ignored.slice();
    }

    public get category(): string {

        return this._category;
    }

    public ignoreLevel(level: Abstract.Level): this {

        if (this._ignored.indexOf(level) === -1) {

            this._ignored.push(level);
        }

        return this;
    }

    public enableLevel(level: Abstract.Level): this {

        if (this._ignored.indexOf(level) !== -1) {

            this._ignored.splice(
                this._ignored.findIndex((v) => level === v)
            );
        }

        return this;
    }

    public abstract pick(category: string): this;

    public abstract verbose(log: T): this;

    public abstract debug(log: T): this;

    public abstract info(log: T): this;

    public abstract notice(log: T): this;

    public abstract warning(log: T): this;

    public abstract error(log: T): this;

    public abstract fetal(log: T): this;

    public flush(): Promise<void> {

        return this._driver.flush();
    }
}

export default AbstractLogger;
