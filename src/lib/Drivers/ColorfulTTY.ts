/**
 *  Copyright 2022 Angus.Fenying <fenying@litert.org>
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

import { IDriver } from '../Common';

export type IForeColorSet = 'blue' | 'cyan' | 'green' | 'magenta' | 'grey' |
'red' | 'yellow' | 'white' | 'black' | 'default';

export type IBgColorSet = IForeColorSet;

/**
 * @deprecated Use `IForeColorSet` instead.
 */
export type ForeColorSet = IForeColorSet;

/**
 * @deprecated Use `IBgColorSet` instead.
 */
export type BgColorSet = IBgColorSet;

const BG_COLOR_ENDING = '\x1B[49m';
const FORE_COLOR_ENDING = '\x1B[39m';

type Writer = (
    text: string,
    subject: string,
    level: string,
    date: Date
) => void;

function nonColorfulWriter(text: string): void {

    console.log(text);
}

const FORE_COLORS: Record<IForeColorSet, string> = {
    'default': '',
    'blue': '\u001b[34m',
    'cyan': '\u001b[36m',
    'green': '\u001b[32m',
    'magenta': '\u001b[35m',
    'red': '\u001b[31m',
    'yellow': '\u001b[33m',
    'white': '\u001b[37m',
    'grey': '\u001b[90m',
    'black': '\u001b[30m'
};

const BG_COLORS: Record<IBgColorSet, string> = {
    'default': '',
    'white': '\u001b[47m',
    'grey': '\u001b[49;5;8m',
    'black': '\u001b[40m',
    'blue': '\u001b[44m',
    'cyan': '\u001b[46m',
    'green': '\u001b[42m',
    'magenta': '\u001b[45m',
    'red': '\u001b[41m',
    'yellow': '\u001b[43m'
};

export interface IColorfulTTYDriver
    extends IDriver {

    /**
     * Set the fore-color for the logs of a level.
     *
     * @param color The color of the level.
     * @param level Specify the level to be colorified.
     *              If no level specified, then the default color will be set.
     */
    foreColor(color: IForeColorSet, level?: string): this;

    /**
     * Set the background-color for the logs of a level.
     *
     * @param color The color of the level.
     * @param level Specify the level to be colorified.
     *              If no level specified, then the default color will be set.
     */
    bgColor(color: IBgColorSet, level?: string): this;
}

interface IStyle {

    start: string;

    end: string;
}

/**
 * This ugly line is due to the breaking changes after TypeScript 2.9.x.
 *
 * @see https://github.com/Microsoft/TypeScript/issues/24587
 */
const DEFAULT_LEVEL: string = Symbol('__default__') as any;

class ColorfulTTYDriver
implements IColorfulTTYDriver {

    private _foreColors: Record<string, string>;

    private _bgColors: Record<string, string>;

    private _levels: Record<string, IStyle>;

    public constructor() {

        this._bgColors = {
            [DEFAULT_LEVEL]: 'default'
        };
        this._foreColors = {
            [DEFAULT_LEVEL]: 'default'
        };

        this._levels = {
            [DEFAULT_LEVEL]: {
                start: '',
                end: ''
            }
        };

        this.write = this._buildWriter() as any;
    }

    public bgColor(color: IBgColorSet, level?: string): this {

        this._bgColors[level || DEFAULT_LEVEL] = color === 'default' ?
            '' : BG_COLORS[color];

        this._rebuild(level || DEFAULT_LEVEL);

        return this;
    }

    public foreColor(color: IForeColorSet, level?: string): this {

        this._foreColors[level || DEFAULT_LEVEL] = color === 'default' ?
            '' : FORE_COLORS[color];

        this._rebuild(level || DEFAULT_LEVEL);

        return this;
    }

    private _rebuild(level: string/* | symbol*/): void {

        let start: string = '';
        let end: string = '';

        if (this._foreColors[level]) {

            start += this._foreColors[level] || '';
            end = FORE_COLOR_ENDING + end;
        }

        if (this._bgColors[level]) {

            start += this._bgColors[level] || '';
            end = BG_COLOR_ENDING + end;
        }

        this._levels[level] = { start, end };
    }

    public write(): void {

        return;
    }

    public flush(): void {

        // do nothing.
    }

    public close(): void {

        // do nothing.
    }

    public static isTerminal(): boolean {

        return this.isNodeJS() && (
            process.stdout.isTTY ||
            process.stdout.constructor.name === 'Socket' // Debugging
        );
    }

    public static isNodeJS(): boolean {

        try {

            return typeof process.stdout === 'object';
        }
        catch {

            return false;
        }
    }

    private _buildWriter(): Writer {

        if (ColorfulTTYDriver.isTerminal()) {

            return this._buildWriterForTerminal();
        }

        return nonColorfulWriter;
    }

    private _buildWriterForTerminal(): Writer {

        const cs: string[] = [];

        cs.push('return function(text, subject, level, date) {');
        cs.push('const dec = this._levels[level] || this._levels[DEFAULT_LEVEL];');
        cs.push('return console.log(');
        cs.push('    text.split("\\n").map(');
        cs.push('       (x) => `${dec.start}${x}${dec.end}`');
        cs.push('    ).join("\\n")');
        cs.push(');');
        cs.push('};');

        return (new Function(
            'DEFAULT_LEVEL',
            cs.join('\n')
        ))(DEFAULT_LEVEL);
    }
}

/**
 * Create a colorful-tty driver.
 */
export function createColorfulTTYDriver(): IColorfulTTYDriver {

    if (!ColorfulTTYDriver.isTerminal()) {

        console.warn(
            'The ColorfulTTYDriver is only usable in Node.JS terminal.'
        );
    }

    return new ColorfulTTYDriver();
}
