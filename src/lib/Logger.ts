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

import { ILevelOptions } from "./Internal";
import {

    ILogFormatter,
    ILogDriver,
    IBaseLogger,
    DEFAULT_LEVEL_NAMES

} from "./Common";

function _emptyLogMethod(this: Logger, x: string) {

    return this;
}

function createLogMethod(
    subject: string,
    level: string,
    tracing: boolean,
    fullTrace: boolean,
    driver: ILogDriver,
    formatter: ILogFormatter<any, string>,
    textInput: boolean
): any {

    let cs: string[] = [];

    cs.push(`return function(log, now = new Date()) {`);

    if (tracing) {

        cs.push('let tmpObj = {};');
        cs.push(`Error.captureStackTrace(tmpObj, this.${level});`);

        if (fullTrace) {

            cs.push('let traces = tmpObj.stack.split(/\\n\\s+at\\s+/).slice(1);');
        }
        else {

            cs.push('let traces = [tmpObj.stack.split(/\\n\\s+at\\s+/)[1]];');
        }
    }

    subject = subject.replace(/"/g, "\\\"");
    level = level.replace(/"/g, "\\\"");

    cs.push(`driver.write(`);
    cs.push(`    formatter(`);
    cs.push(`        log,`);
    cs.push(`        "${subject}",`);
    cs.push(`        "${level}",`);

    if (tracing) {

        cs.push(`        now,`);
        cs.push(`        traces`);
    }
    else {

        cs.push(`        now`);
    }

    cs.push(`    ),`);
    cs.push(`    "${subject}",`);
    cs.push(`    "${level}",`);
    cs.push(`    now`);
    cs.push(`);`);
    cs.push(`return this;`);

    cs.push(`};`);

    return (new Function(
        "formatter",
        "driver",
        cs.join("\n")
    ))(
        formatter,
        driver
    );
}

class Logger
implements IBaseLogger<string> {

    /**
     * The options
     */
    protected _options: Record<string, ILevelOptions>;

    protected _subject: string;

    protected _formatter!: ILogFormatter<any, string>;

    protected _driver: ILogDriver;

    protected _levels: string[];

    public constructor(
        subject: string,
        driver: ILogDriver,
        settings: Record<string, ILevelOptions>,
        wraper?: ILogFormatter<any, string>,
        levels: string[] = DEFAULT_LEVEL_NAMES
    ) {

        this._options = {};

        this._levels = levels;

        this._driver = driver;

        this._subject = subject;

        this._formatter = <any> wraper;

        for (let lv of levels) {

            this._options[lv] = {
                enabled: settings[lv].enabled,
                trace: settings[lv].trace,
                fullTrace: settings[lv].fullTrace
            };

            this._updateMethod(lv);
        }
    }

    public getSubject(): string {

        return this._subject;
    }

    public useFullTrace(enable: boolean = true, lv?: string): this {

        if (lv !== undefined) {

            this._options[lv].fullTrace = enable;
            this._updateMethod(lv);
        }
        else {

            for (let level in this._options) {

                this._options[level].fullTrace = enable;
                this._updateMethod(<any> level);
            }
        }

        return this;
    }

    public enableTrace(enable: boolean = true, lv?: string): this {

        if (lv !== undefined) {

            this._options[lv].trace = enable;
            this._updateMethod(lv);
        }
        else {

            for (let level in this._options) {

                this._options[level].trace = enable;
                this._updateMethod(<any> level);
            }
        }

        return this;
    }

    public unmute(lv?: string): this {

        if (lv !== undefined) {

            this._options[lv].enabled = true;
            this._updateMethod(lv);
        }
        else {

            for (let level in this._options) {

                this._options[level].enabled = true;
                this._updateMethod(<any> level);
            }
        }

        return this;
    }

    public mute(lv?: string): this {

        if (lv !== undefined) {

            this._options[lv].enabled = false;
            this._updateMethod(lv);
        }
        else {

            for (let level in this._options) {

                this._options[level].enabled = false;
                this._updateMethod(<any> level);
            }
        }

        return this;
    }

    protected _updateMethod(lv: string): void {

        // @ts-ignore
        this[lv] = this._options[lv].enabled ? createLogMethod(
            this._subject,
            lv,
            this._options[lv].trace,
            this._options[lv].fullTrace,
            this._driver,
            this._formatter
        ) : _emptyLogMethod;
    }
}

export default Logger;
