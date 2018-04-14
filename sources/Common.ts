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

export const DEFAULT_DRIVER = "console";

export const DEFAULT_SUBJECT = "default";

export const EXCEPTION_TYPE = "litert/logger";

export type LogLevel = "debug" | "error" | "warning" | "notice" | "info";

export const LOG_LEVELS: LogLevel[] = [
    "error",
    "notice",
    "warning",
    "debug",
    "info"
];

export type LogFormatter<T> = (
    log: T,
    subject: string,
    level: LogLevel,
    date: Date,
    trace?: string,
    fullTraces?: string[]
) => string;

export const DEFAULT_FORMATTER = (
    log: any,
    subject: string,
    level: LogLevel,
    date: Date,
    trace?: string,
    fullTraces?: string[]
) => JSON.stringify({
    subject,
    level,
    date: date.getTime(),
    log,
    trace,
    fullTraces
});

export interface LogDriver {

    log(text: string): void;
}

export interface Logger<T> {

    /**
     * Get the subject of current logger.
     */
    getSubject(): string;

    /**
     * Write a piece of log of DEBUG level.
     *
     * @param log The log.
     */
    debug(log: T): this;

    /**
     * Write a piece of log of INFO level.
     *
     * @param log The log.
     */
    info(log: T): this;

    /**
     * Write a piece of log of NOTICE level.
     *
     * @param log The log.
     */
    notice(log: T): this;

    /**
     * Write a piece of log of WARNING level.
     *
     * @param log The log.
     */
    warning(log: T): this;

    /**
     * Write a piece of log of ERROR level.
     *
     * @param log The log.
     */
    error(log: T): this;

    /**
     * Enable or disable trace info of all levels or determined level of
     * current logger.
     *
     * @param enable Set to false to disable trace info. (Default: true)
     * @param lv Determine a level to be disabled tracing.
     */
    enableTrace(enable?: boolean, lv?: LogLevel): this;

    /**
     * Enable tracing for all levels of all loggers, or for determined level
     * of all loggers.
     *
     * @param enable Set to false to use short form trace info. (Default: true)
     * @param lv Determine a level to be enabled tracing.
     */
    useFullTrace(enable?: boolean, lv?: LogLevel): this;

    /**
     * Unmute all levels or determined level of current logger.
     *
     * @param level (Optional) The determined level.
     */
    unmute(level?: LogLevel): this;

    /**
     * Mute all levels or determined level of current logger.
     *
     * @param level (Optional) The determined level.
     */
    mute(level?: LogLevel): this;
}

export interface LoggerFactory {

    /**
     * Mute all levels of all loggers, or determined level of all loggers.
     *
     * @param lv Determine a level to be muted.
     */
    mute(lv?: LogLevel): this;

    /**
     * Enable all levels of all loggers, or determined level of all loggers.
     *
     * @param lv Determine a level to be enabled.
     */
    unmute(lv?: LogLevel): this;

    /**
     * Disable or enable trace info for all levels of all loggers, or for
     * determined level of all loggers.
     *
     * @param enable Set to false to disable trace info. (Default: true)
     * @param lv Determine a level to be disabled tracing.
     */
    enableTrace(enable?: boolean, lv?: LogLevel): this;

    /**
     * Setup the trace info format for all levels of all loggers, or for
     * determined level of all loggers.
     *
     * @param enable Set to false to use short form trace info. (Default: true)
     * @param lv Determine a level to be enabled tracing.
     */
    useFullTrace(enable?: boolean, lv?: LogLevel): this;

    /**
     * Added a new driver, or override a existing one.
     *
     * @param name   The unique name of driver
     * @param driver The driver object.
     */
    registerDriver(name: string, driver: LogDriver): this;

    /**
     * Find and return an existing driver by its unique name.
     *
     * @param name  The unique name of driver
     */
    getDriver(name: string): LogDriver | null;

    /**
     * Create a simple text logger.
     *
     * @param subject The unique subject of logger. (default: default)
     * @param driver  The driver to write logs. (default: console)
     */
    createTextLogger(
        subject?: string,
        driver?: string
    ): Logger<string>;

    /**
     * Create a simple data logger.
     *
     * @param subject The unique subject of logger. (default: default)
     * @param formatter The formatter helps stringify input data. (default: json)
     * @param driver  The driver to write logs. (default: console)
     */
    createDataLogger<T = any>(
        subject: string,
        formatter: LogFormatter<T>,
        driver?: string
    ): Logger<T>;
}
