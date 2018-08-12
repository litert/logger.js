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
import { getDefaultFactory } from "./Factory";
import {
    IFactory,
    DefaultLevels
} from "./Common";

const _default: IFactory<DefaultLevels> = getDefaultFactory();

export default _default;

export * from "./Common";

export * from "./Factory";

export * from "./Formatters";

export * from "./Drivers/Console";

export * from "./Drivers/ColorfulTTY";
