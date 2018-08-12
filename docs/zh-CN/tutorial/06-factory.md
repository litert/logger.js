# 工厂与日志等级

## 1. 创建自定义工厂

至此，与日志控制器有关的内容基本都学完了，最后来看一下控制器工厂的使用。到目前为止，
我们使用的都是默认的控制器工厂，那要如何创建一个控制器工厂呢？

使用 `createFactory` 方法即可，它的声明如下：

```ts
function createFactory<
    L extends string = DefaultLevels
>(levels: L[]): IFactory<L>;
```

这个方法有两个参数：

- 泛型参数 `L` ，指定可以使用的日志等级，这个参数用于静态类型检查和 IDE 自动完成。
- 形参 `levels`，它是 `L` 类型的数组，这个参数才真正起定义日志等级的作用。

也就是说通过 `L` 指定 `levels` 可以输入的值，用于 TypeScript 静态类型检查，和 IDE 的
自动完成、语法提示等。 `levels` 才是真正在运行时定义可用日志等级的参数。

> 对于默认工厂，参数 `L = DefaultLevels`，`levels = DEFAULT_LEVELS`。

例如：

```ts
import Loggers, { createFactory } from "@litert/logger";

/**
 * 定义三种日志等级。
 */
type MyLevels = "normal" | "secure" | "failure";

const factory1 = createFactory<MyLevels>([
    "normal", "secure", "failure"
]);

const logs = factory1.createTextLogger("Test");

logs.unmute();

logs.normal("This is a NORMAL log.");

logs.secure("This is a SECURE log.");
```

## 2. 工厂的基本方法

### 2.1. mute/unmute

类似日志控制器，每个工厂也提供 mute/unmute 方法，这两个方法作用于所有由该工厂创建的
控制器对象。

> 即不同的工厂之间，互不干扰。

```ts
factory.unmute();           // 打开所有等级的日志输出
factory.unmute("debug");    // 打开 DEBUG 等级的日志输出
factory.unmute([            // 打开 INFO 和 ERROR 等级的日志输出
    "info",
    "error"
]);
```

同理，可以用 `mute` 方法关闭各个等级的日志输出。

```ts
factory.mute();           // 关闭所有等级的日志输出
factory.mute("debug");    // 关闭 DEBUG 等级的日志输出
factory.mute([            // 关闭 INFO 和 ERROR 等级的日志输出
    "info",
    "error"
]);
```

### 2.2. enableTrace

类似日志控制器，每个工厂也提供 enableTrace 方法，这个方法作用于所有由该工厂创建的
控制器对象。

```ts
factory.enableTrace();          // 将所有等级的日志追踪信息设置为 1 层。
factory.enableTrace(5);         // 将所有等级的日志追踪信息设置为 5 层。
factory.enableTrace(0);         // 关闭所有等级的日志追踪信息。
factory.enableTrace(0, []);     // 关闭所有等级的日志追踪信息。
factory.enableTrace(            // 将 DEBUG 日志追踪信息设置为 3 层。
    3, "debug"
);
factory.enableTrace(            // 关闭 INFO/ERROR 日志的追踪信息。
    0, ["info", "error"]
);
```

## 2.3. getSubjects

该方法可以获取所有由该工厂创建的控制器对象的主题列表。

## 2.4. getLevels

该方法可以获取所有由该工厂支持的日志等级名称数组。
