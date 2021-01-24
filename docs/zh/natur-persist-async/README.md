# natur-persist-async

## 基础介绍

- natur状态管理器的异步持久化缓存中间件
- 同步操作有一定的延迟，使用防抖做同步操作

## demo

```ts
import { createStore } from 'natur';
import createPersistMiddleware from 'natur-persist-async';
import AsyncStorage from '@react-native-community/async-storage';


const { middleware, getData, clearData } = createPersistMiddleware({
  name: '_data',
  time: 500,
  exclude: ['module1', /^module2$/],
  include: ['module3', /^module4$/],
  specific: {
    user: 0,
  },
  setItem: async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  },
  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return !!value ? JSON.parse(value) : value;
    } catch (e) {
      // get error
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // remove error
    }
  },
});

// clearData(); 清除缓存数据


const store = createStore(
  {},
  {}
  {
    middlewares: [
      middleware, // 使用中间件, 同步数据到storage
    ]
  }
);

// store填充缓存的数据
getData().then(data => store.globalSetStates(data));

```


## 参数

## createPersistMiddleware选项

### name

- **必填：** `false`
- **类型：**`string`
- **默认值：**`'_data'`
- 在往缓存中添加元素时，设置key的名称时会加上这个name作为前缀，防止不同应用之间有命名冲突

### time

- **必填：** `false`
- **类型：**`number`
- **默认值：**`100`
- 同步延时，在往缓存同步数据时，使用防抖做同步机制，并有一定的延时。


### exclude

- **必填：** `false`
- **类型：**`Array<string|RegExp>`
- 在同步模块数据到缓存时，可以配置是否忽略缓存某些模块

### include

- **必填：**`false`
- **类型：**`Array<string|RegExp>`
- 在同步模块数据到缓存时，可以配置是否只缓存某些模块，exclude优先级要高于include

### specific

- **必填：**`false`
- **类型：**`{[moduleName: string]: number}`
- 配置某些模块的延迟时间，如果number为0，那么将会是同步缓存，不用防抖机制

### setItem

- **必填：**`true`
- **类型：**`(key: string, value: any) => Promise<any> `
- 保存数据到缓存的实现


### getItem

- **必填：**`true`
- **类型：**`(key: string) => Promise<any> `
- 获取缓存数据实现

### removeItem

- **必填：**`true`
- **类型：**`(key: string) => Promise<any> `
- 删除缓存数据实现


## createPersistMiddleware返回值

### middleware

- 中间件，用于拦截store的数据，并触发缓存机制

### getData

- 获取缓存中的数据

### clearData

- 清除缓存中的数据