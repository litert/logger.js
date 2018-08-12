# 安装与使用

## 安装

推荐使用 NPM 安装，例如：

```sh
npm i @litert/logger -S
```

如果想使用开发版本，则使用下面的语句

```sh
npm i @litert/logger@dev -S
```

## 使用

通过 import/require 导入即可使用。

```ts
import Loggers from "@litert/logger";

let log = Loggers.createTextLogger("Sample");

log.unmute();

log.info("Hello world!");
```
