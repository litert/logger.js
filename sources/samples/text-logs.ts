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

const logs1 = Loggers.createTextLogger("app1");
const logs2 = Loggers.createTextLogger("app2");

Loggers.unmute("debug");

const logs3 = Loggers.createTextLogger("app3");

logs1.debug("test 1");
logs2.debug("test 2");
logs3.debug("test 3");

Loggers.mute("debug");

logs1.debug("test 4");
logs2.debug("test 5");
logs3.debug("test 6");
