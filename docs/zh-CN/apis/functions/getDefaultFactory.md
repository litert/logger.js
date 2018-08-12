# 模块方法 getDefaultFactory

该方法用于获取默认的日志控制器工厂。

## 声明

```ts
type DefaultLevels = "error" | "notice" | "warning" | "debug" | "info";

function getDefaultFactory(): IFactory<DefaultLevels>;
```
