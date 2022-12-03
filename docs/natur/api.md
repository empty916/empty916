
# api

## createStore

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

### getModule

```typescript
store.getModule('moduleName') => InjectStoreModule
```

### setModule

```typescript
store.setModule('moduleName', StoreModule) => Store;
```

### removeModule

```typescript
store.removeModule('moduleName') => Store;
```


### setLazyModule

init/set lazy module

```typescript
store.setLazyModule('moduleName', () => Promise<StoreModule>) => Store;
```

### removeLazyModule
remove lazy modul

```typescript
store.removeLazyModule('moduleName') => Store;
```


### hasModule

```typescript
store.hasModule('moduleName') => boolean;
```

### loadModule

load lazy module
If the module is already loaded, return the already loaded module

```typescript
store.loadModule('moduleName') => Promise<InjectStoreModule>;
```


### getOriginModule

```typescript
store.getOriginModule('moduleName') => StoreModule;
```

### getLazyModule

getLazyModule import function

```typescript
store.getLazyModule('moduleName') => () => Promise<StoreModule>;
```


### subscribe

listen module change

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

### getAllModuleName

```typescript
store.getAllModuleName('moduleName') => string[];
```


### dispatch
run action

```typescript
store.dispatch(moduleName, actionName, ...actionArg: any[]) => ReturnType<Action>;
```

### destroy store

```typescript
store.destroy() => void;
```


### globalSetStates

```ts
// Manually set all state, incoming module name, and corresponding state, it will be updated, and push notification
store.globalSetStates({
  [mn: moduleName]: State;
})
```


### globalResetStates

```typescript
// Use store to initialize the state of all modules and push notifications
// You can pass, exclude, include to filter modules that do not need to be initialized, exclude is higher than include
store.globalResetStates({
  exclude: Arrary<string|RegExp>;
  include: Arrary<string|RegExp>,
})
```


### get all states

```ts
store.getAllStates();
```


## inject api


### createInject

```ts
createInject({
  storeGetter: () => Store,
  loadingComponent: React.ComponentClass<{}> | React.FC<{}>
})

```


### inject

```ts

type ModuleDepDec = [string, {
  state?: Array<string|Function>;
  maps?: Array<string>;
}]
type TReactComponent<P> = React.FC<P> | React.ComponentClass<P>;

type StoreProps = {[m: string]: InjectStoreModule}

inject<T extends StoreProps>(...moduleDec: Array<string|ModuleDepDec>) 
=> <P extends T>(
  WrappedComponent: TReactComponent<P>, 
  LoadingComponent?: TReactComponent<{}>
) => React.ComponentClass<Omit<P, keyof T> & { forwardedRef?: React.Ref<any> }>

```
