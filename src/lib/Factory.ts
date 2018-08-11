/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as E from "./Exception";

import Logger from "./Logger";

import {
    ILevelOptions,
    DEFAULT_FORMATTER,
    DEFAULT_TEXT_FORMATTER
} from "./Internal";

import { ConsoleDriver } from "./ConsoleDriver";

import {
    ILoggerFactory,
    ILogFormatter,
    DEFAULT_SUBJECT,
    DEFAULT_DRIVER,
    ILogger,
    DefaultLogLevels,
    ILogDriver,
    DEFAULT_LEVEL_NAMES
} from "./Common";

class LoggerFactory
implements ILoggerFactory<string> {

    protected _drivers: Record<string, ILogDriver>;

    protected _loggers: Record<string, ILogger<any, string>>;

    protected _globalConfig: Record<string, ILevelOptions>;

    protected _levels: string[];

    public constructor(levels: string[] = DEFAULT_LEVEL_NAMES) {

        this._loggers = {};

        this._drivers = {
            [DEFAULT_DRIVER]: new ConsoleDriver()
        };

        this._levels = levels;

        this._globalConfig = {};

        for (let lv of levels) {

            this._globalConfig[lv] = {
                enabled: false,
                trace: false,
                fullTrace: false
            };
        }
    }

    public mute(lv?: string): this {

        if (lv) {

            this._globalConfig[lv].enabled = false;
        }
        else {

            for (let level of this._levels) {

                this._globalConfig[level].enabled = false;
            }
        }

        for (let subject in this._loggers) {

            this._loggers[subject].mute(lv);
        }

        return this;
    }

    public unmute(lv?: string): this {

        if (lv) {

            this._globalConfig[lv].enabled = true;
        }
        else {

            for (let level of this._levels) {

                this._globalConfig[level].enabled = true;
            }
        }

        for (let subject in this._loggers) {

            this._loggers[subject].unmute(lv);
        }

        return this;
    }

    public useFullTrace(enabled: boolean = true, lv?: string): this {

        if (lv) {

            this._globalConfig[lv].fullTrace = enabled;
        }
        else {

            for (let level of this._levels) {

                this._globalConfig[level].fullTrace = enabled;
            }
        }

        for (let subject in this._loggers) {

            this._loggers[subject].useFullTrace(enabled, lv);
        }

        return this;
    }

    public enableTrace(enabled: boolean = true, lv?: string): this {

        if (lv) {

            this._globalConfig[lv].trace = enabled;
        }
        else {

            for (let level of this._levels) {

                this._globalConfig[level].trace = enabled;
            }
        }

        for (let subject in this._loggers) {

            this._loggers[subject].enableTrace(enabled, lv);
        }

        return this;
    }

    public registerDriver(name: string, driver: ILogDriver): this {

        if (this._drivers[name]) {

            throw new E.Exception(
                E.E_DRIVER_FOUND,
                `The driver of name "${name}" already exists.`
            );
        }

        this._drivers[name] = driver;

        return this;
    }

    public getDriver(name: string): ILogDriver | null {

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
        formatter: ILogFormatter<string, string> = DEFAULT_TEXT_FORMATTER,
        driver: string = DEFAULT_DRIVER
    ): ILogger<string, string> {

        if (this._loggers[subject]) {

            return this._loggers[subject];
        }

        return this._loggers[subject] = new Logger(
            subject,
            this.getDriver(driver),
            this._globalConfig,
            formatter,
            this._levels
        ) as any;
    }

    public createDataLogger<T>(
        subject: string = DEFAULT_SUBJECT,
        formatter: ILogFormatter<T, string> = DEFAULT_FORMATTER,
        driver: string = DEFAULT_DRIVER
    ): ILogger<T, string> {

        if (this._loggers[subject]) {

            return this._loggers[subject];
        }

        return this._loggers[subject] = new Logger(
            subject,
            this.getDriver(driver),
            this._globalConfig,
            formatter,
            this._levels
        ) as any;
    }
}

const factory = new LoggerFactory(DEFAULT_LEVEL_NAMES);

export function getDefaultFactory<
    L extends string = DefaultLogLevels
>(): ILoggerFactory<L> {

    return factory as any;
}

export function createLoggerFactory<
    L extends string = DefaultLogLevels
>(levels: L[]): ILoggerFactory<L> {

    return new LoggerFactory(levels) as any;
}
