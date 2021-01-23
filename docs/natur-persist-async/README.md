# natur-persist-async

## introduction

- asynchronous persistent cache middleware for natur state manager
- synchronization operation has a certain delay, use anti-shake for synchronization operation

## demo

```ts
import { createStore } from 'natur';
import createPersistMiddleware from 'natur-persist-async';
import AsyncStorage from '@react-native-community/async-storage';


const { middleware, getData, clearData } = createPersistMiddleware({
  name: '_data', // localStorage name prefix
  time: 500, // delay in syncing natur data to localStorage
  exclude: ['module1', /^module2$/], // module1, module2 do not do persistent cache
  include: ['module3', /^module4$/], // only for module3, module4 for persistent cache
  specific: {
    // the save delay of the user module is 0
    // which means that the data of the user module is synchronized to localStorage.
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

// clearData(); clear cached data


const store = createStore(
  {},
  {}
  {
    middlewares: [
      middleware, // use middleware to synchronize data to storage
    ]
  }
);

// the store fills the cached data
getData().then(data => store.globalSetStates(data));

```