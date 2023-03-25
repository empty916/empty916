# Change Log

## 1.0.10 (2023-03-25)

### withAPI优化

- withAPI会控制运行时传入的参数，如果参数个数和声明的一样，withAPI不会改变任何东西，如果参数个数和声明的不一样，比如多了或者少了，withAPI会去掉多余的参数或者使用undefined填充缺失的参数，**withAPI操作不能带可选参数**，它会破坏函数长度并导致错误


## 1.0.8 (2023-02-25)

### Big change


- `thunkMiddleware`中的`dispatch` API将会被废弃，由 `localDispatch` 替代，`localDispatch`只能调用本模块的`action`，无法调用其他模块的`action`

- 新的`withImmerAPIInterceptor` API, 在文档中查看更多信息

## 1.0.8-beta1 (2023-02-06)

### Big change

- `thunkMiddleware`中的`dispatch` API将会被废弃，由 `localDispatch` 替代，`localDispatch`只能调用本模块的`action`，无法调用其他模块的`action`

