/**
 *  Copyright 2024 Angus ZENG <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import type { IFormatter } from './Decl';

/**
 * The default formatter for text log.
 */
export const DEFAULT_TEXT_FORMATTER: IFormatter<string, string> = function(
    log: string,
    subject: string,
    level: string,
    time: number,
    traces?: readonly string[]
): string {

    if (traces) {

        return `[${new Date(time).toISOString()}][${level}] ${subject}: ${log}
  at ${traces.join('\n  at ')}`;
    }

    return `[${new Date(time).toISOString()}][${level}] ${subject}: ${log}`;
};

/**
 * The default formatter for customized log.
 */
export const DEFAULT_JSON_FORMATTER: IFormatter<unknown, string> = function(
    log: unknown,
    subject: string,
    level: string,
    time: number,
    traces?: readonly string[]
): string {

    return JSON.stringify({ subject, level, time, log, traces });
};
