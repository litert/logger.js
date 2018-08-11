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

/**
 * The name of default driver.
 */
export const DEFAULT_DRIVER = "console";

/**
 * The name of default subject.
 */
export const DEFAULT_SUBJECT = "default";

export const EXCEPTION_TYPE = "litert/logger";

/**
 * The names of default levels.
 */
export const DEFAULT_LEVEL_NAMES: DefaultLogLevels[] = [
    "error",
    "notice",
    "warning",
    "debug",
    "info"
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
export type ILogFormatter<T, L extends string> = (
    log: T,
    subject: string,
    level: L,
    date: Date,
    traces?: string[]
) => string;

export interface ILogDriver {

    write(
        text: string,
        subject: string,
        level: string,
        date: Date
    ): void;

    flush(): void | Promise<void>;

    close(): void | Promise<void>;
}

export interface IBaseLogger<L extends string> {

    /**
     * Get the subject of current logger.
     */
    getSubject(): string;

    /**
     * Enable or disable trace info of all levels or determined level of
     * current logger.
     *
     * @param enable Set to false to disable trace info. (Default: true)
     * @param lv Determine a level to be disabled tracing.
     */
    enableTrace(enable?: boolean, lv?: L): this;

    /**
     * Enable tracing for all levels of all loggers, or for determined level
     * of all loggers.
     *
     * @param enable Set to false to use short form trace info. (Default: true)
     * @param lv Determine a level to be enabled tracing.
     */
    useFullTrace(enable?: boolean, lv?: L): this;

    /**
     * Unmute all levels or determined level of current logger.
     *
     * @param level (Optional) The determined level.
     */
    unmute(level?: L): this;

    /**
     * Mute all levels or determined level of current logger.
     *
     * @param level (Optional) The determined level.
     */
    mute(level?: L): this;
}

export type LoggerMethod<T, L extends string> = (
    log: T,
    data?: Date
) => ILogger<T, L>;

export type ILogger<T, L extends string> = IBaseLogger<L> & Record<
    L,
    LoggerMethod<T, L>
>;

export type DefaultLogLevels = "error" | "notice" | "warning" | "debug" | "info";

export interface ILoggerFactory<L extends string> {

    /**
     * Mute all levels of all loggers, or determined level of all loggers.
     *
     * @param lv Determine a level to be muted.
     */
    mute(lv?: L): this;

    /**
     * Enable all levels of all loggers, or determined level of all loggers.
     *
     * @param lv Determine a level to be enabled.
     */
    unmute(lv?: L): this;

    /**
     * Disable or enable trace info for all levels of all loggers, or for
     * determined level of all loggers.
     *
     * @param enable Set to false to disable trace info. (Default: true)
     * @param lv Determine a level to be disabled tracing.
     */
    enableTrace(enable?: boolean, lv?: L): this;

    /**
     * Setup the trace info format for all levels of all loggers, or for
     * determined level of all loggers.
     *
     * @param enable Set to false to use short form trace info. (Default: true)
     * @param lv Determine a level to be enabled tracing.
     */
    useFullTrace(enable?: boolean, lv?: L): this;

    /**
     * Added a new driver. If the driver of the name already exists, an
     * exception will be thrown.
     *
     * @param name   The unique name of driver
     * @param driver The driver object.
     */
    registerDriver(name: string, driver: ILogDriver): this;

    /**
     * Find and return an existing driver by its unique name.
     *
     * @param name  The unique name of driver
     */
    getDriver(name: string): ILogDriver | null;

    /**
     * Create a simple text logger.
     *
     * @param subject The unique subject of logger. (default: default)
     * @param driver  The driver to write logs. (default: console)
     */
    createTextLogger(
        subject?: string,
        formatter?: ILogFormatter<string, L>,
        driver?: string
    ): ILogger<string, L>;

    /**
     * Create a simple data logger.
     *
     * @param subject The unique subject of logger. (default: default)
     * @param formatter The formatter helps stringify input data. (default: json)
     * @param driver  The driver to write logs. (default: console)
     */
    createDataLogger<T = any>(
        subject: string,
        formatter: ILogFormatter<T, L>,
        driver?: string
    ): ILogger<T, L>;
}
