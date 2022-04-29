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

- 返回state和不返回state均可以正常运行，但是无返回的action在调用action的地方是没有返回值类型的
```ts
import store from 'store';

const user = store.getModule('user');

(async () => {
  const res1 =  user.actions.fetchTodo(); // 这里的res1是user模型块的的State类型
  const res2 = user.actions.fetchTodoWithoutReturn(); // 这里的res2的ts类型是undefined类型
})()

```

- **设计思路：**`natur-immer`使用[中间件](/zh/natur/#中间件)，配合[immer](https://immerjs.github.io/immer/zh-CN/)的[patches](https://immerjs.github.io/immer/zh-CN/patches)功能，记录用户对`state`的操作历史，最后将此操作记录应用到**最新的state**上，如果你多次执行了`getState`并且在每个state上都进行了操作，那么`natur-immer`会将你本次action执行内的所有的`state`的操作记录，根据`state`获取顺序从前到后的将记录应用到最新的`state`上

```ts

const state = {
    age: 0,
}

const demoActions = {
    addAgeAction: (age: number) => ({getState, setState}: ThunkParams<State>) => {
        const ns = getState();
        ns.age = age; // 0 => age
        const ns2 = getState();
        ns2.age++; // age => 0 + 1 这是最终结果
        ns.age++; // 因为ns2是在ns后面获取的，所以这个结果会被ns2的最终结果覆盖
    },
}

```


- `natur-immer`暂不支持浅拷贝immer drafted state, 因为执行完此次的action会释放immer draft对象，容易报错, 但是可以遵循旧的写法
```ts

const demoActions = {
    // 返回immer draft对象
    goodAction: (age: number) => ({getState, setState}: ThunkParams<State>) => {
        const ns = getState();
        return {
            name: ns.name, // 这是一个值，并不是一个draft对象，所以可以正常运行
            age,
        };
    },
    /**
     * 复制并返回新的对象 x
     * getState获取的immer对象，但是这个对象是经过代理的，所以不建议手动的immutable写法，极端情况可能会导致内存溢出
     */
    badAction: () => async ({getState}: ThunkParams<State>) => {
        const ns = getState();
        return {
            ...ns, // 这里会包含draft对象，action运行完后，此draft会被释放，导致错误发生
            age,
        }
    },
}
```