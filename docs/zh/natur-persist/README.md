# natur-persist使用手册

## 基本介绍

- natur状态管理器的缓存中间件
- 将natur数据同步到localStorage或者sessionStorage
- 同步操作有一定的延迟，使用防抖做同步操作


## demo

```typescript
import { createStore } from 'natur';
import createPersistMiddleware from 'natur-persist';

const { middleware, getData, clearData } = createPersistMiddleware({
  name: '_data',
  time: 500,
  exclude: ['module1', /^module2$/],
  include: ['module3', /^module4$/],
  specific: {
    user: 0,
  },
  storageType: 'localStorage',
  
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

## 参数


## createPersistMiddleware选项
### name

- **必填：** `false`
- **类型：**`string`
- **默认值：**`'_data'`
- 在localStorage中添加元素时，设置key的名称时会加上这个name作为前缀，防止不同应用之间有命名冲突

### time

- **必填：** `false`
- **类型：**`number`
- **默认值：**`100`
- 同步延时，在往localStorage同步数据时，使用防抖做同步机制，并有一定的延时。


### exclude

- **必填：** `false`
- **类型：**`Array<string|RegExp>`
- 在同步模块数据到localStorage时，可以配置是否忽略缓存某些模块

### include

- **必填：**`false`
- **类型：**`Array<string|RegExp>`
- 在同步模块数据到localStorage时，可以配置是否只缓存某些模块，exclude优先级要高于include

### specific

- **必填：**`false`
- **类型：**`{[moduleName: string]: number}`
- 配置某些模块的延迟时间，如果number为0，那么将会是同步缓存，不用防抖机制

### storageType

- **必填：**`false`
- **类型：**`'localStorage'|'sessionStorage'`
- **默认值：**`'localStorage'`
- 缓存类型



## createPersistMiddleware返回值

### middleware

- 中间件，用于拦截store的数据，并触发缓存机制

### getData

- 获取缓存中的数据

### clearData

- 清除缓存中的数据