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

import type * as dL from './Decl';

/**
 * Create a logging method, works like a JIT compiler.
 */
function createLogMethod<T, TLv extends string>(
    subject: string,
    level: string,
    traceDepth: number,
    driver: dL.IDriver,
    formatter: dL.IFormatter<T, TLv>
): dL.ILoggerMethod<T, TLv> {

    const cs: string[] = [];

    cs.push('return function(log, dt = Date.now()) {');

    subject = JSON.stringify(subject);
    level = JSON.stringify(level);

    if (traceDepth) {

        cs.push('let tmpObj = {};');
        cs.push(`Error.captureStackTrace(tmpObj, this[${level}]);`);

        cs.push('let traces = tmpObj.stack.split(');
        cs.push('   /\\n\\s+at\\s+/');
        cs.push(`).slice(1, ${traceDepth + 1});`);
    }

    cs.push('driver.write(');
    cs.push('    formatter(');
    cs.push('        log,');
    cs.push(`        ${subject},`);
    cs.push(`        ${level},`);

    if (traceDepth) {

        cs.push('        dt,');
        cs.push('        traces');
    }
    else {

        cs.push('        dt');
    }

    cs.push('    ),');
    cs.push(`    ${subject},`);
    cs.push(`    ${level},`);
    cs.push('    dt');
    cs.push(');');
    cs.push('return this;');

    cs.push('};');

    return (new Function(
        'formatter',
        'driver',
        cs.join('\n')
    ))(
        formatter,
        driver
    );
}

export class Logger<TLog, TLv extends string> implements dL.IBaseLogger<TLog, TLv> {

    private readonly _mutedLogger = (): this => this;

    protected readonly _options: Record<string, dL.ILevelOptions<TLog, TLv>> = {};

    public constructor(
        public readonly subject: string,
        defaultOptions: Record<string, dL.ILevelOptions<TLog, TLv>>,
        public readonly levels: readonly TLv[]
    ) {

        for (const lv of levels) {

            this.setLevelOptions({
                ...defaultOptions[lv],
                'levels': lv
            });
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

            this._options[lv] = {
                'traceDepth': Math.max(0, options.traceDepth ?? this._options[lv]?.traceDepth ?? 0),
                'enabled': options.enabled ?? this._options[lv]?.enabled ?? true,
                'driver': options.driver ?? this._options[lv].driver,
                'formatter': options.formatter ?? this._options[lv].formatter,
            };

            this._updateMethod(lv);
        }

        return this;
    }

    public getLevel(level: TLv): dL.ILevelOptions<TLog, TLv> {

        return this._options[level];
    }

    public clone(): this {

        const logger = new Logger<TLog, TLv>(
            this.subject,
            { ...this._options },
            this.levels
        );

        for (const lv of this.levels) {

            logger.setLevelOptions({
                levels: lv,
                ...this.getLevel(lv),
            });
        }

        return logger as this;
    }

    public setSubject(subject: string): this {

        if (this.subject === subject) {

            return this;
        }

        Object.assign(this, { subject });

        for (const lv of this.levels) {

            this._updateMethod(lv);
        }

        return this;
    }

    protected _updateMethod(lv: string): void {

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this[lv] = this._options[lv].enabled ? createLogMethod<TLog, TLv>(
            this.subject,
            lv,
            this._options[lv].traceDepth,
            this._options[lv].driver,
            this._options[lv].formatter
        ) : this._mutedLogger;
    }
}
