# Logger API 文档

## 抽象接口类 Logger

Logger 抽象接口类描述了一个日志控制器的基本方法。

### 方法 debug

```ts
function debug(log: T): Logger<T>;
```

该方法用于输出一条 DEBUG 等级的日志。

### 方法 error

```ts
function error(log: T): Logger<T>;
```

该方法用于输出一条 ERROR 等级的日志。

### 方法 getSubject

```ts
function getSubject(): string;
```

该方法用于获取当前控制器的主题。

### 方法 info

```ts
function info(log: T): Logger<T>;
```

该方法用于输出一条 INFO 等级的日志。

### 方法 notice

```ts
function notice(log: T): Logger<T>;
```

该方法用于输出一条 NOTICE 等级的日志。

### 方法 warning

```ts
function warning(log: T): Logger<T>;
```

该方法用于输出一条 WARNING 等级的日志。

### 方法 mute

```ts
function mute(
    lv?: LogLevel
): Logger<T>;
```

该方法用于关闭当前控制器的全部或者指定等级的日志输出。

> 当参数 lv 省略时，则对所有等级的日志都生效。

### 方法 unmute

```ts
function unmute(
    lv?: LogLevel
): Logger<T>;
```

该方法用于开启当前控制器的全部或者指定等级的日志输出。

> 当参数 lv 省略时，则对所有等级的日志都生效。

### 方法 enableTrace

```ts
function enableTrace(
    enable: boolean = true,
    lv?: LogLevel
): Logger<T>;
```

该方法用于开启或关闭当前控制器的全部或者指定等级的追踪信息。

> 当参数 lv 省略时，则对所有等级的日志都生效。

### 方法 useFullTrace

```ts
function useFullTrace(
    enable: boolean = true,
    lv?: LogLevel
): Logger<T>;
```

该方法用于开启或关闭当前控制器的全部或者指定等级的完整追踪信息。

> 当参数 lv 省略时，则对所有等级的日志都生效。

## 抽象接口类 LoggerFactory

LoggerFactory 抽象接口类描述了一个日志控制器工厂的基本方法。

### 方法 createTextLogger

```ts
function createTextLogger(
    subject: string = "default",
    driver: string = "console"
): Logger<string>;
```

该方法用于创建一个指定主题的文本日志控制器。如果该主题对应的控制器已经存在，则返回
现有的控制器对象。

### 方法 createDataLogger

```ts
function createDataLogger<T = any>(
    subject: string = "default",
    formatter: LogFormatter<T> = DEFAULT_FORMATTER,
    driver: string = "console"
): Logger<T>;
```

该方法用于创建一个指定主题的对象日志控制器。如果该主题对应的控制器已经存在，则返回
现有的控制器对象。

> 默认格式化函数是将数据转换为 JSON。

### 方法 registerDriver

```ts
function registerDriver(
    name: string,
    driver: LogDriver
): LoggerFactory;
```

该方法用于注册一个新的日志输出驱动，如果对应名称的驱动已经存在，则抛出一个异常。

### 方法 getDriver

```ts
function getDriver(name: string): LogDriver | null;
```

该方法用于根据驱动名称获取一个已经存在的日志输出驱动。如果驱动不存在，则抛出一个异常。

### 方法 mute

```ts
function mute(
    lv?: LogLevel
): LoggerFactory;
```

该方法用于关闭**所有控制器**的全部或者指定等级的日志输出。

> 当参数 lv 省略时，则对所有等级的日志都生效。

### 方法 unmute

```ts
function unmute(
    lv?: LogLevel
): LoggerFactory;
```

该方法用于开启**所有控制器**的全部或者指定等级的日志输出。

> 当参数 lv 省略时，则对所有等级的日志都生效。

### 方法 enableTrace

```ts
function enableTrace(
    enable: boolean = true,
    lv?: LogLevel
): LoggerFactory;
```

该方法用于开启或关闭**所有控制器**的全部或者指定等级的追踪信息。

> 当参数 lv 省略时，则对所有等级的日志都生效。

### 方法 useFullTrace

```ts
function useFullTrace(
    enable: boolean = true,
    lv?: LogLevel
): LoggerFactory;
```

该方法用于开启或关闭**所有控制器**的全部或者指定等级的完整追踪信息。

> 当参数 lv 省略时，则对所有等级的日志都生效。
