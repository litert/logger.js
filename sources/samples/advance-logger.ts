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

import Loggers from "..";

interface LogData {

    user: string;

    action: string;

    result: number;
}

function testLogger(): void {

    let log = Loggers.createAdvanceLogger<LogData>({
        output: "text",
        driver: "console",
        ignore: [
            Loggers.Level.DEBUG,
            Loggers.Level.VERBOSE
        ], // 忽略精细日志和调试日志
        category: "test"
    });

    log.warning({
        "user": "Angus",
        "action": "Login",
        "result": 0
    });

    log.fetal({
        "user": "Angus",
        "action": "KillUser",
        "result": 0x00000100
    });

    log.debug({
        "user": "Angus",
        "action": "ResetPassword",
        "result": 0
    });

    log.notice({
        "user": "Angus",
        "action": "UpgradeVIP",
        "result": 0
    });

    log.pick("hello").warning({
        "user": "Angus",
        "action": "ResetPassword",
        "result": 0
    });
}

function testCustomLogger(): void {

    let log = Loggers.createAdvanceLogger<string>({
        output: "text",
        driver: "console",
        ignore: [Loggers.Level.VERBOSE], // 忽略精细日志
        category: "custom",
        wrapper(
            lv: Loggers.Level,
            category: string,
            date: Date,
            trace: string,
            data: string
        ): string {

            return `[${date.toISOString()}][${Loggers.Level[lv]}] ${data}`;
        }
    });

    log.warning("Heiheihei");

    log.fetal("You were killed!");

    log.debug("This is a piece of DEBUG log.");

    log.notice("This is a piece of NOTICE log.");

    log.verbose("This is a piece of VERBOSE log.");

    log.pick("hello").warning("hi");
}

testLogger();

testCustomLogger();
