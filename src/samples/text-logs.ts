/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import Loggers from "../lib";

const logs1 = Loggers.createTextLogger("app1");
const logs2 = Loggers.createTextLogger("app2");

Loggers.unmute("debug");

const logs3 = Loggers.createTextLogger("app3");

logs1.debug("test 1");
Loggers.enableTrace(true);
logs2.debug("test 2");
Loggers.useFullTrace(true);
logs3.debug("test 3");

Loggers.mute("debug");

logs1.debug("test 4");
logs2.debug("test 5");
logs3.debug("test 6");
