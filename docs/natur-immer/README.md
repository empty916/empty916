---
sidebarDepth: 2
---

# natur-immer
- middleware to integrate immer into natur


## install

```bash
# npm install natur-immer -S
$ yarn install natur-immer
```

## introduce

1. Integrate immer into natur, so that when modifying state in action, you only need to use mutable writing.

## start


### replace thunkMiddleware

**replace`natur's thunkMiddleware`to`natur-immer's thunkMiddleware`**

```ts {2,6}
import { createStore } from 'natur';
import { thunkMiddleware } from 'natur-immer';

export const store = createStore({/* ... */}, {/* ... */}}, {
  middlewares: [
      thunkMiddleware, // use natur-immer's thunkMiddleware
  ]
});
```

### usage

**this is a user module demo**

`user-module.ts`
```ts
import { ThunkParams } from 'natur/dist/middlewares';

// this is a mock function to fetch todo form service
const mockFetchTodo = () => new Promise<{name: string; status: number}[]>(res => res([
    {
        name: 'play game',
        status: 0,
    },
    {
        name: 'work task1',
        status: 0,
    }
]));

// user state
const state = {
    name: 'tom',
    age: 10,
    todo: [
        {
            name: 'study english',
            status: 0,
        }
    ]
};

type State = typeof state;


const actions = {
    // update user age
    updateAge: (age: number) => ({getState}: ThunkParams<State>) => {
        const ns = getState();
        ns.age = age;
        return ns;
    },
    // update user todo，return state
    fetchTodo: () => async ({getState}: ThunkParams<State>) => {
        const res = await mockFetchTodo();
        const nowState = getState();
        nowState.todo.push(...res); // modify directly
        return nowState; // return new state(recommend return)
    },
    // update user todo，without return state
    fetchTodoWithoutReturn: () => async ({getState}: ThunkParams<State>) => {
        const nowState = getState();
        const res = await mockFetchTodo();
        nowState.todo.push(...res); // modify directly
        // without return state
    },
}

export default {
  state,
  actions,
}
```

## NOTE

- from the test point of view, both returning state and not returning state can run normally, but no return action has no return value type where the action is called.
```ts
import store from 'store';

const user = store.getModule('user');

(async () => {
  const res1 =  user.actions.fetchTodo(); // here res1 is the State type of the user module
  const res2 = user.actions.fetchTodoWithoutReturn(); // the ts type of res2 here is the undefined type
})()

```


- `natur-immer` shallow copy immer drafted state is not supported for now, because the immer draft object will be released after executing this action, which is easy to report errors, but you can follow the old writing method
```ts

const demoActions = {
    // return immer draft
    goodAction: (age: number) => ({getState, setState}: ThunkParams<State>) => {
        const ns = getState();
        return {
            name: ns.name, // this is a value, not a draft object, so it works fine
            age,
        };
    },
    /**
     * copy and return a new object x
     * the immer object obtained by getState, but this object is proxied, so manual immutable writing is not recommended. In extreme cases, memory overflow may occur.
     */
    badAction: () => async ({getState}: ThunkParams<State>) => {
        const ns = getState();
        return {
            ...ns, // this will contain the draft object. After the action runs, the draft will be released, causing an error to occur.
            age,
        }
    },
}
```