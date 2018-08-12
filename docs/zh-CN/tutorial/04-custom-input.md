# 自定义输入格式

前面我们使用的都是将字符串文本作为日志内容，传递给日志控制器对象。假如需要更复杂的输入
内容呢？例如某些 API 网关需要记录 API 访问日志，那么肯定不是用字符串能简单解决的。

下面来看看日志控制器工厂对象的 `createDataLogger` 方法。

```ts
public createDataLogger<T = any>(
    subject?: string,
    formatter?: IFormatter<T, L>,
    driver?: string
): ILogger<T, L>;
```

这个方法有一个可选的泛型参数 `T`，这个泛型参数也就是用于指定创建出来的控制器能接受什么
作为日志的输入内容。下面看个示例：

```ts
interface HTTPLog {

    method: "GET" | "POST" | "HEAD";

    ip: string;

    uri: string;
}

const logs = Loggers.createDataLogger<HTTPLog>("HTTP-Logs");

logs.unmute();

logs.info({
    ip: "192.168.1.122",
    method: "GET",
    uri: "/index.html"
});

logs.info({
    ip: "192.168.1.128",
    method: "POST",
    uri: "/upload.php"
});
```

运行得到输出如下：

```
{"subject":"HTTP-Logs","level":"info","date":1534066661287,"log":{"ip":"192.168.1.122","method":"GET","uri":"/index.html"}}
{"subject":"HTTP-Logs","level":"info","date":1534066661287,"log":{"ip":"192.168.1.122","method":"POST","uri":"/upload.php"}}
```

咦，输出变成了 JSON ？是的，这不是出错了。因为 `createDataLogger` 方法使用的默认的
格式化函数就是将日志格式化为 JSON。

所以你也可以自己实现一个格式化函数，例如：

```ts
interface HTTPLog {

    method: "GET" | "POST" | "HEAD";

    ip: string;

    uri: string;
}

const logs = Loggers.createDataLogger<HTTPLog>(
    "HTTP-Logs",
    function(log, subject, level, date, traces): string {

        /**
         * 注意这里 log 不是 string 类型，而是 HTTPLog 类型的对象。
         */
        return `${date} - ${log.ip} - ${log.method} ${log.uri}`;
    }
);

logs.unmute();

logs.info({
    ip: "192.168.1.122",
    method: "GET",
    uri: "/index.html"
});

logs.info({
    ip: "192.168.1.128",
    method: "POST",
    uri: "/upload.php"
});
```

得到如下输出：

```
Sun Aug 12 2018 17:30:16 GMT+0800 (中国标准时间) - 192.168.1.122 - GET /index.html
Sun Aug 12 2018 17:30:16 GMT+0800 (中国标准时间) - 192.168.1.128 - POST /upload.php
```

> 从 `createDataLogger` 方法声明可以看出， `createTextLogger` 方法只是对
> `createDataLogger` 方法的一层封装。相当于
>
> ```ts
> Loggers.createDataLogger<string>(
>     subject,
>     DEFAULT_TEXT_FORMATTER
> );
> ```
>
> 是的，`createTextLogger` 使用的默认格式化函数为 `DEFAULT_TEXT_FORMATTER`，
> 而 `createDataLogger` 则是使用 `DEFAULT_JSON_FORMATTER`。
