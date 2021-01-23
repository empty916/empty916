# natur-persist使用手册

## 基本介绍

- natur状态管理器的localstorage缓存中间件
- 将natur数据同步到localStorage或者sessionStorage
- 同步操作有一定的延迟，使用防抖做同步操作


## demo

```typescript
import { createStore } from 'natur';
import createPersistMiddleware from 'natur-persist';

const { middleware, getData, clearData } = createPersistMiddleware({
  name: '_data', // localStorage命名前缀
  time: 500, // natur数据同步到localStorage的延迟
  exclude: ['module1', /^module2$/], // module1, module2不做持久化缓存
  include: ['module3', /^module4$/], // 只针对module3，module4做持久化缓存
  specific: {
    user: 0, // 用户模块的保存延迟为0，意为用户模块的数据同步到localStorage是同步的
  },
  storageType: 'localStorage', // 缓存类型，localStorage(默认), 或者sessionStorage;
  
});

clearData() // 清除缓存数据

const store = createStore(
  {},
  {}
  {
    initStates: getData(), // 获取localStorage中的缓存数据
    middlewares: [
      middleware, // 使用中间件, 同步数据到storage
    ]
  }
);

```