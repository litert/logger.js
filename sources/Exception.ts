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

import * as L from "@litert/core";
import { EXCEPTION_TYPE } from "./Common";

export const E_DRIVER_NOT_FOUND = 1;
export const E_DRIVER_FOUND = 2;

export class Exception extends L.Exception {

    public constructor(error: number, message: string, origin?: any) {

        super(error, message, origin);

        this._type = EXCEPTION_TYPE;
    }
}

export default Exception;
