# LiteRT/Logger

[![npm version](https://img.shields.io/npm/v/@litert/logger.svg?colorB=brightgreen)](https://www.npmjs.com/package/@litert/logger "Stable Version")
[![License](https://img.shields.io/npm/l/@litert/logger.svg?maxAge=2592000?style=plastic)](https://github.com/litert/logger/blob/master/LICENSE)
[![node](https://img.shields.io/node/v/@litert/logger.svg?colorB=brightgreen)](https://nodejs.org/dist/latest-v8.x/)
[![GitHub issues](https://img.shields.io/github/issues/litert/logger.js.svg)](https://github.com/litert/logger.js/issues)
[![GitHub Releases](https://img.shields.io/github/release/litert/logger.js.svg)](https://github.com/litert/logger.js/releases "Stable Release")

A logs writer for LiteRT framework.

## Features

- [x] Log stack trace.
- [x] Enable/Disable log levels.
- [x] Custom levels.
- [x] Custom formats.
- [x] Custom output drivers.

## Requirement

- TypeScript v5.0.0 (or newer)
- Node.js v18.0.0 (or newer)

## Installation

Install by NPM:

```sh
npm i @litert/logger --save
```

## Quick Start

Simple usage:

```ts
// The imported module is a LoggerFactory singleton object, so you can use it directly.
import LoggerFactory from "@litert/logger";

const logger = LoggerFactory.createLogger('Demo');

logger.info('Hello, world!');
logger.warning('Hello, world!');

// Now, just disable a level, and it will not be printed.
logger.setLevelOptions({ levels: ['error'], enabled: false });

logger.error('Hello, world! (WILL NOT BE PRINTED)');

// let's turn on the stack trace, print 2 lines of stack trace.
//
// without specifying levels, all levels will be affected.
logger.setLevelOptions({ traceDepth: 2 });

logger.notice('Hello, world!');
```

Use custom log formatter:

```ts
import LoggerFactory from "@litert/logger";

LoggerFactory.setLevelOptions({ enabled: true });

const logger = LoggerFactory.createLogger('Demo');

logger.setLevelOptions({
    formatter: function(log, subj, lv, dt, traces): string {

        if (traces?.length) {

            return `${new Date(dt).toISOString()} - ${subj} - ${lv} - ${log}

  ${traces.join('\n  ')}
`;
        }

        return `${new Date(dt).toISOString()} - ${subj} - ${lv} - ${log}`;
    }
});

logger.info('Hello, world!');
logger.warning('Hello, world!');

logger.setLevelOptions({ traceDepth: 2 });

logger.error('Hello, world!');
```

More Examples:

- [Quick Start](./src/examples/quick-start.ts)
- [Custom log levels](./src/examples/custom-levels.ts)
- [Custom log formatter](./src/examples/custom-formatter.ts)
- [Custom log output driver](./src/examples/custom-driver.ts)
- [Using factory](./src/examples/using-factory.ts)

## License

This library is published under [Apache-2.0](./LICENSE) license.
