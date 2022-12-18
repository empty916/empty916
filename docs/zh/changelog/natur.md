# 更新记录


## 2.2.0-beta2

### 重大更新

- 重构inject HOC，从类组件改为函数式组件
- 新增 `CreateUseInject` API. 现在更加推荐使用`useInject`的hook方式
- 新增 `store.subscribeAll` API, 监听所有模块变动，无需指定模块监听

### 不兼容更新

- 删除 `watch` API
- 升级到React 18版本, 不再兼容React17以下版本

### 优化

- 缓存优化