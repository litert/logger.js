# 接口 IDriver

该接口定义日志控制器输出驱动的方法列表。

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
