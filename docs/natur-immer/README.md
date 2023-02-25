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

```ts {2,6,9}
import { createStore } from 'natur';
import { thunkMiddlewarem, withImmerAPIInterceptor } from 'natur-immer';

export const store = createStore({/* ... */}, {/* ... */}, {
  middlewares: [
    thunkMiddleware, // use natur-immer's thunkMiddleware
  ],
  interceptors: [
    withImmerAPIInterceptor, // use natur-immer's withImmerAPIInterceptor
  ]
});
```

### usage

**this is a user module demo**

`user-module.ts`
```ts
import { ITP, withAPI, WIA } from 'natur-immer';

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
    updateAge: (age: number) => ({setState}: ITP<State>) => {
        // setState like produce in immer
        return setState(state => {state.age = age});
    },
    // update user todo，return state
    fetchTodo: () => async ({setState}: ITP<State>) => {
        const res = await mockFetchTodo();
        return setState(state => {
            state.todo.push(...res); // modify directly
        }); // return new state(recommend return)
    },
    // update user todo，without return state
    fetchTodoWithoutReturn: () => async ({setState}: ITP<State>) => {
        const res = await mockFetchTodo();
        setState(state => {
            state.todo.push(...res); // modify directly
        }); // without return state
    },


    // your can also use withAPI mode
    updateAge: withAPI((age: number, {setState}: WIA<State>) => {
        return setState(state => {state.age = age});
    }),
    fetchTodo: withAPI(async ({setState}: WIA<State>) => {
        const res = await mockFetchTodo();
        return setState(state => {
            state.todo.push(...res);
        });
    }),
    fetchTodoWithoutReturn: withAPI(async ({setState}: WIA<State>) => {
        const res = await mockFetchTodo();
        setState(state => {
            state.todo.push(...res);
        });
    }),

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

