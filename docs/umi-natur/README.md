# umi-natur

- the umi plug-in that automatically generates natur code is super easy to use
- support automatic configuration of natur
- support automatic scanning of natur module code and import
- support ssr scene
- support automatic scanning of service code and automatic configuration, the same servcie can also be applied to ssr scenarios
- support persist configuration
- support natur-immer
## install

```bash
# or npm install umi-natur -D
$ yarn add umi-natur -D

# or npm install natur -S
$ yarn add natur
```

## version map

|umi-natur | umi |
|---|---|
|1.x|3.x|
|2.x|4.x|

## common use

1. at first, config your `.umirc.ts`,

```ts
export default {
  plugins: [
    // configure natur plugin to umi
    'umi-natur',
  ],
  natur: {}
}
```


2. then create natur module
`store/count.ts`
```ts

const state = 0;
const actions = {
  update: (newState: number) => newState,
};

const count = {
  // name: 'you-module-name', you can custom you module name by name option
  state,
  actions,
};

export default count;

```

3. use natur module
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


## ssr usecase

::: tip Minimum Version Requirements
umi >= 3.4.14\
umi-natur >= 1.1.1
:::

Configure in `.umirc.ts`,

```ts {3}
export default {
  plugins: ['umi-natur'],
  ssr: {},
  natur: {}
}
```

`index.tsx`
```tsx
import React, { useEffect } from 'react';
import { inject, Store } from 'umi';

const injector = inject('aModule');

const App = ({aModule}: typeof injector.type) => {
  useEffect(() => {
    // run client side action
    aModule.actions.aAction();
  }, [])
  return return <div>...</div>;
};

App.getInitialProps = async ({store}: {store: Store}) => {
  // run server side action. The code here will not be executed on the client side, so you have to execute it again on the client side
  await store.dispatch('aModule', 'aAction');
  // must return all states to client
  return store.getAllStates();
}

export default injector(App);
```



# parameter introduction

## natur

- **type:**`object`
- The plugin will automatically scan the files under the store folder by default, if the legal natur module is exported by default, it will be captured by the plugin, and generate the code under .umi/store
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
- The file path will be converted to the module name, for example:
  - `src/store/modulea-list.ts`will be transformed into`moduleaList`
  - `src/store/module_a/list/[id$].ts`will be transformed into`moduleAListId`

### dirName

- **required:** `false`
- **type:**`string`
- **default:**`'store'`
- The plugin defaults that your natur module code is written in the store folder. If your module is written in other folders, you can also modify it, such as 'pages'


### isSyncModule
- **required:** `false`
- **type:**`(filePath: string) => boolean`
- according to the file address, determine whether this module is a synchronous module, either a synchronous module or an asynchronous module


### interceptors
- **required:** `false`
- **type:**`string`
- your interceptors file address
- This file address must be the default exported function
- The input parameter of this function is a function to get store, and the return value of this function must be an intercepter array
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
- **required:** `false`
- **type:**`string`
- Your middlewares file address
- This file address must be the default exported function
- The input parameter of this function is a function to get store, and the return value of this function must be an array of middlewares
- Once you customize the middleware, the default middleware will be removed, and the configuration of the middleware will be completely up to you
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

- **required:** `false`
- **type:**`object`

- This is the persistent configuration
- Same as [natur-persist](/natur-persist) configuration


## useImmer

- **required:** `false`
- **type:**`boolean`

- This is the `natur-immer` configuration
- you can visit [natur-immer](/natur-immer/#usage) for usage information

::: tip minium version
umi-natur >= 1.1.7
:::


## LICENSE

MIT
