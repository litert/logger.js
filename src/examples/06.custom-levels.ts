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
    createFactory
} from '../lib';

/**
 * Define the customized levels of logs.
 */
type MyLevels = 'normal' | 'secure' | 'failure';

const factory1 = createFactory<MyLevels>([
    'normal', 'secure', 'failure'
]);

const logs = factory1.createTextLogger('Test');

logs.unmute();

logs.normal('This is a normal log.');
