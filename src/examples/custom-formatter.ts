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

import LoggerFactory from '../lib';

/**
 * First, create a logger, giving a subject.
 */
const logs1 = LoggerFactory.createLogger('Custom-Formatter 1');

logs1.setLevelOptions({
    formatter: function(log, subj, lv, dt, traces): string {

        if (traces) {

            return `${new Date(dt).toISOString()} - ${subj} - ${lv} - ${log}

  ${traces.join('\n  ')}
`;
        }

        return `${new Date(dt).toISOString()} - ${subj} - ${lv} - ${log}`;
    }
});

/**
 * Output a log of INFO level.
 */
logs1.info('This is INFO log.');

logs1.error('This is ERROR log.');

logs1.setLevelOptions({ traceDepth: 2 });

logs1.debug('This is DEBUG log.');

logs1.warning('This is WARNING log.');

logs1.notice('This is NOTICE log.');
