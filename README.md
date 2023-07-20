### Testing library

*Bare minimum, just all you need*

Library provide ability to create assertion pipelines and controller it via events.
It provides two main entities:

```ts
class Assertion
```
```ts
class AssertionPipeline
```

`Assertions` - is a test statements, which can test logic within itself, and `AssertionPipeline `- a big handler, for assertions.

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

Api docs will be added later, support for UI wrapped is currently in development