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

// tslint:disable:no-console

import { ILogDriver } from "./Common";

export type ForeColorSet = "blue" | "cyan" | "green" | "magenta" | "grey" |
                            "red" | "yellow" | "white" | "black" | "default";

export type BgColorSet = ForeColorSet;

const BG_COLOR_ENDING = "\x1B[49m";
const FORE_COLOR_ENDING = "\x1B[39m";

const FORE_COLORS: Record<ForeColorSet, string> = {
    "default": "",
    "blue": "\u001b[34m",
    "cyan": "\u001b[36m",
    "green": "\u001b[32m",
    "magenta": "\u001b[35m",
    "red": "\u001b[31m",
    "yellow": "\u001b[33m",
    "white": "\u001b[37m",
    "grey": "\u001b[90m",
    "black": "\u001b[30m"
};

const BG_COLORS: Record<BgColorSet, string> = {
    "default": "",
    "white": "\u001b[47m",
    "grey": "\u001b[49;5;8m",
    "black": "\u001b[40m",
    "blue": "\u001b[44m",
    "cyan": "\u001b[46m",
    "green": "\u001b[42m",
    "magenta": "\u001b[45m",
    "red": "\u001b[41m",
    "yellow": "\u001b[43m"
};

export interface IColorfulConsoleDriver
extends ILogDriver {

    foreColor(color: ForeColorSet, level?: string): this;

    bgColor(color: BgColorSet, level?: string): this;
}

interface IStyle {

    start: string;

    end: string;
}

const DEFAULT_LEVEL = Symbol("__default__");

class ColorfulConsoleDriver
implements IColorfulConsoleDriver {

    private _foreColors: Record<string, string>;

    private _bgColors: Record<string, string>;

    private _levels: Record<string, IStyle>;

    public constructor() {

        this._bgColors = {
            [DEFAULT_LEVEL]: ""
        };
        this._foreColors = {
            [DEFAULT_LEVEL]: ""
        };

        this._levels = {
            [DEFAULT_LEVEL]: {
                start: "",
                end: ""
            }
        };
    }

    public bgColor(color: BgColorSet, level?: string): this {

        this._bgColors[level || DEFAULT_LEVEL] = color === "default" ?
            "" : BG_COLORS[color];

        this._rebuild(level || DEFAULT_LEVEL);

        return this;
    }

    public foreColor(color: ForeColorSet, level?: string): this {

        this._foreColors[level || DEFAULT_LEVEL] = color === "default" ?
            "" : FORE_COLORS[color];

        this._rebuild(level || DEFAULT_LEVEL);

        return this;
    }

    private _rebuild(level: string | symbol): void {

        let start: string = "";
        let end: string = "";

        if (this._foreColors[level]) {

            start += this._foreColors[level] || "";
            end = FORE_COLOR_ENDING + end;
        }

        if (this._bgColors[level]) {

            start += this._bgColors[level] || "";
            end = BG_COLOR_ENDING + end;
        }

        this._levels[level] = { start, end };
    }

    public write(
        text: string,
        subject: string,
        level: string,
        date: Date
    ): void {

        const dec = this._levels[level] || this._levels[DEFAULT_LEVEL];

        return console.log(
            text.split("\n").map(
                (x) => `${dec.start}${x}${dec.end}`
            ).join("\n")
        );
    }

    public flush(): void {

        // do nothing.
    }

    public close(): void {

        // do nothing.
    }
}

export function createColorfulConsoleDriver(): IColorfulConsoleDriver {

    return new ColorfulConsoleDriver();
}
