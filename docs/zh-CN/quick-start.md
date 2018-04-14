# 快速入门

## 安装

目前只能通过 NPM 安装：

```sh
npm i @litert/logger -S
```

## Hello world!

```ts
import Loggers from "@litert/logger";

/**
 * 创建一个文本日志控制器。
 */
const logs = Loggers.createTextLogger("app");

/**
 * 默认日志是关闭的，通过 unmute 方法打开所有等级的日志。
 */
logs.unmute();

/**
 * Logger 一共有 debug, info, notice, warning, error 五个日志等级，通过同名方法
 * 调用即可。
 */
logs.debug("Hello");
logs.info("world");

/**
 * 将所有等级的日志都禁止。
 */
logs.mute();

logs.notice("这条日志不会被输出。");

/**
 * 可以将等级名称传递给 mute/unmute 方法，从而禁止或开启指定等级的日志。
 */
logs.unmute("info");

logs.info("INFO 日志又可以输出了。");

logs.debug("但是其它等级的日志还是不会被输出。");

/**
 * 开启 error 等级日志的追踪信息。
 */
logs.enableTrace(true, "error");

logs.unmute("error");

logs.error("This is an error.");

/**
 * 使用完整的追踪信息，而不是只显示写入日志的位置。
 */
logs.useFullTrace();

logs.error("This is an error 2.");
```

## 使用对象日志

有时候日志记录的信息可能包含大量信息，比如错误码，IP 地址之类的，需要进行格式化。
如果每次都在写日志的地方手动格式化就太麻烦了，因此可以使用对象日志控制器。

```ts
import Loggers, { LogLevel } from "@litert/logger";

/**
 * 日志对象的数据结果
 */
interface LogInfo {

    action: string;

    result: number;
}

/**
 * 创建一个主题为 data-logger 的对象日志控制器，第二个参数为日志格式化回调方法。
 */
let log = Loggers.createDataLogger<LogInfo>("data-logger", function(
    data: LogInfo,
    subject: string,
    level: LogLevel,
    date: Date
): string {

    return `[${date.toISOString()}][${level}][${subject}] Executed action ${data.action}, with result ${data.result}.`;
});

log.unmute();

log.debug({
    action: "SendMessage",
    result: 1
});
```

## 使用日志输出驱动

默认日志是输出到控制台的（使用 `console.log`），但是如果需要更高级的，那么可以用自定义
的输出驱动，比如输出到文件。这里举个煎蛋栗子，就不输出到文件了。

```ts
import Loggers, { LogLevel } from "@litert/logger";

interface LogInfo {

    action: string;

    result: number;
}

/**
 * 注册一个新的驱动，名为 driver-sample。
 */
Loggers.registerDriver("driver-sample", {
    log(text: string): void {

        /**
         * 这个驱动和默认驱动不一样的是，它会在日志内容前面加上一句“Sample Driver:”。
         *
         * 注：驱动收到的 text 是文本日志或者已经格式化的对象日志。
         */
        console.log("Sample Driver:", text);
    }
});

let log = Loggers.createDataLogger<LogInfo>("data-logger", function(
    data: LogInfo,
    subject: string,
    level: LogLevel,
    date: Date
): string {

    // tslint:disable-next-line:max-line-length
    return `${date.toISOString()} - ${level} - ${subject} - Executed action ${data.action}, with result ${data.result}.`;

}, "driver-sample"); // 此处指定使用驱动 driver-sample

Loggers.unmute();

log.debug({
    action: "SendMessage",
    result: 1
});
```

## 控制全局日志

使用日志控制器工厂对象的 mute、unmute、enableTrace、useFullTrace 方法可以对所有的
控制器进行配置。以 mute 为例：

```ts
import Loggers from "@litert/logger";

const logs1 = Loggers.createTextLogger("app1");
const logs2 = Loggers.createTextLogger("app2");

Loggers.unmute("debug");

const logs3 = Loggers.createTextLogger("app3");

logs1.debug("test 1");
logs2.debug("test 2");
logs3.debug("test 3");

Loggers.mute("debug");

logs1.debug("test 4");
logs2.debug("test 5");
logs3.debug("test 6");
```
