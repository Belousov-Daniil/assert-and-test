### Assertion pipe testing library

*Bare minimum, just all you needs*

This small library provides an ability to create assertion pipelines and control it's flow via events callbacks.
Library contains two main entities:

```ts
class Assertion
```
```ts
class AssertionPipeline
```

`Assertion` - is a test statements, which can just assums, are provided assertion works as expected or return a proper value, etc. `AssertionPipeline` - your handler for create automated, and even looped testing, which provides you a controller on every potentially useful event.

With `AssertionPipeline` your testing flow becomes controlled with and within events. Why this library event exists and why is that in such way? Each test is thought as just part/shard of a testing processs, now you don't mind about tests as a separate modules, now you look at them at globally like the proccess of testing.

### How it works?

A single test is created with
```ts
function someFunctionToTest(logger) {
    return Promise.resolve(1)
};

new Assertion<boolean>(someFunctionToTest, (value) => value === 1 ).test()
```

If you want to start a lot of assertions, and maybe in loop

```ts
const values = [
    new Assertion<boolean>(someFunctionToTest1, (value) => value === 1 ),
    new Assertion<boolean>(someFunctionToTest2, (value) => value === 2 ),
    new Assertion<boolean>(someFunctionToTest3, (value) => value === 3 ),
]

const pipeline = new AssertionPipeline(values);
pipeline.run();
```

Pipeline, as an Assertion, are async, so it's can also be used as a api testing framework.
Pipeline provides all neccessary events that can be managed by user.

Api docs will be added later, support for UI wrapper is currently in development