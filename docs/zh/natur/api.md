---
sidebarDepth: 2
sidebar: auto
---
# api

## createStore 

创建store实例

```typescript
createStore(
  modules?: Modules,
  lazyModules: LazyStoreModules,
  options?: {
    middlewares?: Middleware[],
    interceptors?: Interceptor[],
  }
) => Store;
```
## store api



### NaturContext <Badge text="2.2.0+" />

```tsx
import {Provider} from 'natur';

function App() {
  return (
    // 这个store将被优先应用在 inject/useInject/useStore等API中
    <Provider store={store}>
      { /* other code */ }
    </Provider>
  )
}

```

### createUseStore <Badge text="2.2.0+" />

```typescript

const useStore = createUseStore(() => store);

// 在某个组件内
// 优先从Context中获取store
const store = useStore();
// 在某个组件内

```


### getModule 
获取模块

```typescript
store.getModule('moduleName') => InjectStoreModule
```

### setModule 
初始化/设置模块

```typescript
store.setModule('moduleName', StoreModule) => Store;
```

### removeModule 
移除模块

```typescript
store.removeModule('moduleName') => Store;
```


### setLazyModule 
初始化/设置懒加载模块

```typescript
store.setLazyModule('moduleName', () => Promise<StoreModule>) => Store;
```

### removeLazyModule 
移除懒加载模块

```typescript
store.removeLazyModule('moduleName') => Store;
```

### hasModule 
判断当前已加载模块中是否存在某模块

```typescript
store.hasModule('moduleName') => boolean;
```

### loadModule 
加载某懒加载模块, 如果该模块已经加载则返回已经加载的模块
```typescript
store.loadModule('moduleName') => Promise<InjectStoreModule>;
```


### getOriginModule 
获取未包装的模块

```typescript
store.getOriginModule('moduleName') => StoreModule;
```

### getLazyModule 
获取懒加载模块的加载函数

```typescript
store.getLazyModule('moduleName') => () => Promise<StoreModule>;
```


### subscribe 
订阅/监听模块

```typescript
export type ModuleEvent = {
  type: 'init' | 'update' | 'remove',
  actionName?: string,
};

export interface Listener {
  (me: ModuleEvent): any;
}

store.subscribe('moduleName', listener: Listener) => Function;
```

### subscribeAll <Badge text="2.2.0+" />
订阅/监听所有模块

```typescript
export type ModuleEvent = {
  type: 'init' | 'update' | 'remove',
  actionName?: string,
  moduleName: string,
};

export interface AllListener {
  (me: ModuleEvent): any;
}

store.subscribeAll(listener: AllListener) => Function;
```

### getAllModuleName 
获取所有模块的模块名

```typescript
store.getAllModuleName('moduleName') => string[];
```


### dispatch 
执行action

```typescript
store.dispatch(moduleName, actionName, ...actionArg: any[]) => ReturnType<Action>;
```

### destroy 
销毁store

```typescript
store.destroy() => void;
```


### globalSetStates

全局设置state

```typescript
// 手动设置所有的state，传入模块名，以及对应的state，则会更新，并推送通知
store.globalSetStates({
  [mn: moduleName]: State;
})
```


### globalResetStates

全局初始化state

```typescript
// 使用store初始化所有模块的state，并推送通知
// 可以通过，exclude，include过滤不需要初始化的模块, exclude优先级高于include
store.globalResetStates({
  exclude: Arrary<string|RegExp>;
  include: Arrary<string|RegExp>,
})
```


### getAllStates
获取所有state

```ts
store.getAllStates();
```


## inject api


### createUseInject <Badge text="2.2.0+" />

```ts
const useInject = createUseInject(() => Store);

/**
 * 在组件内部
 */
const moduleA = useInject('moduleA');
/**
 * 如果你想监听模块的部分状态，用法类似inject
 */
const moduleB = useInject('moduleB', {
  state: ['b', s => s.xxx], // 只有state中的b、xxx变动才会触发更新
  maps: ['aaa'] // 只有maps中的aaa属性变动才会触发更新
});

```

### createInject

```typescript
createInject({
  storeGetter: () => Store,
  loadingComponent: React.ComponentClass<{}> | React.FC<{}>
})

```


### inject

```typescript

type ModuleDepDec = [string, {
  state?: Array<string|Function>;
  maps?: Array<string>;
}]
type TReactComponent<P> = React.FC<P> | React.ComponentClass<P>;

type StoreProps = {[m: string]: InjectStoreModule}

inject(...moduleDec: Array<string|ModuleDepDec>) 
=> <P extends T>(
  WrappedComponent: TReactComponent<P>, 
  LoadingComponent?: TReactComponent<{}>
) => React.ComponentClass<Omit<P, keyof T> & { forwardedRef?: React.Ref<any> }>

```

