# Change Log


## 1.0.10 (2023-03-25)

### withAPI improve

- withAPI will control the parameters passed in at runtime, if the number of parameters is the same as declared, withAPI will not change anything, if the number of parameters is not the same as declared, such as more or less, withAPI will remove the extra parameters or fill the same parameters As expected, **the withAPI operation cannot take optional parameters**, it would break the function length and cause an error


## 1.0.8 (2023-02-25)

### Big change

- The dispatch API in `thunkMiddleware` will soon be scrapped and replaced with a new `localDispatch` API that will only call actions from this module
- New Api `withImmerAPIInterceptor`, see document for more detail


## 1.0.8-beta1 (2023-02-06)

### Big change

- The dispatch API in `thunkMiddleware` will soon be scrapped and replaced with a new `localDispatch` API that will only call actions from this module
