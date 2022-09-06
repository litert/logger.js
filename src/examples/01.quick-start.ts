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

import Loggers from '../lib';

(function quickStart(): void {

    /**
     * First, create a log controller, giving a subject.
     */
    const logs = Loggers.createTextLogger('Quick-Start');

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
     * You can mute a specific level of logs, e.g. mute the DEBUG level.
     */
    logs.mute('debug');

    /**
     * Now the DEBUG logs couldn't be output (No errors, but ignored.)
     */
    logs.debug('This is DEBUG log but it won\'t be output because it\'s muted.');

    logs.warning('This is WARNING log.');

    logs.notice('This is NOTICE log.');

    /**
     * Also, unmuting a specific level is allowed.
     */
    logs.unmute('debug');

    /**
     * Now the DEBUG logs will be output.
     */
    logs.debug('This is DEBUG log.');

    /**
     * If you wanna trace where the log is logged, just turn on the log-tracing.
     * And now the calling spot will be appended after the logs' output.
     */
    logs.enableTrace();

    logs.info('This is INFO log.');

    /**
     * Or if you wanna print the whole calling-stack?
     */
    logs.enableTrace(10);

    logs.notice('This is NOTICE log.');

    logs.enableTrace(0);

    /**
     * And you can turn on the whole calling-stack for DEBUG level only.
     */
    logs.enableTrace(10, 'debug');

    logs.error('This is ERROR log.');

    logs.debug('This is DEBUG log.');

    logs.enableTrace(0);

    /**
     * Besides, you can pass a Date object for the log, instead of the current
     * time.
     */
    logs.debug('See the log time', new Date('2018-02-01 11:22:33.233'));

    /**
     * And you can mute levels for all log controllers at once.
     */
    const logs2 = Loggers.createTextLogger('Quick-Start-2');

    logs2.unmute();

    Loggers.mute();

    logs.info('This will not be output.');

    logs2.info('This will not be output.');

    /**
     * So can you unmute all log controllers at once too.
     */
    Loggers.unmute();

    logs.info('This will be output.');

    logs2.info('This will be output.');

    /**
     * Or just mute specific level for all levels.
     */
    Loggers.mute('debug');

    logs.debug('This will not be output.');

    logs2.debug('This will not be output.');

    logs.error('This will be output.');

    logs2.error('This will be output.');

})();
