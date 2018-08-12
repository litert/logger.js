# 基本使用

## 1. 文本日志

通常日志都是写入一些文本记录。

先来看一个例子：

```ts
/**
 * 导入 Logger 库，并命名为 Loggers。
 *
 * 此处 Loggers 其实是一个日志控制器工厂对象，用来创建不同的日志控制器对象。
 */
import Loggers from "@litert/logger";

/**
 * 使用日志控制器工厂对象创建一个主题为 Text-Log 的文本日志控制器对象。
 */
let log = Loggers.createTextLogger("Text-Log");

/**
 * 默认情况下，所有的日志都是被关闭输出的，通过 unmute 方法可以打开一个或者所有等级的
 * 日志的输出。
 */
log.unmute();

/**
 * 好了，现在可以输出日志，来输出一条 INFO 等级的日志试试。
 */
log.info("Hello world!");
```

编译并运行上面的代码，将会看到一行输出如下：

```
[2018-08-12T07:57:23.400Z][info] Text-Log: Hello world!
```

## 2. 基本概念

上面的代码里，我们接触到了如下概念：

- 日志控制器
- 日志控制器工厂
- 日志等级

让我逐个解释下。

### 2.1. 日志控制器

日志控制器是指直接在代码里用来输出日志的对象，也就是上面代码里面的 `log` 变量，它是
一个仅支持文本输入的日志控制器对象。

### 2.2. 日志控制器工厂

正如字面意思，日志控制器是由一个工厂对象创建的，这个工厂对象就叫做**日志控制器工厂**。
我们通过 TypeScript 的 `import` 语法导入了 `Loggers` 这个变量，其实它是一个默认的
日志控制器工厂对象，你也可以再创建一个新的日志控制器工厂，具体请看后文。

### 2.3. 日志等级

日志是用来记录程序运行过程中的一些事件的，不同事件的重要程度不同，这个程度也就是
“日志等级”。日志有多少个等级是在创建日志控制工厂时就确定的，其下所有日志控制器都有
相同的日志等级，

> 默认日志控制器工厂提供 `debug`、`info`、`error`、`warning`、`notice` 五个等级。
> 如果不能满足，请尝试创建新的日志控制器工厂。

## 3. 日志控制器的基本方法

### 3.1. mute/unmute 方法

前面提到，所有日志等级都是默认关闭输出的，可以使用日志控制器的 `unmute` 方法打开。

```ts
log.unmute();           // 打开所有等级的日志输出
log.unmute("debug");    // 打开 DEBUG 等级的日志输出
log.unmute([            // 打开 INFO 和 ERROR 等级的日志输出
    "info",
    "error"
]);
```

同理，可以用 `mute` 方法关闭各个等级的日志输出。

```ts
log.mute();           // 关闭所有等级的日志输出
log.mute("debug");    // 关闭 DEBUG 等级的日志输出
log.mute([            // 关闭 INFO 和 ERROR 等级的日志输出
    "info",
    "error"
]);
```

### 3.2. 日志输出方法

使用日志等级名称相同的方法名，即可输出该等级的日志，例如：

```ts
log.error("This is a piece of ERROR log.");
log.warning("This is a piece of WARNING log.");
log.notice("This is a piece of NOTICE log.");
log.info("This is a piece of INFO log.");
log.debug("This is a piece of DEBUG log.");
```

这些日志输出方法声明如下：（以 `error` 为例）

```ts
public error(
    log: string,
    data?: Date
): this;
```

可见，它都返回日志控制器对象本身。所以上面的代码可以用链式写法：

```ts
log.error("This is a piece of ERROR log.")
.warning("This is a piece of WARNING log.")
.notice("This is a piece of NOTICE log.")
.info("This is a piece of INFO log.")
.debug("This is a piece of DEBUG log.");
```

此外，我们注意到它还有第二个参数，一个可选的 Date 类型的参数。这个参数用于指定日志的
发生时间，如果省略，则会使用系统当前时间，例如：

```ts
log.info("Using default.");
log.info("Using custom time.", new Date("2018-02-01 00:00:00"));
```

### 3.3. 日志追踪

很多时候，日志都是用于调试的，那么很可能需要得到日志的写入位置。那么，可以使用
日志控制器的 `enableTrace` 方法。

```ts
log.enableTrace(); // 打开所有等级日志的追踪信息。
log.info("See the trace info below.");
```

将会看到类型如下的输出：

```
[2018-08-12T08:32:08.341Z][info] Trace: See the trace info below.
  at traceDemo (/home/fenying/logger/samples/demo.js:58:4)
```

可以看到日志的输出位置。

该方法声明如下：

```ts
public enableTrace(
    depth: number = 1,
    levels?: string | string[]
): this;
```

第一个参数指定要显示的调用栈深度，设置为 0 则不显示。
第二个参数指定要配置的日志等级，默认是配置所有的日志等级。

例如：

```ts
log.enableTrace();          // 将所有等级的日志追踪信息设置为 1 层。
log.enableTrace(5);         // 将所有等级的日志追踪信息设置为 5 层。
log.enableTrace(0);         // 关闭所有等级的日志追踪信息。
log.enableTrace(0, []);     // 关闭所有等级的日志追踪信息。
log.enableTrace(            // 将 DEBUG 日志追踪信息设置为 3 层。
    3, "debug"
);
log.enableTrace(            // 关闭 INFO/ERROR 日志的追踪信息。
    0, ["info", "error"]
);
```
