# 接口 ILogger

该接口定义日志控制器的方法列表。

```ts
interface ILogger<T, L extends string> {

    /**
     * 获取该控制器的日志主题。
     */
    getSubject(): string;

    /**
     * 获取该控制器支持的所有日至等级列表。
     */
    getLevels(): L[];

    /**
     * 打开或者关闭日志输出位置的追踪信息。
     *
     * @param depth 指定要输出的追踪信息层数，默认为 1 层，设置为 0 则不输出、
     * @param level 指定一个或者多个日志等级，留空或者输入空数组则表示所有等级
     */
    enableTrace(depth?: number, level?: L | L[]): this;

    /**
     * 打开输出指定等级的日志。
     *
     * @param level 指定一个或者多个日志等级，留空或者输入空数组表示所有等级
     */
    unmute(level?: L | L[]): this;

    /**
     * 关闭输出指定等级的日志。
     *
     * @param level 指定一个或者多个日志等级，留空或者输入空数组表示所有等级
     */
    mute(level?: L | L[]): this;

    /**
     * 刷新输出驱动的缓存。
     */
    flush(): void | Promise<void>;

    /**
     * 日志等级名称对应的日志写入方法。
     *
     * @param log   输入的日志内容
     * @param date  日志的产生时间，默认为当前时间。
     */
    [key in L]: (log: T, date?: Date): this;
}
```