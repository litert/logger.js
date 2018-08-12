# 接口 IFactory

该接口定义日志格式化函数。

```ts
/**
 * 用于格式化日志为字符串的函数。
 *
 * @param log       日志的输入内容。
 * @param subject   日志的主题。
 * @param level     日志等级。
 * @param date      日志写入时间。
 * @param traces    日志的追踪信息。
 */
export type IFormatter<T, L extends string> = (
    log: T,
    subject: string,
    level: L,
    date: Date,
    traces?: string[]
) => string;
```
