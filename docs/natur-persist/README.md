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
  name: '_data', // localStorage name prefix
  time: 500, // delay in syncing natur data to localStorage
  exclude: ['module1', /^module2$/], // module1, module2 do not do persistent cache
  include: ['module3', /^module4$/], // only for module3, module4 for persistent cache
  specific: {
    // the save delay of the user module is 0
    // which means that the data of the user module is synchronized to localStorage.
    user: 0, 
  },
  storageType: 'localStorage', // cache type, localStorage (default), or sessionStorage;
  
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