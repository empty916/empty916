# natur-persist handbook

## introduction

- natur state manager's localstorage cache middleware
- sync natur data to localStorage or sessionStorage
- synchronization operation has a certain delay, use anti-shake for synchronization operation


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

// clearData() clear cached data

const store = createStore(
  {},
  {}
  {
    initStates: getData(), // get cached data in localStorage
    middlewares: [
      middleware, // use middleware to synchronize data to storage
    ]
  }
);

```


## createPersistMiddleware parameter

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

### storageType

- **require:**`false`
- **type:**`'localStorage'|'sessionStorage'`
- **default:**`'localStorage'`
- cache type

## createPersistMiddleware return value

### middleware

- middleware, used to intercept store data and trigger the caching mechanism

### getData

- get the data in the cache

### clearData

- clear data in cache
