/**
 *  Copyright 2025 Angus ZENG <fenying@litert.org>
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

import * as dL from './Decl';
import { Logger } from './Logger';
import { createConsoleDriver } from './Drivers/Console';
import { DEFAULT_TEXT_FORMATTER } from './Formatters';

class LoggerFactory<
    TLog,
    TLv extends string
> implements dL.IFactory<TLog, TLv> {

    /**
     * The options of levels for new logger.
     */
    protected readonly _lvOpts: Record<string, dL.ILevelOptions<TLog, TLv>>;

    public constructor(
        driver: dL.IDriver,
        public readonly levels: readonly TLv[],
        formatter: dL.IFormatter<TLog, TLv>
    ) {

        this._lvOpts = {};

        for (const lv of levels) {

            this._lvOpts[lv] = {
                enabled: true,
                traceDepth: 0,
                driver,
                formatter
            };
        }
    }

    public setLevelOptions(options: dL.ILevelUpdateOptions<TLog, TLv>): this {

        const levels = options.levels?.length ?
            Array.isArray(options.levels) ? options.levels : [options.levels] :
            this.levels;

        for (const lv of levels) {

            if (!this.levels.includes(lv)) {

                continue;
            }

            this._lvOpts[lv] = {
                'traceDepth': Math.max(0, options.traceDepth ?? this._lvOpts[lv]?.traceDepth ?? 0),
                'enabled': options.enabled ?? this._lvOpts[lv]?.enabled ?? true,
                'driver': options.driver ?? this._lvOpts[lv].driver,
                'formatter': options.formatter ?? this._lvOpts[lv].formatter
            };

        }

        return this;
    }

    public getLevelOptions(level: TLv): dL.ILevelOptions<TLog, TLv> {

        return this._lvOpts[level];
    }

    public createLogger(subject: TLv): dL.ILogger<TLog, TLv> {

        return new Logger<TLog, TLv>(
            subject,
            this._lvOpts,
            this.levels
        ) as dL.ILogger<TLog, TLv>;
    }
}

/**
 * Create a new factory object.
 */
export function createLoggerFactory<
    TData = string,
    const TLv extends string = dL.IDefaultLevels
>(
    levels: readonly TLv[] = dL.DEFAULT_LEVELS as TLv[],
    driver: dL.IDriver = createConsoleDriver(),
    formatter: dL.IFormatter<TData, TLv> = DEFAULT_TEXT_FORMATTER as dL.IFormatter<TData, TLv>,
): dL.IFactory<TData, TLv> {

    return new LoggerFactory(driver, levels, formatter) as unknown as dL.IFactory<TData, TLv>;
}

/**
 * The default factory object.
 */
const factory = createLoggerFactory(dL.DEFAULT_LEVELS);

/**
 * Get the default factory object.
 */
export function getDefaultLoggerFactory(): dL.IFactory<string, dL.IDefaultLevels> {

    return factory;
}
