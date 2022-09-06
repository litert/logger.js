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

import {
    createFactory,
    DEFAULT_LEVELS
} from '../lib';

interface ILogInfo {

    'action': string;

    'user': string;

    'result': 'succeed' | 'failed';
}

(function objectLogs(): void {

    const factory1 = createFactory(DEFAULT_LEVELS);
    const factory2 = createFactory(DEFAULT_LEVELS);

    /**
     * First, create a log controller, giving a subject.
     */
    const logs1 = factory1.createDataLogger<ILogInfo>(
        'Using-Factory-1',
        function(log, subj, lv, dt, traces): string {

            if (traces) {

                return `${dt.toISOString()} - ${subj} - ${lv} - ${log.user} - ${log.action} - ${log.result}

  ${traces.join('\n  ')}
`;
            }

            return `${dt.toISOString()} - ${subj} - ${lv} - ${log.user} - ${log.action} - ${log.result}`;
        }
    );

    const logs2 = factory2.createDataLogger<ILogInfo>(
        'Using-Factory-2',
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
     * Unmute all levels for all log controllers created by factory1.
     */
    factory1.unmute();

    /**
     * Output a log of INFO level.
     */
    logs1.info({
        action: 'Login',
        user: 'admin',
        result: 'succeed'
    });

    /**
     * The logs from controller created by factory2 won't be output.
     * Because controllers from different factory are isolated.
     */
    logs2.info({
        action: 'Login',
        user: 'admin',
        result: 'succeed'
    });

    logs1.error({
        action: 'Login',
        user: 'admin',
        result: 'failed'
    });

    /**
     * Now the DEBUG logs couldn't be output (No errors, but ignored.)
     */
    logs1.error({
        action: 'Login',
        user: 'sofia',
        result: 'failed'
    });

    logs1.enableTrace();

    logs1.warning({
        action: 'DeleteAccount',
        user: 'sofia',
        result: 'succeed'
    });

    logs1.enableTrace(10);

    logs1.debug({
        action: 'RegisterAccount',
        user: 'john',
        result: 'succeed'
    });

})();
