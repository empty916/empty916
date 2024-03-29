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
import { thunkMiddlewarem } from 'natur-immer';

export const store = createStore({/* ... */}, {/* ... */}, {
  middlewares: [
    thunkMiddleware, // use natur-immer's thunkMiddleware
  ]
});
```

### usage

**this is a user module demo**

`user-module.ts`
```ts
import { ITP } from 'natur-immer';

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


}

export default {
  state,
  actions,
}
```


## NaturFactory

- NaturFactory inherits NaturBaseFactory and overrides actionsCreator.

    ```ts
    import { NaturFactory } from 'natur-immer';

    const state = {
        count: 1,
    };

    const createMap = NaturFactory.mapCreator(state);

    const maps = {
        isOdd: createMap(
            s => s.count,
            count => count % 2 === 1
        )
    }
    // The second parameter is optional; if you don't have maps, you don't need to pass it
    const createActions = NaturFactory.actionsCreator(state, maps);

    const actions = createActions({
        // The type of 'api' here will be automatically suggested, no need to manually declare
        updateCount: (count: number) => api => {
            api.setState(count)
        }
    })

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

