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
import * as Abstract from "../Abstracts";

class ConsoleDriver implements Abstract.Driver {

    private _name: string;

    public constructor(name: string) {

        this._name = name;
    }

    public get name(): string {

        return this._name;
    }

    public writeText(
        level: Abstract.Level,
        category: string,
        text: string
    ): void {

        // tslint:disable-next-line:no-console
        console.log(text);
        return;
    }

    public writeBinary(
        data: Buffer
    ): void {

        // tslint:disable-next-line:no-console
        console.warn("Cannot output binary log to console.");
        return;
    }

    public async flush(): Promise<void> {

        return Promise.resolve();
    }

    public isBinary(): boolean {

        return false;
    }
}

export function createConsoleDriver(): Abstract.Driver {

    return new ConsoleDriver("console");
}
