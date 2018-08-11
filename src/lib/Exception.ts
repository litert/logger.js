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
