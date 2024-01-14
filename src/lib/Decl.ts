/**
 *  Copyright 2024 Angus ZENG <fenying@litert.org>
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

/**
 * The names of default levels.
 */
export const DEFAULT_LEVELS: readonly IDefaultLevels[] = [
    'error',
    'notice',
    'warning',
    'debug',
    'info'
];

/**
 * The function serializing or formatting original input of logs into text form.
 *
 * @param log       The original input of log.
 * @param subject   The subject of log.
 * @param level     The level of log.
 * @param time      The time of log.
 * @param traces    The trace-info of log.
 */
export type IFormatter<TLog, TLv extends string> = (
    log: TLog,
    subject: string,
    level: TLv,
    time: number,
    traces?: readonly string[]
) => string;

export interface IDriver {

    /**
     * This method is provided to be called by logger, to send logs to target output device.
     *
     * @param text      The formatted log text.
     * @param subject   The subject of log
     * @param level     The level of log
     * @param time      The time of log
     */
    write(
        text: string,
        subject: string,
        level: string,
        time: number
    ): void;

    /**
     * Flush all logs in the log driver buffer.
     */
    flush(): void | Promise<void>;

    /**
     * Shutdown the driver.
     *
     * This method should invoke method `flush` automatically before closing driver.
     */
    close(): void | Promise<void>;
}

export interface ILevelOptions<TLog, TLv extends string> {

    /**
     * Enable or disable the log output of this level.
     */
    'enabled': boolean;

    /**
     * The trace depth of this level.
     */
    'traceDepth': number;

    /**
     * The formatter of this level.
     */
    'formatter': IFormatter<TLog, TLv>;

    /**
     * The driver of this level.
     */
    'driver': IDriver;
}

export interface ILevelUpdateOptions<TLog, TLv extends string> extends Partial<ILevelOptions<TLog, TLv>> {

    /**
     * The level name to be updated.
     *
     * > If not specified or set to empty array `[]`, the options will be applied to all levels.
     *
     * @default all levels
     */
    'levels'?: TLv | TLv[];
}

export interface IBaseLogger<TLog, TLv extends string> {

    /**
     * The subject of current logger.
     *
     * @readonly
     */
    readonly 'subject': string;

    /**
     * The level names of current logger.
     */
    readonly 'levels': readonly TLv[];

    /**
     * Configure the specific levels of current logger.
     *
     * @param options   The new options of levels.
     */
    setLevelOptions(options: ILevelUpdateOptions<TLog, TLv>): this;

    /**
     * Get the options of specific level.
     *
     * @param level     The level name.
     */
    getLevel(level: TLv): ILevelOptions<TLog, TLv>;
}

/**
 * The logging methods signature.
 */
export type ILoggerMethod<TLog, TLv extends string> = (log: TLog, time?: number) => ILogger<TLog, TLv>;

/**
 * The logger interface.
 */
export type ILogger<TLog, TLv extends string> = IBaseLogger<TLog, TLv> & Record<
    TLv,
    ILoggerMethod<TLog, TLv>
>;

/**
 * The default levels of loggers.
 */
export type IDefaultLevels = 'error' | 'notice' | 'warning' | 'debug' | 'info';

/**
 * The logger factory interface.
 */
export interface IFactory<TLog, TLv extends string> {

    /**
     * The level names of current factory.
     *
     * @readonly
     */
    readonly 'levels': readonly TLv[];

    /**
     * Setup the default options of specific levels for new loggers created by this factory.
     *
     * > Only applies to new loggers created after calling this method.
     *
     * @param options   The new options of levels.
     */
    setLevelOptions(options: ILevelUpdateOptions<TLog, TLv>): this;

    /**
     * Get the default options of specific level for new loggers created by this factory.
     *
     * @param level     The level name.
     */
    getLevelOptions(level: TLv): ILevelOptions<TLog, TLv>;

    /**
     * Create a logger.
     *
     * @param subject   The subject of logger.
     */
    createLogger(subject: string): ILogger<TLog, TLv>;
}
