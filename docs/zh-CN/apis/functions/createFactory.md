# 模块方法 createFactory

该方法用于创建一个新的日志控制器工厂。

## 声明

```ts
type DefaultLevels = "error" | "notice" | "warning" | "debug" | "info";

function createFactory<
    L extends string = DefaultLevels
>(levels: L[]): IFactory<L>;
```

## 参数

-   泛型参数 `L` 

    指定可以使用的日志等级，用于静态类型检查和 IDE 自动完成。

- 形参 `levels`

    真正起定义日志等级的作用。


