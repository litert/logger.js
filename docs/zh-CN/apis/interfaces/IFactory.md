# 接口 IFactory

该接口定义日志控制器工厂的方法列表。

```ts
interface IFactory<
    /**
     * L 是日志控制器工厂支持的日志等级列表。
     */
    L extends string
> {

    /**
     * 对于所有该工厂创建的控制器对象，关闭输出指定等级的日志。
     *
     * @param level 指定一个或者多个日志等级，留空或者输入空数组表示所有等级
     */
    mute(level?: L | L[]): this;

    /**
     * 对于所有该工厂创建的控制器对象，打开输出指定等级的日志。
     *
     * @param level 指定一个或者多个日志等级，留空或者输入空数组表示所有等级
     */
    unmute(level?: L | L[]): this;

    /**
     * 对于所有该工厂创建的控制器对象，打开或者关闭日志输出位置的追踪信息。
     *
     * @param depth 指定要输出的追踪信息层数，默认为 1 层，设置为 0 则不输出、
     * @param level 指定一个或者多个日志等级，留空或者输入空数组则表示所有等级
     */
    enableTrace(depth?: number, level?: L | L[]): this;

    /**
     * 注册一个新的日志输出驱动。
     *
     * @param name   驱动唯一名称。
     * @param driver 驱动对象。
     */
    registerDriver(name: string, driver: IDriver): boolean;

    /**
     * 根据驱动的唯一注册名称，获取驱动对象。
     *
     * 如果不存在，则返回 null。
     *
     * @param name  驱动的唯一注册名称
     */
    getDriver(name: string): IDriver | null;

    /**
     * 获取所有已经注册的驱动对象唯一注册名称列表。
     */
    getDriverNames(): string[];

    /**
     * 注册一个新的自定义输入类型的日志格式化函数。
     *
     * @param name          日志格式化函数的唯一注册名称。
     * @param formatter     日志格式化函数
     */
    registerDataFormatter<T>(name: string, formatter: IFormatter<T, string>): boolean;

    /**
     * 注册一个新的文本型的日志格式化函数。
     *
     * @param name          日志格式化函数的唯一注册名称。
     * @param formatter     日志格式化函数
     */
    registerTextFormatter(name: string, formatter: IFormatter<string, string>): boolean;

    /**
     * 根据唯一注册名称获取一个自定义输入类型的日志格式化函数。
     *
     * @param name  唯一注册名称
     */
    getDataFormatter<T = any>(name: string): IFormatter<T, string>;

    /**
     * 根据唯一注册名称获取一个文本型的日志格式化函数。
     *
     * @param name  唯一注册名称
     */
    getTextFormatter(name: string): IFormatter<string, string>;

    /**
     * 获取所有已经注册的自定义输入类型日志格式化函数的名称。
     */
    getDataFormatterNames(): string[];

    /**
     * 获取所有已经注册的文本型日志格式化函数的名称。
     */
    getTextFormatterNames(): string[];

    /**
     * 获取所有该工厂创建的日志控制器对象的主题列表。
     */
    getSubjects(): string[];

    /**
     * 获取该工厂支持的所有日至等级列表。
     */
    getLevels(): L[];

    /**
     * 创建一个文本型的日志控制器。
     *
     * 已经存在则返回已存在的控制器对象。
     *
     * @param subject   日志的主题。(默认值：default)
     * @param formatter 日志格式化函数或者预注册的格式化函数唯一名称。(默认值：default)
     * @param driver    已注册的驱动名称。(默认值：console)
     */
    createTextLogger(
        subject?: string,
        formatter?: IFormatter<string, L> | string,
        driver?: string
    ): ILogger<string, L>;

    /**
     * 创建一个自定义输入类型的日志控制器。
     *
     * 已经存在则返回已存在的控制器对象。
     *
     * @param subject   日志的主题。(默认值：default)
     * @param formatter 日志格式化函数或者预注册的格式化函数唯一名称。(默认值：default)
     * @param driver    已注册的驱动名称。(默认值：console)
     */
    createDataLogger<T = any>(
        subject?: string,
        formatter?: IFormatter<T, L> | string,
        driver?: string
    ): ILogger<T, L>;
}
```