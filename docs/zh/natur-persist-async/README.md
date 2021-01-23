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
  name: '_data', // store数据变量名命名前缀
  time: 500, // natur数据同步到store的延迟
  exclude: ['module1', /^module2$/], // module1, module2不做持久化缓存
  include: ['module3', /^module4$/], // 只针对module3，module4做持久化缓存
  specific: {
    user: 0, // 用户模块的保存延迟为0，意为用户模块的数据同步到store是同步的
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