# Change Log


## 2.2.0-beta2

### Big Change

- Refactor inject from Class Component to Functional Component
- New `CreateUseInject` API. `useInject` is recommended now.
- New `store.subscribeAll` API, listen to all module changes, no need to specify a module to listen to

### Break Change

- Remove `watch` API
- Upgrade to React version 18, no longer compatible with React versions below 17