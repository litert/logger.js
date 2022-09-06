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

class ConsoleDriver
implements IDriver {

    public write(text: string): void {

        console.log(text);
    }

    public flush(): void {

        // do nothing.
    }

    public close(): void {

        // do nothing.
    }
}

/**
 * Create a console driver.
 */
export function createConsoleDriver(): IDriver {

    return new ConsoleDriver();
}
