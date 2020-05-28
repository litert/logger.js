/**
 *  Copyright 2020 Angus.Fenying <fenying@litert.org>
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
 * The name of default driver.
 */
export const DEFAULT_DRIVER = 'console';

/**
 * The name of default subject.
 */
export const DEFAULT_SUBJECT = 'default';

/**
 * The names of default levels.
 */
export const DEFAULT_LEVELS: DefaultLevels[] = [
    'error',
    'notice',
    'warning',
    'debug',
    'info'
];

/**
 * The function serializing or formating original input of logs into text form.
 *
 * @param log       The original input of log.
 * @param subject   The subject of log.
 * @param level     The level of log.
 * @param date      The datetime of log.
 * @param traces    The trace-info of log.
 */
export type IFormatter<T, L extends string> = (
    log: T,
    subject: string,
    level: L,
    date: Date,
    traces?: string[]
) => string;

export interface IDriver {

    /**
     * This method is provided to be called by logger, to send logs
     * to target device.
     *
     * @param text      The formatted log text.
     * @param subject   The subject of log
     * @param level     The level of log
     * @param date      The data of log
     */
    write(
        text: string,
        subject: string,
        level: string,
        date: Date
    ): void;

    /**
     * Flush all logs in the log driver buffer.
     */
    flush(): void | Promise<void>;

    /**
     * Shutdown the driver.
     *
     * This method should invoke method `flush` automatically before closing
     * driver.
     */
    close(): void | Promise<void>;
}

export interface IBaseLogger<L extends string> {

    /**
     * Get the subject of current logger.
     */
    getSubject(): string;

    /**
     * Get the levels list of this logger supports.
     */
    getLevels(): L[];

    /**
     * Enable or disable trace info of all levels or determined level of
     * current logger.
     *
     * @param depth Set the depth of tracing stack, by default it's 1.
     *              Set to 0 to shutdown displaying trace stack.
     * @param level Determine a level or a list of level to be disabled tracing.
     *              By default it will be all levels.
     */
    enableTrace(depth?: number, level?: L | L[]): this;

    /**
     * Unmute all levels or determined level of current logger.
     *
     * @param level Determine a level or a list of level to be unmuted.
     *              By default it will be all levels.
     */
    unmute(level?: L | L[]): this;

    /**
     * Mute all levels or determined level of current logger.
     *
     * @param level Determine a level or a list of level to be muted.
     *              By default it will be all levels.
     */
    mute(level?: L | L[]): this;

    /**
     * Flush the logs in driver's buffer.
     */
    flush(): void | Promise<void>;
}

/**
 * The logging methods signature.
 */
export type LoggerMethod<T, L extends string> = (
    log: T,
    date?: Date
) => ILogger<T, L>;

/**
 * The logger interface.
 */
export type ILogger<T, L extends string> = IBaseLogger<L> & Record<
    L,
    LoggerMethod<T, L>
>;

/**
 * The default levels of loggers.
 */
export type DefaultLevels = 'error' | 'notice' | 'warning' | 'debug' | 'info';

/**
 * The logger factory interface.
 */
export interface IFactory<L extends string> {

    /**
     * Mute all levels of all loggers, or determined level of all loggers.
     *
     * @param level Determine a level or a list of level to be muted.
     *              By default it will be all levels.
     */
    mute(level?: L | L[]): this;

    /**
     * Enable all levels of all loggers, or determined level of all loggers.
     *
     * @param level Determine a level or a list of level to be unmuted.
     *              By default it will be all levels.
     */
    unmute(level?: L | L[]): this;

    /**
     * Disable or enable trace info for all levels of all loggers, or for
     * determined level of all loggers.
     *
     * @param depth Set the depth of tracing stack, by default it's 1.
     *              Set to 0 to shutdown displaying trace stack.
     * @param level Determine a level or a list of level to be disabled tracing.
     *              By default it will be all levels.
     */
    enableTrace(depth?: number, level?: L | L[]): this;

    /**
     * Added a new driver.
     *
     * @param name   The unique name of driver
     * @param driver The driver object.
     */
    registerDriver(name: string, driver: IDriver): boolean;

    /**
     * Find and return an existing driver by its unique name.
     *
     * @param name  The unique name of driver
     */
    getDriver(name: string): IDriver | null;

    /**
     * Get the names list of registered drivers.
     */
    getDriverNames(): string[];

    /**
     * Added a new formatter for data logger.
     *
     * @param name          The unique name of formatter
     * @param formatter     The formatter.
     */
    registerDataFormatter<T>(name: string, formatter: IFormatter<T, L>): boolean;

    /**
     * Added a new formatter for text logger.
     *
     * @param name          The unique name of formatter
     * @param formatter     The formatter.
     */
    registerTextFormatter(name: string, formatter: IFormatter<string, L>): boolean;

    /**
     * Find and return an existing formatter by its unique name.
     *
     * @param name  The unique name of data formatter
     */
    getDataFormatter<T = any>(name: string): IFormatter<T, string>;

    /**
     * Find and return an existing formatter by its unique name.
     *
     * @param name  The unique name of text formatter
     */
    getTextFormatter(name: string): IFormatter<string, string>;

    /**
     * Get the names list of registered data formatters.
     */
    getDataFormatterNames(): string[];

    /**
     * Get the names list of registered text formatters.
     */
    getTextFormatterNames(): string[];

    /**
     * Get the subjects list of created loggers.
     */
    getSubjects(): string[];

    /**
     * Get the levels list of this factory supports.
     */
    getLevels(): L[];

    /**
     * Create a simple text logger.
     *
     * @param subject   The unique subject of logger. (default: default)
     * @param formatter The formatter helps stringify input data.
     *                  (default: DEFAULT_TEXT_FORMATTER)
     * @param driver    The driver to write logs. (default: console)
     */
    createTextLogger(
        subject?: string,
        formatter?: IFormatter<string, L> | string,
        driver?: string
    ): ILogger<string, L>;

    /**
     * Create a simple data logger.
     *
     * @param subject The unique subject of logger. (default: default)
     * @param formatter The formatter helps stringify input data.
     *                  (default: DEFAULT_JSON_FORMATTER)
     * @param driver  The driver to write logs. (default: console)
     */
    createDataLogger<T = any>(
        subject?: string,
        formatter?: IFormatter<T, L> | string,
        driver?: string
    ): ILogger<T, L>;
}
