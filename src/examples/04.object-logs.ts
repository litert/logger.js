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

interface ILogInfo {

    'action': string;

    'user': string;

    'result': 'succeed' | 'failed';
}

(function objectLogs(): void {

    /**
     * First, create a log controller, giving a subject and a formater.
     */
    const logs = Loggers.createDataLogger<ILogInfo>(
        'Object-Formatter',
        function(log, subj, lv, dt, traces): string {

            if (traces) {

                return `${dt.toISOString()} - ${subj} - ${lv} - ${log.user} - ${log.action} - ${log.result}

  ${traces.join('\n  ')}
`;
            }

            return `${dt.toISOString()} - ${subj} - ${lv} - ${log.user} - ${log.action} - ${log.result}`;
        }
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
    logs.info({
        action: 'Login',
        user: 'admin',
        result: 'succeed'
    });

    logs.error({
        action: 'Login',
        user: 'admin',
        result: 'failed'
    });

    /**
     * Now the DEBUG logs couldn't be output (No errors, but ignored.)
     */
    logs.debug({
        action: 'Login',
        user: 'sofia',
        result: 'failed'
    });

    logs.enableTrace();

    logs.warning({
        action: 'DeleteAccount',
        user: 'sofia',
        result: 'succeed'
    });

    logs.enableTrace(10);

    logs.notice({
        action: 'RegisterAccount',
        user: 'john',
        result: 'succeed'
    });

})();
