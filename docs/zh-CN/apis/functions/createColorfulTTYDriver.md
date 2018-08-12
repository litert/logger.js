# 模块方法 createColorfulTTYDriver

该方法用于创建一个新的彩色命令行输出驱动对象。

## 声明

```ts
function createColorfulTTYDriver(): IColorfulTTYDriver;
```

## 注意

如果当前输出环境不支持彩色输出，则降级为控制台输出。
