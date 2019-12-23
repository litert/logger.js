# 日志格式化

## 格式化函数

我们注意到，日志的输出都是如下格式的

```
[2018-08-12T07:57:23.400Z][info] Text-Log: Hello world!
```

也就是

```
[yyyy-mm-ddThh:mm:ss.###Z][LEVEL] SUBJECT: LOG_TEXT
```

这样的格式。

如果希望换一个格式怎么办呢？很简单，来看看日志控制器工厂的 `createTextLogger` 方法。

```ts
public createTextLogger(
    subject?: string,
    formatter?: IFormatter<string, L>,
    driver?: string
): ILogger<string, L>;
```

第一个参数 `subject` 我们已经知道，是控制器的主题。
第二个参数 `formatter` 是我们要关注的格式化方法。

> 暂且忽略第三个参数，将在后文中提到。

`formatter` 是一个 `IFormatter<string, L>` 类型的参数，来看看 `IFormatter`
的定义。


```ts
/**
 * 一个用于格式化日志为字符串的函数。
 *
 * @param log       日志的输入内容。
 * @param subject   日志的主题。
 * @param level     日志等级。
 * @param date      日志写入时间。
 * @param traces    日志的追踪信息。
 */
export type IFormatter<T, L extends string> = (
    log: T,
    subject: string,
    level: L,
    date: Date,
    traces?: string[]
) => string;
```

> -   对于文本日志，`T` 总是 `string`。
> -   对于默认的日志控制器工厂，`L` 总是 `DefaultLevels`。也就是
>
>     ```ts
>     type DefaultLevels = "error" | "notice" | "warning" |
>                          "debug" | "info";
>     ```

因此，它其实是一个函数，将日志的内容进行处理，返回格式化之后的文本内容。

根据上面的信息，我们可以实现一个自定义的格式化函数：

```ts
const log = Loggers.createTextLogger(
    "Custom-Formatter",
    function(text, subject, level, date, traces): string {

        let ret = `${date} - ${subject} - ${level} - ${text}`;

        if (traces) {

            ret += `\nTrace Stack:\n  ${traces.join("\n  ")}`;
        }

        return ret;
    }
);

log.info("Hello");

log.enableTrace();

log.info("world");
```

尝试运行，可以得到如下输出：

```
Sun Aug 12 2018 17:04:26 GMT+0800 (中国标准时间) - Custom-Formatter - info - Hello
Sun Aug 12 2018 17:04:26 GMT+0800 (中国标准时间) - Custom-Formatter - info - world
Trace Stack:
  formatterDemo (/home/fenying/logger/samples/demo.js:99:4)
```

## 预注册格式化函数

通常来说，一个格式化函数是反复使用的，所以，可以通过 `IFactory.registerTextFormatter` 和
`IFactory.registerDataFormatter` 两个方法，将一个格式化函数进行预注册，然后通过注册的名称即可使用。

```ts

Loggers.registerTextFormatter(
    "custom_formatter_1",
    function(text, subject, level, date, traces): string {

        let ret = `${date} - ${subject} - ${level} - ${text}`;

        if (traces) {

            ret += `\nTrace Stack:\n  ${traces.join("\n  ")}`;
        }

        return ret;
    }
);

const log = Loggers.createTextLogger(
    "Custom-Formatter",
    "custom_formatter_1"
);

log.info("Hello");
```
