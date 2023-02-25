# 更新记录



## 3.0.0-beta1 (2023-02-25)

### Big change

- complete the refactoring of the typescript part

## 2.2.0 (2023-02-25)

### 重大更新

- 重构inject HOC，从类组件改为函数式组件
- 新增 `CreateUseInject` API. 现在更加推荐使用`useInject`的hook方式
- 新增 `store.subscribeAll` API, 监听所有模块变动，无需指定模块监听
- 新的 `Provider` API, 更好的支持SSR和多个store场景.
- 新的 `CreateUseStore` API.
- Middleware/Interceptor参数新增 `getStore` API，用来在Middleware/Interceptor中获取当前store的实例
- `Middleware`/`Interceptor`范型调整，改为需要两个参数(Modules和Lazy Modules,就像`Store`一样), 并且有默认参数


### 不兼容更新

- 删除 `watch` API
- 升级到React 18版本, 不再兼容React17以下版本
    - 如果你想要在18版本以下升级natur, 你可以尝试使用 `use-sync-external-store`, 并在调用`createInject/createUseInject`之前将其放入React object中
    ```ts
    import {useSyncExternalStore} from 'use-sync-external-store/shim';
    import React from 'react';
    
    React.useSyncExternalStore = useSyncExternalStore;
    ```



## 2.2.0-beta7 (2023-02-10)

### 重大更新

- `useInject`API新增`flat`选项

### bug fix

- createStore类型bug fix


## 3.0.0-alpha2 (2023-02-06)

### 重大更新

- 将`natur-service`的功能移植到natur本身，变为新的 `watch` API，为了模块通讯以及更好的掌握业务
    ```ts
    import { ModuleEvent, AllModuleEvent, WatchAPI } from 'natur';
    export const moduleA = {
        state: {},
        actions: {/* ... */},
        watch: {
            moduleB(event: ModuleEvent, api: WatchAPI) {
                // any update of moduleB will trigger this function
                // event have any data of this change
                // api contain, getState, getMaps, localDispatch, getStore API etc.
            }
        }
    }
    export const moduleB = {
        state: {},
        actions: {/* ... */},
        // watch also can be a function to watch all module of store
        watch: (event: AllModuleEvent, api: WatchAPI) => { 
            // any update of any module will trigger this function
            // event have any data of this change
            // api contain, getState, getMaps, localDispatch, getStore API etc.
        }
    }
    ```
- 即将废弃`thunkMiddleware`中的`dispatch` API, 由新的`localDispatch`API替代，`localDispatch`只能调用本模块的action
- `subscribe` and `subscribeAll` API增强，提供更全面的事件信息，以及API入参来掌控业务

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