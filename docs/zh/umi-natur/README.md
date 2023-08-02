---
sidebarDepth: 3
---
# umi-natur

- 自动生成 natur 代码的 umi 插件，超级好用
- 支持自动配置natur
- 支持自动扫描natur模块代码并导入
- 支持ssr场景
- 支持自动扫描service代码，并自动配置，同样servcie也可以应用于ssr场景
- 支持persist配置
- 支持immer插件


## 安装

```bash
# or npm install umi-natur -D
$ yarn add umi-natur -D

# or npm install natur -S
$ yarn add natur
```

## 版本对照

|umi-natur | umi |
|---|---|
|1.x|3.x|
|2.x|4.x|

## 普通使用方式

1. 首先添加配置`.umirc.ts`,

```ts
export default {
  plugins: [
    // 配置natur插件到umi
    'umi-natur',
  ],
  natur: {}
}
```
2. 创建你的natur模块
`store/count.ts`
```ts

const state = 0;
const actions = {
  update: (newState: number) => newState,
};

const count = {
  // name: 'you-module-name', 你可以通过name来配置你模块的名字
  state,
  actions,
};

export default count;

```

3. 使用你的模块
```tsx
import React, { useEffect } from 'react';
import { inject } from 'umi';

const injector = inject('count');

const App = ({count}: typeof injector.type) => {
  useEffect(() => {
    count.actions.update(1);
  }, [])
  return (
    <div>{count.state}</div>
  );
};

export default injector(App);
```


## ssr使用场景

::: tip 最低版本要求
umi >= 3.4.14\
umi-natur >= 1.1.1
:::


`.umirc.ts`配置文件

```ts {3}
export default {
  plugins: ['umi-natur'],
  ssr: {},
  natur: {}
}
```

示例页面`index.tsx`
```tsx
import React, { useEffect } from 'react';
import { inject, Store } from 'umi';

const injector = inject('aModule');

const App = ({aModule}: typeof injector.type) => {
  useEffect(() => {
    // 客户端执行一个action
    aModule.actions.aAction();
  }, [])
  return <div>...</div>;
};

App.getInitialProps = async ({store}: {store: Store}) => {
  // 服务端执行一个action，这里的代码不会在客户端执行，所以你要在客户端重复执行一次
  await store.dispatch('aModule', 'aAction');
  // 必须把数据返回给客户端使用
  return store.getAllStates();
}

export default injector(App);
```


# 参数
## natur


- **类型：**`object`
- 插件默认会自动扫描store文件夹下面的文件, 如果是合法的natur模块被默认导出，那么会被插件捕捉到，并将导入代码生成在.umi/store下
- demo

  `src/store/demo.ts`
  ```ts
  const state = {
    /* ... */
  }
  const actions = {
    /* ... */
  }
  export default {
    state,
    actions,
  }
  ```
  `use-store-and-inject.ts`
  ```ts
  import {store, inject} from 'umi';

  const demo = store.getModule('demo');
  const injector = inject('demo');
  ```
- 文件路径会被转化为模块名，例如：
  - `src/store/modulea-list.ts`会转化为`moduleaList`
  - `src/store/module_a/list/[id$].ts`会转化为`moduleAListId`

### dirName

- **必填：** `false`
- **类型：**`string`
- **默认值：**`'store'`
- 插件默认你的natur模块代码是写在store文件夹下的如果你的模块是写在其他文件夹下，你也可以修改，比如'pages'


### isSyncModule
- **必填：** `false`
- **类型：**`(filePath: string) => boolean`
- 根据文件地址判断，这个模块是否同步模块, 不是同步模块就是异步模块


### interceptors
- **必填：** `false`
- **类型：**`string`
- 你的interceptors文件地址
- 这个文件地址必须是默认导出的函数
- 这个函数的入参是一个获取store的函数，这个函数的返回值必须是一个intercepter数组


- demo

  `.umirc.ts`
  ```ts
  export default {
    plugins: [
      ['umi-natur'],
    ],
    natur: {
      interceptors: '@/my-interceptors.ts',
    }
  }
  ```

  `my-interceptors.ts`
  ```ts
  export default (getStore: () => Store) => {
    return [
      // ...your interceptors
    ];
  }
  ```

### middlewares
- **必填：** `false`
- **类型：**`string`
- 你的middlewares文件地址
- 这个文件地址必须是默认导出的函数
- 这个函数的入参是一个获取store的函数，这个函数的返回值必须是一个middlewares数组
- 一旦你自定义了中间件，那么默认的中间件会被移除，中间件的配置将完全由你决定
- demo

  `.umirc.ts`
  ```ts
  export default {
    plugins: [
      ['umi-natur'],
    ],
    natur: {
      middlewares: '@/my-middlewares.ts',
    }
  }
  ```

  `my-middlewares.ts`
  ```ts
  export default (getStore: () => Store) => {
    return [
      // ...your middlewares
    ];
  }
  ```

## persist

- **必填：** `false`
- **类型：** `object`
- 这个是持久化配置
- 跟[natur-persist](/zh/natur-persist)配置一样

## useImmer

- **必填：** `false`
- **类型：** `boolean`
- 这是是否开启`natur-immer`插件
- 使用详情请看[natur-immer](/zh/natur-immer/#使用)

::: tip 最低版本要求
umi-natur >= 1.1.7
:::


## LICENSE

MIT
