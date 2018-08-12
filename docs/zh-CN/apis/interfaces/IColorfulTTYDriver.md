# 接口 IColorfulTTYDriver

该接口定义彩色命令行输出驱动的方法列表。

```ts
type ColorSet = "blue" | "cyan" | "green" | "magenta" | "grey" |
                "red" | "yellow" | "white" | "black" | "default";

interface IColorfulTTYDriver
extends IDriver {

    /**
     * 设置指定等级的日志的输出前景色。
     *
     * @param color 颜色名称
     * @param level 指定要设置的日志等级。如果不指定，则修改默认的日志输出颜色。
     */
    foreColor(color: ColorSet, level?: string): this;

    /**
     * 设置指定等级的日志的输出背景色。
     *
     * @param color 颜色名称
     * @param level 指定要设置的日志等级。如果不指定，则修改默认的日志输出颜色。
     */
    bgColor(color: ColorSet, level?: string): this;
}
```
