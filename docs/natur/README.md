---
sidebarDepth: 3
---

# natur cook book


## introduction
1. This is a simple and efficient react state manager
1. Good typescript experience
1. Browser compatible: IE8+
1. support react 15.x, 16.x and anujs
1. Unit test coverage rate of 99%, rest assured to use
1. minizipped size 5k


## start

1. open your react project
1. install **natur**
  ```bash
  # npm install natur -S
  yarn add natur
  ```
## design

### the flow of a store module

![store module](../images/process.png)


### store module management

**natur itself is a module manager, plus publish and subscribe**

![store](../images/natur.png)


## simple demo

[codesandbox](https://codesandbox.io/s/natur-2x-simple-demo-nx0pp?file=/src/App.tsx)
### declare a module

```tsx
const count = {
  // save data
  state: {
    number: 0,
  },
  // map of state
  maps: { 
    isEven: ['number', number => number % 2 === 0],
  },
  // actions is used to update state
  actions: { 
    inc: number => ({number: number + 1}),
    dec: number => ({number: number - 1}),
  }
}
```

### create store and inject

```ts
import { createStore, createInject } from 'natur';

const store = createStore({count}, {});
const inject = createInject({storeGetter: () => store});
```
### use in React
```tsx
// create an injector of count module
const injector = inject('count');

// declare props type
const App = ({count}: typeof injector.type) => {
  return (
    <>
      <button onClick={() => count.actions.dec(count.state.number)}>-</button>
      <span>{count.state.number}</span>
      <button onClick={() => count.actions.inc(count.state.number)}>+</button>
      <span>{count.maps.isEven}</span>
    </>
  )
};

// inject count module into App component by injector
const IApp = injector(App);

// render injected component
ReactDOM.render(<IApp />, document.querySelector('#app'));
```


## detailed module

**A module consists of state, maps, actions**

### state — Storing Data


- **required:**`true`
- **type:**`any`
- state is used to store data

### maps — Computed Properties


- **required:**`false`
- **type:**`{[map: string]: Array<string|Function> | Function;}`

- maps is a map of state data, and its member must be an array of function. Let's call it map for now.
- If the map is an array, the preceding elements are all declaring the dependency of this map on the state. The last function can get the dependency declared earlier, and you can implement the calculation logic you need in it. On the component, you can get the result of the last function of the array.
- If the map is a function, then it can only accept state as an input parameter, or there is no parameter. If it is a state as a parameter, then when the state is updated, the map must be re-executed and there is no cache. If the map has no parameters, then this map will only be executed once
- The results of maps are cached. If the value of the dependencies you declare does not change, the last function will not be re-executed.

```ts
const demo = {
  state: {
    number: 1,
  },
  maps: {
    // The elements in front of the array are all declaring the dependency of this map on state. The last function can get the previously declared dependencies. You can implement what you want in it.
    isEven: ['number', number => number % 2 === 0],
    // You can also declare dependencies as functions, which is useful for complex types of state
    isEven2: [state => state.number, number => number % 2 === 0],
    // It can also be a function that directly depends on the entire state. The disadvantage is that the function will be re-executed as long as the state is updated, and there is no cache.
    isEven3: ({number}) => number % 2 === 0,
    // It can also be a function, no dependencies, only executed once
    isTrue: () => true,
  },
}

/**
 * the demo module data you got at component is
 * demo: {
 *  state: {
 *    number: 1,
 *  }
 *  maps: {
 *    isEven: false,
 *    isEven2: false,
 *    isEven3: false,
 *    isTrue: true
 *  }
 * ...
 * }
 */
```

### actions — Updating Data


- **required:**`true`
- **type:**`{[action: string]: (...arg: any[]) => any;}`
- The member of actions must be functions. If no middleware is set, any data it returns will be used as the new state, and the react components using this module will be notified to update, which is done inside natur.
- actions must follow the immutable specification!

```ts
type Actions = {
  [action: string]: (...arg: any[]) => any;
}

const demo = {
  state: {
    number: 1,
  },
  // Actions are used to modify the state. The data it returns will be used as the new state (this part is done internally by natur)
  actions: { 
    inc: number => ({number: number + 1}),
    dec: number => ({number: number - 1}),
  }
}
```


## usecase


### synchronous update data

- here we use the officially recommended middleware configuration by default, please see the middleware section for details

```ts

const app = {
  state: {
    name: "tom",
  },
  actions: {
    // here is the synchronous update of the name data in the state
    changeName: newName => ({ name: newName }),
  }
};

```

### asynchronous update data

- here we use the officially recommended middleware configuration by default, please see the middleware section for details

```ts

const app = {
  state: {
    name: "tom",
  },
  actions: {
    // here is the asynchronous update of the name data in the state
    changeName: newName => Promise.resolve({ name: newName }),
  }
};

```
### update data asynchronously in multiple batches

- here we use the officially recommended middleware configuration by default, please see the middleware section for details

```ts
import { ThunkParams } from "natur/dist/middlewares";

const state = {
  now: Date.now(),
}
const actions = {
  // here is the asynchronous multi-batch update of the name data in the state
  updateNow: () => ({setState}: ThunkParams<typeof state>) => {
    // update the value of now every second
    setInterval(() => setState({now: Date.now()}), 1000);
  },
}

const app = {
  state,
  actions
};

```


### get the latest state and maps value in actions

- here we use the officially recommended middleware configuration by default, please see the middleware section for details

```ts
import { ThunkParams } from "natur/dist/middlewares";

const state = {
  name: 'tom',
}
const maps = {
  nameIsTome: ['name', (name: string) => name === 'tom'],
}

const actions = {
  updateName: () => ({getState, getMaps}: ThunkParams<typeof state, typeof maps>) => {
    // get the latest state value
    const currentState = getState();
    // get the latest maps value
    const currentMaps = getMaps();
  },
}

const app = {
  state,
  maps,
  actions
};

```


### call other actions in actions

- here we use the officially recommended middleware configuration by default, please see the middleware section for details

```ts
import { ThunkParams } from "natur/dist/middlewares";

const state = {
  name: 'tom',
  updateNameTimes: 0,
}

const actions = {
  // this is the action being called
  increaseUpdateNameTimes: (p1: string, p2: string) => ({getState}: ThunkParams<typeof state>) => ({
    updateNameTimes: getState().updateNameTimes + 1,
  }),
  // This is the action that calls increaseUpdateNameTimes
  updateName: (newName: string) => ({dispatch}: ThunkParams) => {
    // call increaseUpdateNameTimes method
    dispatch('increaseUpdateNameTimes', 'p1', 'p2');
    // you can also call actions of other modules, but it is not recommended to use them widely
    // dispatch('otherModule/actions', /* ...arguments */);
    return {name: newName};
  },
}

const app = {
  state,
  actions
};

```


### the component only listens to changes in some data

```tsx
import { inject } from 'your-inject';


// Here the App component will only listen to changes in the name of the app and state. Changes in other values will not cause updates to the App component
let injector = inject(
  ['app', {
    state: ['name'], // You can also use function declarations state: [s => s.name]
  }]
); 


// Here the App component only listens to changes in the app and the map's deepDep. Changes in other values will not cause updates to the App component
injector = inject(
  ['app', {
    maps: ['deepDep'], 
  }]
)(App); 

// Here the App component will not be updated regardless of any changes in the app module
injector = inject(
  ['app', {}]
)(App); 

// Because actions stay the same after they are created, you don't have to listen for changes

const App = ({app}: typeof injector.type) => {
  // get app module
  const {state, actions, maps} = app;
  return (
    <input
      value={state.name} // state in app
      onChange={e => actions.changeName(e.target.value)}
    />
  )
};

```  

---

### lazy loading module configuration

```ts
/*
  module1.js
  export {
    state: {
      count: 1,
    }
    actions: {
      inc: state => ({count: state.count + 1}),
    }
  }
  
*/
const otherLazyModules = {
  // module2: () => import('module2');
  // ...
}
const module1 = () => import('module1'); // Lazy loading module

// Create a store instance
// The second parameter is the lazy loaded module;
const store = createStore(
  { app }, 
  { module1, ...otherLazyModules }
);

// Then the usage is equivalent to the second step
```



### initialization state

```tsx
import { createStore } from 'natur';
const app = {
  state: {
    name: 'tom',
  },
  actions: {
    changeName: newName => ({ name: newName }),
    asyncChangeName: newName => Promise.resolve({ name: newName }),
  },
};
/*
  createStore third parameter
  {
    [moduleName: ModuleName]: Require<State>,
  }
*/
const store = createStore(
  { app }, 
  {},
  { 
    initStates: {
      app: {name: 'jerry'} // Initialize the state of the app module
    }
  }
);

export default store;
```



### complex business scenarios of cross-module interaction

> In complex business scenarios, there are usually scenarios where multiple modules monitor and call each other, so for this scenario, you can use [natur-service](/natur-service/) Non-intrusive solution, you can monitor any changes in the module, and non-invasive development of complex business logic, while retaining the simplicity and maintainability of each module.

---


### placeholder component configuration when loading

```tsx
import { createInject } from 'natur';
// Global configuration
const inject = createInject({
  storeGetter: () => store,
  loadingComponent: () => <div>loading...</div>,
})
// Local use
inject('app')(App, () => <div>loading</div>);
```


### use natur outside react

```ts
// Store instance created before
import store from 'my-store-instance';

/*
  Get the registered app module, which is equivalent to the app module obtained in the react component
  If you want to get lazy loaded modules,
  Then you have to make sure that the module is already loaded at this time
*/
const app = store.getModule('app');
/*
  If you are sure, lazy load the module, not loaded yet
  You can listen for lazy loading modules and get
*/
store.subscribe('lazyModuleName', () => {
  const lazyModule = store.getModule('lazyModuleName');
});

/*
state: {
  name: 'tom'
},
actions: {
  changeName,
  asyncChangeName,
},
maps: {
  splitName: ['t', 'o', 'm'],
  addName: lastName => state.name + lastName,
}
*/
/*
  When you use the action method to update the state here,
  All components injected into the app module will be updated,
  And get the data in the latest app module,
  Advised not to abuse
*/
app.actions.changeName('jerry');
// Equivalent to
store.dispatch('app', 'changeName', 'jerry');

// Monitoring module changes
const unsubscribe = store.subscribe('app', () => {
  // Here you can get the latest app data
  store.getModule('app');
});


// Cancel listening
unsubscribe();

```



### dispatch

```typescript
import { createStore, inject, InjectStoreModule } from 'natur';

const count = {
  state: {
    number: 0,
  },
  maps: {
    isEven: ['number', number => number % 2 === 0],
  },
  actions: {
    inc: number => ({number: number + 1}),
    dec: number => ({number: number - 1}),
  }
}

const store = createStore({count}, {});

const {actions, state} = store.getModule('count')

actions.inc(state.number);
// Equivalent to
store.dispatch('count', 'inc', state.number);

```

### importing modules manually

```ts

// initStore.ts
import { createStore } from 'natur';

// When instantiating the store, no lazy loading module was imported
export default createStore({/*...modules*/}, {});

// ================================================
// lazyloadPage.ts This is a lazy loaded page
import store from 'initStore.ts'

const lazyLoadModule = {
  state: {
    name: 'tom',
  },
  actions: {
    changeName: newName => ({ name: newName }),
  },
  maps: {
    nameSplit: state => state.name.split(''),
    addName: state => lastName => state.name + lastName,
  },
};
/*
Add the module manually, it cannot be used anywhere else until it is added
To use it elsewhere, it must be imported when the store is instantiated
*/
store.setModule('lazyModuleName', lazyLoadModule);

const lazyLoadView = () => {
  // Now you can get manually added modules
  const {state, maps, actions} = store.getModule('lazyModuleName');
  return (
    <div>{state.name}</div>
  )
}


```



## interceptor

**When the module calls action or store.dispatch, it will pass the interceptor first, so the interceptor can be applied to control whether the action is executed, and the input parameter control of the action**

```tsx

import {
  createStore,
  Interceptor
  InterceptorActionRecord,
  InterceptorNext,
  InterceptorParams,
} from 'natur';

const app = {
  state: {
    name: 'tom',
  },
  actions: {
    changeName: newName => ({ name: newName }),
    asyncChangeName: newName => Promise.resolve({ name: newName }),
  },
};

type InterceptorActionRecord = {
  moduleName: String;
  actionName: String;
  actionArgs: any[];
  actionFunc: (...arg: any) => any; // The original action function
}

type InterceptorNext = (record: InterceptorActionRecord) => ReturnType<Action>;

// The InterceptorParams type is the same as the MiddlewareParams type

type InterceptorParams = {
  setState: MiddlewareNext, 
  getState: () => State,
  getMaps: () => InjectMaps,
  dispatch: (action, ...arg: any[]) => ReturnType<Action>,
};

const LogInterceptor: Interceptor<typeof store.type> = (interceptorParams) => 
  (next: InterceptorNext) => 
    (record: InterceptorActionRecord) => {
    console.log(`${record.moduleName}: ${record.actionName}`, record.actionArgs);
    // You should return
    // only then will you have the return value when you call the action on the page
    return next(record);
};
const store = createStore(
  { app }, 
  {},
  {
    interceptors: [LogInterceptor, /* ...moreInterceptor */]
  }
);

export default store;

```

## middleware
**The execution of the middleware occurs after the action is executed and before the state is updated. Can receive the return value of the action, generally can be applied to the processing of the return value of the action, the control of state update, etc.**
```tsx


import { createStore, MiddleWare, MiddlewareNext, MiddlewareActionRecord } from 'natur';
const app = {
  state: {
    name: 'tom',
  },
  actions: {
    changeName: newName => ({ name: newName }),
    asyncChangeName: newName => Promise.resolve({ name: newName }),
  },
};

type MiddlewareActionRecord = {
  moduleName: String,
  actionName: String,
  state: ReturnType<Action>,
}

type MiddlewareNext = (record: MiddlewareActionRecord) => ReturnType<Action>;

type MiddlewareParams = {
  setState: MiddlewareNext, 
  getState: () => State,
  getMaps: () => InjectMaps,
  dispatch: (action, ...arg: any[]) => ReturnType<Action>,
};

const LogMiddleware: MiddleWare<typeof store.type> = (middlewareParams) => 
  (next: MiddlewareNext) => 
    (record: MiddlewareActionRecord) => {
    console.log(`${record.moduleName}: ${record.actionName}`, record.state);
    return next(record); // You should return, only then will you have a return value when the page calls the action
    // return middlewareParams.setState(record); // You should return, only then will you have a return value when the page calls the action
const store = createStore(
  { app }, 
  {},
  {
    middlewares:[LogMiddleware, /* ...moreMiddleware */]
  },
  
);

export default store;


```

### built-in middleware description

- thunkMiddleware: Due to the runtime closure problem within the component, the latest state cannot be obtained, so all this middleware exists

```typescript

import { thunkMiddleware, ThunkParams } from 'natur/dist/middlewares'

const actionExample = (myParams: any) => ({
  getState, 
  setState, 
  getMaps,
  dispatch,
}: ThunkParams<typeof stateOfThisModule, typeof mapsOfThisModule>) => {
  const currentState = getState(); // get latest state
  const currentMaps = getMaps(); // get latest maps
  // dispatch('otherActionNameOfThisModule', ...params)
  // dispatch('otherModuleName/otherActionNameOfOtherModule', ...params);
  setState(currentState); // update state
  return currentState; // update state too
}
```

- promiseMiddleware: action supports asynchronous operations
```typescript
const action1 = () => Promise.resolve(2333);
const action2 = async () => await new Promise(res => res(2333));
```

- fillObjectRestDataMiddleware: Incremental state update / overwrite update, only valid when state is an object
```typescript

const state = {a: 1, b:2};
const action = () => ({a: 11})// Call this action, the final state is {a: 11, b: 2}, this middleware requires that the data returned by the state and action must be ordinary objects
```


- shallowEqualMiddleware：Shallow comparison optimization middleware, limited to the state of ordinary objects
```typescript

const state = {a: 1, b:2};
const action = () => ({a: 1, b:2}) // Same as the old state, do not update the view
```

- filterUndefinedMiddleware: Interceptor actions that return undefined
```typescript
const action = () => undefined; // The return of this action will not be used as the new state
```


- devtool

```typescript

// redux.devtool.middleware.ts
import { Middleware } from 'natur';
import { createStore } from 'redux';

const root = (state: Object = {}, actions: any):Object => ({
  ...state,
  ...actions.state,
});

const createMiddleware = ():Middleware => {
  if (process.env.NODE_ENV === 'development' && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    const devMiddleware = (window as any).__REDUX_DEVTOOLS_EXTENSION__();
    const store = createStore(root, devMiddleware);
    return ({getState}) => next => record => {
      store.dispatch({
        type: `${record.moduleName}/${record.actionName}`,
        state: {
          [record.moduleName]: record.state || getState(),
        },
      });
      return next(record);
    }
  }
  return () => next => record => next(record);
}

export default createMiddleware();
```

### recommended middleware configuration

**Note: The order of middleware configuration is important**

```typescript

import {createStore} from 'natur';
import { 
  thunkMiddleware,
  promiseMiddleware, 
  fillObjectRestDataMiddleware,
  shallowEqualMiddleware, 
  filterUndefinedMiddleware,
} from 'natur/dist/middlewares';
import devTool from 'redux.devtool.middleware';

const store = createStore(
  modules,
  {},
  {
    middlewares: [
      thunkMiddleware, // Action supports returning functions and getting the latest data
      promiseMiddleware, // action supports asynchronous operations
      fillObjectRestDataMiddleware, // Incremental state update / overwrite update
      shallowEqualMiddleware, // Shallow contrast optimization between old and new state
      filterUndefinedMiddleware, // Interceptor actions with no return value
      devTool,
    ]
  },
);
```


## typescript support

### base usage
```ts

import React from 'react';
import ReactDOM from 'react-dom';
import inject from 'your-inject'
import {ModuleType} from 'natur';

const count = {
  state: { // 存放数据
    number: 0,
  },
  maps: { // state的映射。比如，我需要知道state中的number是否是偶数
    isEven: ['number', number => number % 2 === 0],
  },
  actions: { // 用来修改state。返回的数据会作为新的state(这部分由natur内部完成)
    inc: number => ({number: number + 1}),
    dec: number => ({number: number - 1}),
  }
}

// Generate the type obtained by the count module in the component
type InjectCountType = ModuleType<typeof count>;

const injector = inject('count');

type otherProps = {
  className: string,
  style: Object,
}

const App: React.FC<typeof injector.type & otherProps> = (props) => {
  const {state, actions, maps} = props.count;
  return (
    <>
      <button onClick={() => actions.inc(state)}>+</button>
      <span>{state.count}</span>
      <button onClick={() => actions.dec(state)}>-</button>
    </>
  )
}

const IApp = injector(App);

const app = (
  <IApp className='1' style={{}} />
);
ReactDOM.render(
  app,
  document.querySelector('#app')
);


```


### Redefine store type

```ts
import {Store, createStore} from 'natur';

const count = {
  /* ... */
}

const lazyModule1 = () => import(/* ... */);

const allSyncModules = {
  count,
  /* and others */
}
const allAsyncModules = {
  lazyModule1,
  /* and others */
}

const store = createStore(allSyncModules, allAsyncModules);

type StoreInsType = Store<typeof allSyncModules, typeof allAsyncModules>;

// The type of StoreInsType is the type of store, you can extend your type

```


## cautions

 - Because the lower version does not support the react.forwardRef method, you cannot directly use the ref to obtain the wrapped component instance. You need to use the forwardedRef property to obtain it (the usage is the same as ref).

 - Tips in TypeScript may be less friendly, like
 ```ts

@inject('count', 'name')
class App extends React.Component {
  // ...
}

// This usage method will report an error, indicating that there is no forwardedRef attribute declaration in the App component
<App forwardedRef={console.log} />

// The following usage methods will not report an error
class _App extends React.Component {
  // ...
}
const App = inject('count', 'name')(_App);
// correct
<App forwardedRef={console.log} />

 ```
- **To modify state in actions, you need to follow the immutable specification**


## plugins

- [natur-service: natur upper scheduling library](/natur-service)
- [natur-persist: localStorage plugins](/natur-persist)
- [natur-persist-async: async presit plugin](/natur-persist-async)
- [umi-natur: umi plugin of natur](/umi-natur)
