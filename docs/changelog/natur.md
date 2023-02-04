# Change Log



## 2.2.0-beta5 (2023-02-04)

### Big Change

- New `Provider` API, better support for SSR and more than one store case.
- New `CreateUseStore` API.
- New `getStore` Arguments of Middleware and Interceptor
- Generics `Middleware`/`Interceptor` changed，They need 2 params(Modules and Lazy Modules, same as `Store`), and also have default params

## 2.2.0-beta2 (2022-12-18)

### Big Change

- Refactor inject from Class Component to Functional Component
- New `CreateUseInject` API. `useInject` is recommended now.
- New `store.subscribeAll` API, listen to all module changes, no need to specify a module to listen to

### Break Change

- Remove `watch` API
- Upgrade to React version 18, no longer compatible with React versions below 17
