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

(function customFormatter(): void {

    /**
     * First, create a log controller, giving a subject and a formater.
     */
    let logs = Loggers.createTextLogger(
        "Custom-Formatter",
        function(log, subj, lv, dt, traces): string {

            if (traces) {

                return `${dt.toISOString()} - ${subj} - ${lv} - ${log}

  ${traces.join("\n  ")}
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
    logs.unmute();

    /**
     * Output a log of INFO level.
     */
    logs.info("This is INFO log.");

    logs.error("This is ERROR log.");

    /**
     * Now the DEBUG logs couldn't be output (No errors, but ignored.)
     */
    logs.debug("This is DEBUG log.");

    logs.enableTrace(true);

    logs.warning("This is WARNING log.");

    logs.useFullTrace(true);

    logs.notice("This is NOTICE log.");

})();
