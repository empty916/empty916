---
sidebarDepth: 2
---

# natur-service
The call layer design of natur action is used to aggregate multiple actions into a certain business flow. It is suitable for complex business scenarios. The separation of advanced scenarios can better maintain a single action and expand business.


::: danger
This plugin is no longer recommended for use. Please use the "[watch](/natur/#watch-watch-any-change-of-modules)" option in the "natur" module as a replacement.
:::

## associated natur version

| natur | natur-service |
| -- | -- |
| 2.0.0 | 2.0.0 |
| 2.1.x | 2.1.x |


## install

```bash
# npm install natur-service -S
$ yarn install natur-service
```


## purpose

1. for cross-module communication and business processing, he can do the following two things
1. observe module updates and update details
1. dispatch an action of a module, even if the lazy loaded module has not been loaded yet

## tutorials

### sample store

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

// annother module, just for demo
const count1 = {
  state: 1,
  actions: {
    inc: (state) => state + 1,
    dec: (state) => state - 1,
  }
}

const modules = {
  count,
  count1: count,
};

const lazyModules = {};

export const store = createStore(modules, lazyModules);
export type M = typeof modules;
export type LM = typeof lazyModules;

```




### observe module updates and update details

`count-service.ts`
```ts
import {store, M, LM} from "store";
import NaturService from "natur-service";

class CountService extends NaturService<M, LM> {
  constructor() {
    super(store);
    // observe the count module, please see the documentation for ModuleEvent
    this.watch("count", (me: ModuleEvent) => {
      // this is the update details
      console.log(me);
      // this is the business logic you want to execute
      console.log('count module has changed.');
    });
  }
}

// instantiate, start listening
const countService = new CountService();

```


### dispatch action

`count-service.ts`
```ts
import {store, M, LM} from "store";
import NaturService from "natur-service";

class CountService extends NaturService<M, LM> {
  constructor() {
    super(store);
    // execute the inc action of the count module
    this.dispatch('count', 'inc', 0).then(() => {
      // if count is a module that has not been loaded yet, this action will not be triggered until count is loaded
      // if the same action is called multiple times during the unloading period, the old dispatch will throw a fixed Promise error to clear the cache and prevent stack overflow
      console.log('dispatch complete');
    })
  }
}

// instantiate, do dispatch
const countService = new CountService();
```


### destroy observing and cache

`count-service.ts`
```ts
import {store, M, LM} from "store";
import NaturService from "natur-service";

class CountService extends NaturService<M, LM> {
  constructor() {
    super(store);
    this.watch("count", () => {/* ...business logic */});
  }
}

const countService = new CountService();

// do destroy
countService.destroy();

```



### code packaging suggestions

- encapsulate complex initialization code

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

- create business service
`count-service.ts`
```ts
import { BaseService } from "base-service";

class CountService extends BaseService {
  start() {
    // you can directly get to the store
    this.store;
    // this means to watch the change of state in count and synchronize it to count1
    this.watch("count", ({state}) => {
      this.dispatch('count1', 'inc', state);
    });
  }
}

const countService = new CountService();
```


## ModuleEvent

| property name | description           |type|
|-----|---------------|---|
|state|the latest state of the module |any \| undefined|
|type| the type of module update,'init' is triggered when the module is initialized,'update' is triggered when the state of the module is updated, and'remove' is triggered when the module is remove |'init' \|'update' \|'remove'|
|actionName|the name of the action that triggers the module update, only exists when the type is'update' |string \| undefined|
|oldModule| the data of the old module, when the type is'init', it is undefined |InjectStoreModule \| undefined|
|newModule | the data of the new module, when the type is 'remove', it is undefined |InjectStoreModule \| undefined|



## NOTE


- remember to import the instantiated service into your project entry
- you should not use service in the store module, because the initialization of the service depends on the initialization of the store, which will cause circular references.
- it will not start observing immediately after instantiation, but will start observing after a micro task queue
- please note that when dispatching an action of a lazy-loaded module that has not been loaded multiple times, the old dispatch will report an error.