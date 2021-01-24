---
sidebarDepth: 2
---

# natur-service
The call layer design of natur action is used to aggregate multiple actions into a certain business flow. It is suitable for complex business scenarios. The separation of advanced scenarios can better maintain a single action and expand business.

## associated natur version

| natur | natur-service |
| -- | -- |
| 2.0.0 | 2.0.0 |
| 2.1.x | 2.1.x |

## demo

```typescript
import store from "your-natur-store-instance";
import NaturService from "natur-service";
import { InjectStoreModule, State } from "natur";

// sync modules of your store
type M = typeof modules;
// lazy modules of your store
type LM = typeof lazyModules;

class BaseService extends NaturService<M, LM> {
  /**
   * for server side render， bind your store instance to every service instance
   * also you can make it optional.
   */
  constructor(s: typeof store = store) {
    super(s);
    this.start();
  }
  start() {}
}


class UserService extends BaseService {
  start() {
    // get store instanse
    this.store;
    this.getStore();

    // watch the user module
    this.watch("user", (moduleEvent: {
        type: "init" | "update" | "remove"; // user module change type, please see natur document for details
        actionName: string; // the name of the action that triggered the user change
        state: State; // new user state
        oldModule: InjectStoreModule; // old user module data
        newModule: InjectStoreModule; // new user module data
      }) => {
        // callback function when the user module changes
        if (state) {
          // The dispatch here is different from natur's dispatch, 
          // it can push lazy-loaded modules that have not been loaded,
          // or manually loaded modules that are not configured
          this.dispatch("app", "syncUserData", state);
          
          /**
           * When the push is repeated, 
           * but the module is still not loaded, 
           * natur-service will stop the last push and throw the following error
           * {
           *  code: 0,
           *  message: 'stop the last dispath!'
           * }
           * in order to ensure that the same type of push only keeps the latest push, 
           * to prevent stack overflow,
           * if you don't like the handling of throwing errors, then you can override this method
           */
          this.dispatch("app", "syncUserData", state);
        }
      }
    );
  }
  // other business logic
}

const userService = new UserService(store);

userService.destroy();
userService = null;
```


## NOTE

- You should not use service in the store module, because the initialization of the service depends on the initialization of the store, which will cause circular references.