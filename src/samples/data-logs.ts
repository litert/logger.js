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

import Loggers from "../lib";

interface LogInfo {

    action: string;

    result: number;
}

let log = Loggers.createDataLogger<LogInfo>("data-logger", function(
    data: LogInfo,
    subject: string,
    level: string,
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
