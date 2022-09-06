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

import Loggers, { createColorfulTTYDriver } from '../lib';

(function builtInColorfulDriver(): void {

    const theColorDriver = createColorfulTTYDriver();

    theColorDriver.foreColor('green', 'info');
    theColorDriver.foreColor('red', 'error');
    theColorDriver.foreColor('yellow', 'warning');
    theColorDriver.foreColor('grey', 'notice');
    theColorDriver.foreColor('cyan', 'debug');

    Loggers.registerDriver('colorful', theColorDriver);

    /**
     * First, create a log controller, giving a subject.
     */
    const logs = Loggers.createTextLogger(
        'Colorful',
        undefined,
        'colorful'
    );

    /**
     * By default, all the levels of logs are muted.
     *
     * Here we use method "unmute" to turn on the output of all levels of logs.
     */
    logs.unmute();

    /**
     * Output a log of INFO level.
     */
    logs.info('This is INFO log.');

    logs.error('This is ERROR log.');

    /**
     * Now the DEBUG logs couldn't be output (No errors, but ignored.)
     */
    logs.debug('This is DEBUG log.');

    logs.enableTrace();

    logs.warning('This is WARNING log.');

    logs.enableTrace(10);

    logs.notice('This is NOTICE log.');

})();
