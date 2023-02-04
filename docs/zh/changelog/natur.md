# 更新记录



## 2.2.0-beta5 (2023-02-04)

### 重大更新

- 新的 `Provider` API, 更好的支持SSR和多个store场景.
- 新的 `CreateUseStore` API.
- Middleware/Interceptor参数新增 `getStore` API，用来在Middleware/Interceptor中获取当前store的实例
- `Middleware`/`Interceptor`范型调整，改为需要两个参数(Modules和Lazy Modules,就像`Store`一样), 并且有默认参数


## 2.2.0-beta2 (2022-12-18)

### 重大更新

- 重构inject HOC，从类组件改为函数式组件
- 新增 `CreateUseInject` API. 现在更加推荐使用`useInject`的hook方式
- 新增 `store.subscribeAll` API, 监听所有模块变动，无需指定模块监听

### 不兼容更新

- 删除 `watch` API
- 升级到React 18版本, 不再兼容React17以下版本

### 优化

- 缓存优化