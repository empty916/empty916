---
sidebarDepth: 2
---

# natur-immer
- 将immer集成到natur中的中间件


## 安装

```bash
# npm install natur-immer -S
$ yarn install natur-immer
```

## 介绍

1. 将immer集成到natur中，使得在action中修改state时，只需使用mutable的写法即可

## 教程

### 替换`thunkMiddleware`

**将`natur`的`thunkMiddleware`替换为`natur-immer`的`thunkMiddleware`**

```ts {2,6}
import { createStore } from 'natur';
import { thunkMiddleware } from 'natur-immer';

export const store = createStore({/* ... */}, {/* ... */}}, {
  middlewares: [
      thunkMiddleware, // 使用natur-immer的thunkMiddleware中间件即可
  ]
});
```

### 使用

**这里我们以用户模块为例子**

`user-module.ts`
```ts
import { ThunkParams } from 'natur/dist/middlewares';

// 这是mock从后端获取用户的待办事项方法
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

// 这是用户信息
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
// 用户state类型
type State = typeof state;


const actions = {
    // 更新用户年龄
    updateAge: (age: number) => ({getState}: ThunkParams<State>) => {
        const ns = getState();
        ns.age = age;
        return ns;
    },
    // 更新用户todo，返回state
    fetchTodo: () => async ({getState}: ThunkParams<State>) => {
        const res = await mockFetchTodo();
        const nowState = getState();
        nowState.todo.push(...res); // 直接修改
        return nowState; // 然后返回这state(推荐返回)
    },
    // 更新用户todo，不返回state
    fetchTodoWithoutReturn: () => async ({getState}: ThunkParams<State>) => {
        const nowState = getState();
        const res = await mockFetchTodo();
        nowState.todo.push(...res); // 直接修改
        // 或者不返回
    },
}

export default {
  state,
  actions,
}
```

## NOTE

- 从测试看，返回state和不返回state均可以正常运行，但是无返回的action在调用action的地方是没有返回值类型的
```ts
import store from 'store';

const user = store.getModule('user');

(async () => {
  const res1 =  user.actions.fetchTodo(); // 这里的res1是user模型块的的State类型
  const res2 = user.actions.fetchTodoWithoutReturn(); // 这里的res2的ts类型是undefined类型
})()

```