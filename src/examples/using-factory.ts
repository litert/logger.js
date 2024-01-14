/**
 *  Copyright 2024 Angus ZENG <fenying@litert.org>
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

import * as LibLogs from '../lib';

interface ILogInfo {

    'action': string;

    'user': string;

    'result': string;
}

const formatter = function(log, subj, lv, dt, traces): string {

    if (traces) {

        return `${new Date(dt).toISOString()} - ${subj} - ${lv} - ${log.user} - ${log.action} - ${log.result}

${traces.join('\n  ')}
`;
    }

    return `${new Date(dt).toISOString()} - ${subj} - ${lv} - ${log.user} - ${log.action} - ${log.result}`;

} as LibLogs.IFormatter<ILogInfo, LibLogs.IDefaultLevels>;

const factory1 = LibLogs.createLoggerFactory(LibLogs.DEFAULT_LEVELS, undefined, formatter);
const factory2 = LibLogs.createLoggerFactory(LibLogs.DEFAULT_LEVELS, undefined, formatter);

factory2.setLevelOptions({ enabled: false });
/**
 * First, create a logger, giving a subject.
 */
const logger1 = factory1.createLogger('Using-Factory-1');
const logger2 = factory2.createLogger('Using-Factory-2');

/**
 * Output a log of INFO level.
 */
logger1.info({
    action: 'Login',
    user: 'admin',
    result: 'succeed'
});

/**
 * The logs from logger created by factory2 won't be output.
 * Because loggers from different factory are isolated.
 */
logger2.info({
    action: 'Login',
    user: 'admin',
    result: 'succeed'
});

logger1.error({
    action: 'Login',
    user: 'admin',
    result: 'failed'
});

// Now changed the default level settings for factory2.
factory2.setLevelOptions({ enabled: true });

/**
 * However, the logs from loggers created by factory2 before are still muted.
 */
logger2.info({
    action: 'Login',
    user: 'admin',
    result: 'needs 2fa'
});

const logger3 = factory2.createLogger('Using-Factory-2-New');

/**
 * The new loggers created by factory2 now will be output.
 */
logger3.info({
    action: 'Login',
    user: 'admin',
    result: 'password incorrect'
});
