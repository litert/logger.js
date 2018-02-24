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

function testLogger(): void {

    let log = Loggers.createSimpleLogger({
        driver: "console",
        format: "[$(level-name)][$(iso-local-datetime)][$(category)] $(text) << $(trace)",
        ignore: [
            Loggers.Level.DEBUG,
            Loggers.Level.VERBOSE
        ], // 忽略精细日志和调试日志
        category: "test"
    });

    log.warning("Heiheihei");

    log.fetal("You were killed!");

    log.debug("This is a piece of DEBUG log.");

    log.notice("This is a piece of NOTICE log.");

    log.pick("hello").warning("hey");
}

function testCustomLogger(): void {

    let log = Loggers.createSimpleLogger({
        driver: "console",
        format(data: Loggers.CustomFormatterData): string {

            return `[${Loggers.Level[data.level]}] ${data.category}: ${data.text} << ${data.trace}`;
        },
        ignore: [Loggers.Level.VERBOSE], // 忽略精细日志
        category: "custom"
    });

    log.warning("Heiheihei");

    log.fetal("You were killed!");

    log.debug("This is a piece of DEBUG log.");

    log.notice("This is a piece of NOTICE log.");

    log.verbose("This is a piece of VERBOSE log.");

    log.pick("hello").warning("hey");
}

testLogger();

testCustomLogger();
