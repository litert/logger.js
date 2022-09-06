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

(function customFormatter(): void {

    /**
     * First, create a log controller, giving a subject and a formater.
     */
    const logs1 = Loggers.createTextLogger(
        'Custom-Formatter 1',
        function(log, subj, lv, dt, traces): string {

            if (traces) {

                return `${dt.toISOString()} - ${subj} - ${lv} - ${log}

  ${traces.join('\n  ')}
`;
            }

            return `${dt.toISOString()} - ${subj} - ${lv} - ${log}`;
        }
    );

    /**
     * By default, all the levels of logs are muted.
     *
     * Here we use method "unmute" to turn on the output of all levels of logs.
     */
    logs1.unmute();

    /**
     * Output a log of INFO level.
     */
    logs1.info('This is INFO log.');

    logs1.error('This is ERROR log.');

    /**
     * Now the DEBUG logs couldn't be output (No errors, but ignored.)
     */
    logs1.debug('This is DEBUG log.');

    logs1.enableTrace();

    logs1.warning('This is WARNING log.');

    logs1.enableTrace(10);

    logs1.notice('This is NOTICE log.');

    /**
     * Or used a pre-registered formatter.
     */

    /**
     * First, create a log controller, giving a subject and a formater.
     */
    Loggers.registerTextFormatter(
        'custom_text_formatter',
        function(log, subj, lv, dt, traces): string {

            if (traces) {

                return `${dt.toISOString()} - ${subj} - ${lv} - ${log}

  ${traces.join('\n  ')}
`;
            }

            return `${dt.toISOString()} - ${subj} - ${lv} - ${log}`;
        }
    );

    const logs2 = Loggers.createTextLogger(
        'Custom-Formatter 2',
        'custom_text_formatter'
    );

    /**
     * By default, all the levels of logs are muted.
     *
     * Here we use method "unmute" to turn on the output of all levels of logs.
     */
    logs2.unmute();

    /**
     * Output a log of INFO level.
     */
    logs2.info('This is INFO log.');

    logs2.error('This is ERROR log.');

    /**
     * Now the DEBUG logs couldn't be output (No errors, but ignored.)
     */
    logs2.debug('This is DEBUG log.');

    logs2.enableTrace();

    logs2.warning('This is WARNING log.');

    logs2.enableTrace(10);

    logs2.notice('This is NOTICE log.');
})();
