/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import Logger from "./Logger";

import {
    ILevelOptions
} from "./Internal";

import {
    DEFAULT_JSON_FORMATTER,
    DEFAULT_TEXT_FORMATTER
} from "./Formatters";

import { createConsoleDriver } from "./Drivers/Console";

import {
    IFactory,
    IFormatter,
    DEFAULT_SUBJECT,
    DEFAULT_DRIVER,
    ILogger,
    DefaultLevels,
    IDriver,
    DEFAULT_LEVELS
} from "./Common";

class LoggerFactory
implements IFactory<string> {

    protected _drivers: Record<string, IDriver>;

    protected _loggers: Record<string, ILogger<any, string>>;

    protected _globalConfig: Record<string, ILevelOptions>;

    protected _levels: string[];

    public constructor(levels: string[] = DEFAULT_LEVELS) {

        this._loggers = {};

        this._drivers = {
            [DEFAULT_DRIVER]: createConsoleDriver()
        };

        this._levels = levels;

        this._globalConfig = {};

        for (let lv of levels) {

            this._globalConfig[lv] = {
                enabled: false,
                trace: 0
            };
        }
    }

    /**
     * Get the names list of registered drivers.
     */
    public getDriverNames(): string[] {

        return Object.keys(this._drivers);
    }

    /**
     * Get the subjects list of created loggers.
     */
    public getSubjects(): string[] {

        return Object.keys(this._loggers);
    }

    /**
     * Get the levels list of this factory supports.
     */
    public getLevels(): string[] {

        return [...this._levels];
    }

    public mute(levels?: string | string[]): this {

        if (!levels || !levels.length) {

            levels = this._levels;
        }
        else if (typeof levels === "string") {

            levels = [ levels ];
        }

        for (let level of levels) {

            this._globalConfig[level].enabled = false;
        }

        for (let subject in this._loggers) {

            this._loggers[subject].mute(levels);
        }

        return this;
    }

    public unmute(levels?: string | string[]): this {

        if (!levels || !levels.length) {

            levels = this._levels;
        }
        else if (typeof levels === "string") {

            levels = [ levels ];
        }

        for (let level of levels) {

            this._globalConfig[level].enabled = true;
        }

        for (let subject in this._loggers) {

            this._loggers[subject].unmute(levels);
        }

        return this;
    }

    public enableTrace(depth: number = 1, levels?: string | string[]): this {

        if (!levels || levels.length === 0) {

            levels = this._levels.slice();
        }
        else if (typeof levels === "string") {

            levels = [ levels ];
        }

        for (let lv of levels) {

            this._globalConfig[lv].trace = depth;

            for (let subject in this._loggers) {

                this._loggers[subject].enableTrace(depth, lv);
            }
        }

        return this;
    }

    public registerDriver(name: string, driver: IDriver): boolean {

        if (this._drivers[name]) {

            return false;
        }

        this._drivers[name] = driver;

        return true;
    }

    public getDriver(name: string): IDriver {

        return this._drivers[name] || null;
    }

    public createTextLogger(
        subject: string = DEFAULT_SUBJECT,
        formatter: IFormatter<string, string> = DEFAULT_TEXT_FORMATTER,
        driver: string = DEFAULT_DRIVER
    ): ILogger<string, string> {

        return this.createDataLogger<string>(
            subject,
            formatter,
            driver
        );
    }

    public createDataLogger<T>(
        subject: string = DEFAULT_SUBJECT,
        formatter: IFormatter<T, string> = DEFAULT_JSON_FORMATTER,
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

/**
 * Create a new factory object.
 */
export function createFactory<
    L extends string = DefaultLevels
>(levels: L[]): IFactory<L> {

    return new LoggerFactory(levels) as any;
}

/**
 * The default factory object.
 */
const factory = createFactory<DefaultLevels>(DEFAULT_LEVELS);

/**
 * Get the default factory object.
 */
export function getDefaultFactory(): IFactory<DefaultLevels> {

    return factory as any;
}
