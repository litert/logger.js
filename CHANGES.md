# Changes Logs

## v1.1.4

- fix(factory): only fn and name of formatter is acceptable by `createLogger` method.
- refactor: renamed `LoggerMethod` to `ILoggerMethod`, and `@deprecated` the `LoggerMethod`.
- refactor: renamed `DefaultLevels` to `IDefaultLevels`, and `@deprecated` the `DefaultLevels`.
- refactor: renamed `ForeColorSet` to `IForeColorSet`, and `@deprecated` the `ForeColorSet`.
- refactor: renamed `BgColorSet` to `IBgColorSet`, and `@deprecated` the `BgColorSet`.

## v1.1.3

- Switched to ESLint.
- Added TypeScript declaration map.

## v1.1.1

- Fixed the pre-registered formatter.

## v1.1.0

- Added pre-registered formatter supports.

## v1.0.0

- Upgrade to TypeScript v3.2.x.
- Added some comments.

## v0.3.0

- Rebuild for flexibility and performance.

## v0.2.3

- Upgrade `@litert/core` to v0.6.0.

## v0.2.2

- Fixed: Error when creating text logger lacking `$trace` definition.

## v0.2.1

- Fixed: Only one level was operated in global operation.

## v0.2.0

- A full new simpler logger.
