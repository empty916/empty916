---
sidebarDepth: 2
---

# natur-service
natur action的调用层设计，用于聚合多个action成为一定的业务流，适用于复杂的业务场景，高级场景分离，可以更好的维护单个action，以及业务拓展

## natur-service关联的natur版本

| natur | natur-service |
| -- | -- |
| 2.0.0 | 2.0.0 |
| 2.1.x | 2.1.x |

## 安装

```bash
# npm install natur-service -S
$ yarn install natur-service
```

## 目的

1. 跨模块的通信以及业务处理，他可以做以下两件事
1. 监听模块的更新、以及更新的详情信息
1. 执行模块的action、即使是懒加载模块还未加载，也可以执行


## 教程

### 示例store

`store.ts`
```ts
import { createStore } from 'natur';

const count = {
  state: 1,
  actions: {
    inc: (state) => state + 1,
    dec: (state) => state - 1,
  }
}

const modules = {
  count,
  count2: count,
};

const lazyModules = {};

export const store = createStore(modules, lazyModules);
export type M = typeof modules;
export type LM = typeof lazyModules;

```

### 监听模块的更新、以及更新的详情信息

`count-service.ts`
```ts
import {store, M, LM} from "store";
import NaturService from "natur-service";

class CountService extends NaturService<M, LM> {
  constructor() {
    super(store);
    // 观察count模块， ModuleEvent请看文档
    this.watch("count", (me: ModuleEvent) => {
      // 这是更新详情
      console.log(me);
      // 这是你要执行的业务逻辑
      console.log('count module has changed.');
    });
  }
}

// 实例化，开始监听
const countService = new CountService();

```

### 执行模块的action

`count-service.ts`
```ts
import {store, M, LM} from "store";
import NaturService from "natur-service";

class CountService extends NaturService<M, LM> {
  constructor() {
    super(store);
    // 执行count模块的inc方法
    this.dispatch('count', 'inc', 0).then(() => {
      // 如果count是一个还未加载的模块，那么等到count加载完成后才会触发这个action
      // 如果在未加载完成期间，重复多次的调用同一个action，那么旧的dispatch会抛出一个固定的Promise错误，以清除缓存，防止爆栈
      console.log('dispatch完成');
    })
  }
}

// 实例化，执行推送
const countService = new CountService();
```

### 销毁监听和缓存

`count-service.ts`
```ts
import {store, M, LM} from "store";
import NaturService from "natur-service";

class CountService extends NaturService<M, LM> {
  constructor() {
    super(store);
    this.watch("count", () => {/* ...业务逻辑 */});
  }
}

// 实例化，开始监听
const countService = new CountService();

// 销毁监听、缓存
countService.destroy();

```



### 优化代码

- 将复杂的初始化代码封装

`base-service.ts`
```ts
import {store, M, LM} from "store";
import NaturService from "natur-service";

export class BaseService extends NaturService<M, LM> {
  constructor(s: typeof store = store) {
    super(s);
    this.start();
  }
  start() {}
}
```

- 创建业务service
`count-service.ts`
```ts
import { BaseService } from "base-service";

class CountService extends BaseService {
  start() {
    // 你可以直接获取到store
    this.store;
    this.watch("count", ({state}) => {
      this.dispatch('count1', 'inc', state);
    });
  }
}

const countService = new CountService();
```

## ModuleEvent

| 属性名称 |说明           |类型|
|-----|---------------|---|
|state|模块最新的state |any \| undefined|
|type| 触发模块更新的类型，'init' 是模块初始化触发，'update' 是模块的state更新时触发，'remove'是模块卸载时触发 |'init' \| 'update' \| 'remove'|
|actionName|触发模块更新的action名称，只有在 type为'update'时才会存在 |string \| undefined|
|oldModule| 旧模块的数据，当type为'init'时为undefined |InjectStoreModule \| undefined|
|newModule | 新模块的数据，当type为'remove'是为undefined |InjectStoreModule \| undefined|


## NOTE

- 记得将实例化的service导入你的项目入口
- 你不应该在store的模块中使用service，因为service的初始化依赖store的初始化，会导致循环引用问题
- 实例化后不会立即开始监听，而是在一个微任务队列后才开始执行监听
- 请注意，dispatch还未加载的懒加载模块的一个action多次时，旧的dispatch会报错。