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

import Loggers, { LogLevel } from "..";

interface LogInfo {

    action: string;

    result: number;
}

let log = Loggers.createDataLogger<LogInfo>("data-logger", function(
    data: LogInfo,
    subject: string,
    level: LogLevel,
    date: Date,
    trace
): string {

    // tslint:disable-next-line:max-line-length
    return `${date.toISOString()} - ${level} - ${subject} - Executed action ${data.action}, with result ${data.result}.`;
});

Loggers.unmute();

log.debug({
    action: "SendMessage",
    result: 1
});
