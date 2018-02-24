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

export enum Level {

    /**
     * The log for debug only.
     */
    DEBUG,

    /**
     * The verbose log.
     */
    VERBOSE,

    /**
     * The normal information.
     */
    INFO,

    /**
     * Something MIGHT lead to an error.
     */
    NOTICE,

    /**
     * Something COULD lead to an error.
     */
    WARNING,

    /**
     * An error.
     */
    ERROR,

    /**
     * A fetal error.
     */
    FETAL
}

export type OutputType = "binary" | "text";

export interface Logger<T> {

    /**
     * Get the ignored levels of logs.
     */
    readonly ignoredLevels: Level[];

    /**
     * The category this logger is using.
     */
    readonly category: string;

    /**
     * The name of the driver this logger is using.
     */
    readonly driver: string;

    /**
     * The output type of this logger.
     */
    readonly output: OutputType;

    /**
     * Write a piece of DEBUG log.
     *
     * @param log The detail of log.
     */
    debug(log: T): this;

    /**
     * Write a piece of ERROR log.
     *
     * @param log The detail of log.
     */
    error(log: T): this;

    /**
     * Write a piece of FETAL error log.
     *
     * @param log The detail of log.
     */
    fetal(log: T): this;

    /**
     * Write a piece of INFO log.
     *
     * @param log The detail of log.
     */
    info(log: T): this;

    /**
     * Write a piece of NOTICE log.
     *
     * @param log The detail of log.
     */
    notice(log: T): this;

    /**
     * Write a piece of VERBOSE log.
     *
     * @param log The detail of log.
     */
    verbose(log: T): this;

    /**
     * Write a piece of WARNING log.
     *
     * @param log The detail of log.
     */
    warning(log: T): this;

    /**
     * Add a level into ignored levels list.
     *
     * @param level The level to be ignored.
     */
    ignoreLevel(level: Level): this;

    /**
     * Remove a level from ignored levels list.
     *
     * @param level The level to be removed.
     */
    enableLevel(level: Level): this;

    /**
     * Get a clone of this logger for a new category.
     *
     * @param category The category for new logger.
     */
    pick(category: string): this;

    /**
     * Flush all logs in driver buffer.
     */
    flush(): Promise<void>;
}

export interface SimpleLogger extends Logger<string> {

    /**
     * Get the output format or formatter of logs.
     */
    readonly format: string | CustomFormatter;
}

export type AdvanceLogger<T> = Logger<T>;

export interface CustomFormatterData {

    /**
     * The category of this log.
     */
    "category": string;

    /**
     * The datetime of this log.
     */
    "date": Date;

    /**
     * The level of this log.
     */
    "level": Level;

    /**
     * The text of this log.
     */
    "text": string;

    /**
     * Where this log is written.
     */
    "trace": string;
}

export type CustomFormatter = (data: CustomFormatterData) => string;

export interface Driver {

    /**
     * The name of this driver object.
     */
    readonly "name": string;

    /**
     * Write a line of text.
     */
    writeText(
        level: Level,
        category: string,
        text: string
    ): void;

    /**
     * Write a piece of binary data.
     */
    writeBinary(
        data: Buffer
    ): void;

    /**
     * Flush all data in buffer.
     */
    flush(before?: number): Promise<void>;

    /**
     * Tell if this driver supports binary data.
     */
    isBinary(): boolean;
}

export enum Errors {

    /**
     * The driver doesn't exist.
     */
    DRIVER_NOT_FOUNT,

    /**
     * The driver doesn't support binary output.
     */
    DRIVER_NOT_BINARY,
}
