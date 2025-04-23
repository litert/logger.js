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

import LoggerFactory from '../lib';

(function quickStart(): void {

    /**
     * First, create a logger, giving a subject.
     */
    const loggerA = LoggerFactory.createLogger('A');

    /**
     * Output a log of INFO level.
     */
    loggerA.info('This is INFO log.');

    loggerA.error('This is ERROR log.');

    /**
     * You can mute a specific level of logs, e.g. mute the DEBUG level.
     */
    loggerA.setLevelOptions({ levels: 'debug', enabled: false });

    /**
     * Now the DEBUG logs couldn't be output (No errors, but ignored.)
     */
    loggerA.debug('This is DEBUG log but it won\'t be output because it\'s muted.');

    loggerA.warning('This is WARNING log.');

    loggerA.notice('This is NOTICE log.');

    /**
     * Also, unmute a specific level is allowed.
     */
    loggerA.setLevelOptions({ levels: 'debug', enabled: true });

    /**
     * Now the DEBUG logs will be output.
     */
    loggerA.debug('This is DEBUG log.');

    /**
     * If you wanna trace where the log is logged, just turn on the log-tracing.
     * And now the calling spot will be appended after the logs' output.
     */
    loggerA.setLevelOptions({ 'traceDepth': 2 });

    loggerA.info('This is INFO log with at most 2 lines of stack traces.');

    /**
     * Or if you wanna print the whole calling-stack?
     */
    loggerA.setLevelOptions({ 'traceDepth': 10 });

    loggerA.notice('This is NOTICE log with at most 10 lines of stack traces.');

    loggerA.setLevelOptions({ 'traceDepth': 0 });

    /**
     * And you can turn on the whole calling-stack for DEBUG level only.
     */
    loggerA.setLevelOptions({ levels: 'debug', 'traceDepth': 10 });

    loggerA.error('This is ERROR log without stack traces.');

    loggerA.debug('This is DEBUG log with at most 10 lines of stack traces.');

    loggerA.setLevelOptions({ 'traceDepth': 0 });

    /**
     * Besides, you can pass a Date object for the log, instead of the current
     * time.
     */
    loggerA.debug('See the log time', Date.parse('2018-02-01 11:22:33.233'));

    /**
     * Change the default options for new loggers.
     *
     * Will not affect the existing loggers.
     */
    LoggerFactory.setLevelOptions({ levels: ['error', 'debug', 'warning'], enabled: false });

    const loggerB = LoggerFactory.createLogger('B');

    loggerB.info('This is INFO log.');

    loggerB.error('This is ERROR log. but will not be output.');

    loggerB.debug('This is DEBUG log. but will not be output.');

    loggerA.setLevelOptions({ enabled: false });

    loggerB.warning('This is WARNING log. but will not be output.');
})();

(function testClone(): void {

    console.log('------------------ Clone Method ------------------');

    const loggerA = LoggerFactory.createLogger('A');

    loggerA.setLevelOptions({ enabled: true });
    loggerA.setLevelOptions({ enabled: false, levels: 'debug' });

    loggerA.info('This is INFO log.');
    loggerA.debug('This is DEBUG log but will not be output.');

    const loggerB = loggerA.clone();

    loggerB.setSubject('B');

    loggerB.info('This is INFO log from B.');
    loggerB.debug('This is DEBUG log from B but will not be output.');

    loggerA.setLevelOptions({ enabled: true, levels: 'debug' });
    loggerA.debug('This is DEBUG log from A and will be output.');
    loggerB.debug('This is DEBUG log from B but will not be output.');
})();
