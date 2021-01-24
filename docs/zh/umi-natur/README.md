# umi-natur

自动生成 natur 代码的的 umi 插件，超级好用

## 安装

```bash
# or yarn add umi-natur -D
$ npm install umi-natur -D
```

## 使用方式

Configure in `.umirc.ts`,

```ts
export default {
  plugins: [
    // 配置natur插件到umi
    ['umi-natur'],
  ],
  natur: {
    /* 详情见参数介绍 */
    persist: { /* ... */ },
    service: { /* ... */ },
  }
}
```

## 参数

### natur

- **类型：**`object`
插件默认会自动扫描store文件夹下面的文件
如果是合法的natur模块被默认导出，那么会被插件捕捉到，
并将导入代码生成在.umi/store下
```ts
// 你可以这么使用
import {store, inject} from 'umi';
```

### natur.dirName

- **必填：** `false`
- **类型：**`string`
- **默认值：**`'store'`
- 插件默认你的natur模块代码是写在store文件夹下的如果你的模块是写在其他文件夹下，你也可以修改，比如'pages'


### natur.isSyncModule
- **必填：** `false`
- **类型：**`(filePath: string) => boolean`
- 根据文件地址判断，这个模块是否同步模块, 不是同步模块就是异步模块


### natur.interceptors
- **必填：** `false`
- **类型：**`string`
- 你的interceptors文件地址
- 这个文件地址必须是默认导出的函数
- 这个函数的入参是一个获取store的函数，这个函数的返回值必须是一个intercepter数组


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

### natur.middlewares
- **必填：** `false`
- **类型：**`string`
- 你的middlewares文件地址
- 这个文件地址必须是默认导出的函数
- 这个函数的入参是一个获取store的函数，这个函数的返回值必须是一个middlewares数组
- 一旦你自定义了中间件，那么默认的中间件会被移除，中间件的配置将完全由你决定



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

### natur.persist

- **必填：** `false`
- **类型：** `object`
- 这个是持久化配置
- 跟[natur-persist](/zh/natur-persist)配置一样

### natur.service

- **必填：** `false`
- **类型：** `object`
- 插件会扫描service文件夹下的代码，如果在这个文件夹下的文件，有Service类被默认导出, 那么Service实例化的代码会被自动生成在.umi/service下

### natur.service.dirName

- **类型：**`string`
- **默认值：**`'service'`
- 插件会扫描service文件夹下的代码，如果在这个文件夹下的文件，有Service类被默认导出
- 那么Service实例化的代码会被自动生成在.umi/service下

### natur.service.superClassName

- **类型：**`string`
- **默认值：**`'BaseService'`
- 识别是否是Service class的关键是，如果类是集成于BaseService，才会被导出
- 同样，如果你是自己定义了一个Service基类，那么你也可以修改这个扫描配置

### natur.service.ignore

- **必填：** `false`
- **类型：** `RegExp[]`
- 如果你并不想让某些Service类被自动生成代码，那么你可以配置忽略的类名


## LICENSE

MIT
