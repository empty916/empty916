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


## parameter


## createPersistMiddleware options

### name

- **require:** `false`
- **type:**`string`
- **default:**`'_data'`
- when adding elements to localStorage, this name will be added as a prefix when setting the name of the key to prevent naming conflicts between different applications

### time

- **require:** `false`
- **type:**`number`
- **default:**`100`
- synchronization delay. When synchronizing data to localStorage, use debounce as a synchronization mechanism, and there is a certain delay.


### exclude

- **require:** `false`
- **type:**`Array<string|RegExp>`
- when synchronizing module data to localStorage, you can configure whether to ignore caching certain modules

### include

- **require:**`false`
- **type:**`Array<string|RegExp>`
- when synchronizing module data to localStorage, you can configure whether to cache only certain modules, exclude priority is higher than include

### specific

- **require:**`false`
- **type:**`{[moduleName: string]: number}`
- configure the delay time of some modules, if the number is 0, then it will be a synchronous buffer without anti-shake mechanism
### setItem

- **require:**`true`
- **type:**`(key: string, value: any) => Promise<any> `
- implementation of saving data to cache


### getItem

- **require:**`true`
- **type:**`(key: string) => Promise<any> `
- get cached data implementation

### removeItem

- **require:**`true`
- **type:**`(key: string) => Promise<any> `
- delete cache data implementation


## createPersistMiddleware return value

### middleware

- middleware, used to intercept store data and trigger the caching mechanism

### getData

- get the data in the cache

### clearData

- clear data in cache