# Change Log


## 3.0.0-alpha2 (2023-02-06)

### Big change

- The function of `Natur-service` will be transplanted to natur itself and changed into a new `watch` API for module communication and better grasp of business

    ```ts
    import { ModuleEvent, AllModuleEvent, WatchAPI } from 'natur';
    export const moduleA = {
        state: {},
        actions: {/* ... */},
        watch: {
            moduleB(event: ModuleEvent, api: WatchAPI) {
                // any update of moduleB will trigger this function
                // event have any data of this change
                // api contain, getState, getMaps, localDispatch, getStore API etc.
            }
        }
    }
    export const moduleB = {
        state: {},
        actions: {/* ... */},
        // watch also can be a function to watch all module of store
        watch: (event: AllModuleEvent, api: WatchAPI) => { 
                // any update of any module will trigger this function
                // event have any data of this change
                // api contain, getState, getMaps, localDispatch, getStore API etc.
        }
    }
    ```
- The dispatch API in `thunkMiddleware` will soon be scrapped and replaced with a new `localDispatch` API that will only call actions from this module
- The `subscribe` and `SubscribeAll` API is enhanced to provide more comprehensive event information, as well as API argument to control the business

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
