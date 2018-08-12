# 自定义输出位置

## 1. 使用驱动

到目前为止，我们讨论的日志全部都是输出到控制台。假如我们需要输出到文件该怎么办？

在之前的内容里，`createTextLogger` 和 `createDataLogger` 方法的第三个参数 `driver`
一直都被忽略了。其实，这个参数就是用于指定日志的输出驱动的名字。

`driver` 一词取自“驱动”之意，意味着只要改动这个参数，就可以完成输出位置的改动，将
格式化好的日志内容输出到指定的地方。例如文件、数据库、Redis……

下面我们看看驱动如何使用。

控制器工厂提供了三个与驱动相关的方法。

```ts
/**
 * 获取已经注册的驱动名称列表。
 */
public getDriverNames(): string[];

/**
 * 根据驱动注册的名称，获取驱动对象。
 */
public getDriver(name: string): IDriver | null;

/**
 * 注册一个新的驱动。
 */
public registerDriver(name: string, driver: IDriver): boolean;
```

从这三个方法可以看出，驱动是要先注册才能使用的。

由于每个驱动对象都可以注册一个名称，也就是说，同一种驱动的不同实例对象，可以注册为多个
不同名称的驱动。

例如：（假设有一个驱动叫 `FileLogDriver`，用于将日志写到文件里）

```ts
Loggers.registerDriver(
    "file-a",
    new FileLogDriver("/home/fenying/a.log")
);

Loggers.registerDriver(
    "file-b", 
    new FileLogDriver("/home/fenying/b.log")
);
```

然后在创建日志控制器的时候，指定对应的驱动：

```ts
const logs = Loggers.createTextLogger(
    "Sample",
    undefined, // 使用默认的格式化函数
    "file-a"
);
```

## 2. 实现自定义驱动

可以根据需要自行实现一个驱动，先看看 `IDriver` 的定义：

```ts
interface IDriver {

    /**
     * 该方法提供给日志控制器调用，用于写日志到输出设备。
     *
     * @param text      已经格式化的日志文本
     * @param subject   日志的主题
     * @param level     日志的等级
     * @param date      日志的时间
     */
    write(
        text: string,
        subject: string,
        level: string,
        date: Date
    ): void;

    /**
     * 将输出缓存中的日志全部输出到输出设备。
     */
    flush(): void | Promise<void>;

    /**
     * 关闭驱动。
     */
    close(): void | Promise<void>;
}
```

对于一个驱动，只需要实现上面三个方法即可。

下面来写一个简单的文件驱动。

```ts
import * as fs from "fs";

class FileLogDriver
implements IDriver {

    private _ws: fs.WriteStream;

    public constructor(file: string) {

        this._ws = fs.createWriteStream(file);
    }

    public write(
        text: string,
        subject: string,
        level: string,
        date: Date
    ): void {

        if (this._ws) {

            this._ws.write(text + "\n");
        }
    }

    public flush(): void | Promise<void> {

        // 未使用缓存，此处什么都不用做。
        return;
    }

    public close(): void | Promise<void> {

        this._ws.end();
        delete this._ws;
    }
}
```

然后就可以使用它了。

```ts

const fd = new FileLogDriver("a.log");

Loggers.registerDriver(
    "file-a",
    fd
);

const logs = Loggers.createTextLogger(
    "Sample",
    undefined,
    "file-a"
);

logs.unmute();

logs.info("HI");

logs.debug("Hello");

fd.close();
```

执行后看看当前目录下的 `a.log` 文件，是否有日志内容？

## 3. 内置的驱动

内置的驱动有两种：

-   `Console`

    默认的驱动类型，注册名为 `console`。

-   `ColorfulTTY`

    提供输出颜色支持的命令行输出功能，可以使用 `createColorfulTTYDriver` 方法创建。
