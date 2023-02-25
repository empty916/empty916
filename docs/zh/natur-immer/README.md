---
sidebarDepth: 2
---

# natur-immer

- 将 immer 集成到 natur 中的中间件

## 安装

```bash
# npm install natur-immer -S
$ yarn install natur-immer
```

## 介绍

1. 将 immer 集成到 natur 中，使得在 action 中修改 state 时，只需使用 mutable 的写法即可

## 教程

### 替换`thunkMiddleware`

**将`natur`的`thunkMiddleware`替换为`natur-immer`的`thunkMiddleware`**

```ts {2,6,9}
import { createStore } from 'natur';
import { thunkMiddleware, withImmerAPIInterceptor } from 'natur-immer';

export const store = createStore({/* ... */}, {/* ... */}}, {
  middlewares: [
      thunkMiddleware, // 使用natur-immer的thunkMiddleware中间件
  ],
  interceptors: [
    withImmerAPIInterceptor, // 使用natur-immer的withImmerAPIInterceptor中间件
  ]
});
```

### 使用

**这里我们以用户模块为例子**

`user-module.ts`

```ts
import { ITP, withAPI, WIA } from 'natur-immer';

// 这是mock从后端获取用户的待办事项方法
const mockFetchTodo = () =>
  new Promise<{ name: string; status: number }[]>((res) =>
    res([
      {
        name: "play game",
        status: 0,
      },
      {
        name: "work task1",
        status: 0,
      },
    ])
  );

// 这是用户信息
const state = {
  name: "tom",
  age: 10,
  todo: [
    {
      name: "study english",
      status: 0,
    },
  ],
};
// 用户state类型
type State = typeof state;

const actions = {
  // 更新用户年龄
  updateAge: (age: number) => ({ setState }: ITP<State>) => {
    // setState就像immer中的produce
    return setState((state) => {state.age = age});
  },
  // 更新用户todo，返回state
  fetchTodo: () => async ({ setState }: ITP<State>) => {
    const res = await mockFetchTodo();
    return setState((state) => {
      state.todo.push(...res); // 直接修改
    }); // 然后返回这state(推荐返回)
  },
  // 更新用户todo，不返回state
  fetchTodoWithoutReturn: () => async ({
    setState,
  }: ITP<State>) => {
    const res = await mockFetchTodo();
    setState((state) => {
      // 或者不返回
      state.todo.push(...res);
    });
  },

  // 你也可以使用withAPI的方式
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

};

export default {
  state,
  actions,
};
```

## NOTE

- 返回 state 和不返回 state 均可以正常运行，但是无返回的 action 在调用 action 的地方是没有返回值类型的

```ts
import store from "store";

const user = store.getModule("user");

(async () => {
  const res1 = user.actions.fetchTodo(); // 这里的res1是user模型块的的State类型
  const res2 = user.actions.fetchTodoWithoutReturn(); // 这里的res2的ts类型是undefined类型
})();
```
