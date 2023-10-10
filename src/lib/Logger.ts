/**
 *  Copyright 2023 Angus ZENG <fenying@litert.org>
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

import {

    IFormatter,
    IDriver,
    IBaseLogger,
    DEFAULT_LEVELS,
    ILoggerMethod,

} from './Common';

/**
 * Internal settings of each level
 */
export interface ILevelOptions {

    /**
     * If the level is enabled for output.
     */
    'enabled': boolean;

    /**
     * How many lines of stack trace could be logged.
     */
    'trace': number;
}

function createMutedLogMethod<T, TLv extends string>(logger: Logger): ILoggerMethod<T, TLv> {

    return function(): unknown {

        return logger;
    } as ILoggerMethod<T, TLv>;
}

/**
 * Create a logging method, works like a JIT compiler.
 */
function createLogMethod<T, TLv extends string>(
    subject: string,
    level: string,
    traceDepth: number,
    driver: IDriver,
    formatter: IFormatter<T, string>
): ILoggerMethod<T, TLv> {

    const cs: string[] = [];

    cs.push('return function(log, now = new Date()) {');

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

        cs.push('        now,');
        cs.push('        traces');
    }
    else {

        cs.push('        now');
    }

    cs.push('    ),');
    cs.push(`    ${subject},`);
    cs.push(`    ${level},`);
    cs.push('    now');
    cs.push(');');
    cs.push('return this;');

    cs.push('};');

    console.log(cs.join('\n'));

    return (new Function(
        'formatter',
        'driver',
        cs.join('\n')
    ))(
        formatter,
        driver
    );
}

export class Logger implements IBaseLogger<string> {

    /**
     * The options of all levels.
     */
    protected readonly _options: Record<string, ILevelOptions>;

    /**
     * The subject of current logger.
     */
    protected readonly _subject: string;

    /**
     * The log formatter of current logger.
     */
    protected readonly _formatter!: IFormatter<unknown, string>;

    /**
     * The log output driver of current logger.
     */
    protected readonly _driver: IDriver;

    /**
     * The log levels of current logger.
     */
    protected readonly _levels: readonly string[];

    public constructor(
        subject: string,
        driver: IDriver,
        settings: Record<string, ILevelOptions>,
        formatFn: IFormatter<unknown, string>,
        levels: readonly string[] = DEFAULT_LEVELS
    ) {

        this._options = {};

        this._levels = levels;

        this._driver = driver;

        this._subject = subject;

        this._formatter = formatFn;

        for (const lv of levels) {

            this._options[lv] = {
                enabled: settings[lv].enabled,
                trace: settings[lv].trace
            };

            this._updateMethod(lv);
        }
    }

    public flush(): void | Promise<void> {

        return this._driver.flush();
    }

    public getSubject(): string {

        return this._subject;
    }

    public getLevels(): string[] {

        return [...this._levels];
    }

    public enableTrace(depth: number = 1, levels?: string | string[]): this {

        if (!levels || levels.length === 0) {

            levels = this._levels.slice();
        }
        else if (typeof levels === 'string') {

            levels = [ levels ];
        }

        for (const level of levels) {

            this._options[level].trace = depth;
            this._updateMethod(level);
        }

        return this;
    }

    public unmute(levels?: string | readonly string[]): this {

        if (!levels?.length) {

            levels = this._levels;
        }
        else if (typeof levels === 'string') {

            levels = [ levels ];
        }

        for (const level of levels) {

            this._options[level].enabled = true;
            this._updateMethod(level);
        }

        return this;
    }

    public isMuted(level?: string): boolean {

        if (undefined === level) {

            return this._levels.every((lv) => !this._options[lv].enabled);
        }

        return !this._options[level].enabled;
    }

    public mute(levels?: string | readonly string[]): this {

        if (!levels?.length) {

            levels = this._levels;
        }
        else if (typeof levels === 'string') {

            levels = [ levels ];
        }

        for (const level of levels) {

            this._options[level].enabled = false;
            this._updateMethod(level);
        }

        return this;
    }

    protected _updateMethod(lv: string): void {

        // @ts-expect-error
        this[lv] = this._options[lv].enabled ? createLogMethod(
            this._subject,
            lv,
            this._options[lv].trace,
            this._driver,
            this._formatter
        ) : createMutedLogMethod(this);
    }
}
