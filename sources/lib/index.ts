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

export { createSimpleLogger } from "./SimpleLogger";
export { createAdvanceLogger } from "./AdvanceLogger";
export * from "./Abstracts";

import { createConsoleDriver } from "./drivers/Console";

import * as Drivers from "./drivers";

export * from "./drivers";

Drivers.addDriver("console", createConsoleDriver());
