# umi-natur

The umi plugin that automatically generates natur code is super easy to use

## install

```bash
# or yarn add umi-natur -D
$ npm install umi-natur -D
```

## use

Configure in `.umirc.ts`,

```ts
export default {
  plugins: [
    // configure natur plugin to umi
    ['umi-natur'],
  ],
  natur: {
    /* see parameter introduction for details */
    persist: { /* ... */ },
    service: { /* ... */ },
  }
}
```

# parameter introduction

## natur

- **type:**`object`
- The plugin will automatically scan the files under the store folder by default, if the legal natur module is exported by default, it will be captured by the plugin, and generate the code under .umi/store

```ts
// you can use like this
import {store, inject} from 'umi';
```

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


#### demo

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



#### demo

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

## service

- **required:** `false`
- **type:**`object`
- The plugin will scan the code in the service folder. If there are Service classes in the files in this folder that are exported by default, then the code for Service instantiation will be automatically generated under .umi/service

### dirName

- **type:**`string`
- **default:**`'service'`
- The plug-in scans the code in the service folder. If there are files in this folder, Service classes are exported by default
- Then the code for Service instantiation will be automatically generated under .umi/service

### superClassName

- **type:**`string`
- **default:**`'BaseService'`
- The key to identifying whether it is a Service class is that if the class is integrated in BaseService, it will be exported
- Similarly, if you define a Service base class yourself, then you can also modify the scan configuration

### ignore

- **required:** `false`
- **type:** `RegExp[]`
- If you do not want some Service classes to be automatically generated code, then you can configure the ignored class name


## LICENSE

MIT
