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

import Loggers, { IDriver } from '../lib';
import * as fs from 'fs';

class FileLogDriver
implements IDriver {

    private _ws: fs.WriteStream;

    public constructor(file: string) {

        this._ws = fs.createWriteStream(file);
    }

    public write(text: string): void {

        if (this._ws) {

            this._ws.write(text + '\n');
        }
    }

    public flush(): void | Promise<void> {

        // No buffer here
        return;
    }

    public close(): void | Promise<void> {

        this._ws.end();
        delete this._ws;
    }
}

const fd = new FileLogDriver('a.log');

Loggers.registerDriver(
    'file-a',
    fd
);

const logs = Loggers.createTextLogger(
    'Example',
    undefined,
    'file-a'
);

logs.unmute();

logs.info('HI');

logs.debug('Hello');

// eslint-disable-next-line @typescript-eslint/no-floating-promises
fd.close();
