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



- after `getState()`, the state must be saved. It cannot be obtained repeatedly and the corresponding state cannot be saved. This will cause the state information to not be saved in time. If the state is only obtained once, this problem does not exist.

```ts

const demoActions = {
    // every state is saved
    goodAction: (age: number) => ({getState, setState}: ThunkParams<State>) => {
        const ns = getState();
        ns.age = age;
        setState(ns); // save state

        const ns2 = getState(); // 重复获取
        ns2.name = 'xxx'
        return ns; // save state
    },
    // get the state only once, natur-immer will recognize it and save it for you automatically
    goodAction2: (age: number) => ({getState, setState}: ThunkParams<State>) => {
        const ns = getState();
        ns.age = age;
    },
    // get the state only once, and manually return to the state to save it
    goodAction3: (age: number) => ({getState, setState}: ThunkParams<State>) => {
        const ns = getState();
        ns.age = age;
        return ns;
    },
    // each state is not saved, which will cause an error
    badAction: () => async ({getState}: ThunkParams<State>) => {
        const ns = getState();
        ns.age = age;
        // ns dose not save
        const ns2 = getState(); // repeat get
        ns2.name = 'xxx'
        // ns2 dose not save
        // this will print error
    },
}

```