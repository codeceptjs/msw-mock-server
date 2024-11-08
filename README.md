## MockServer

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [config](#config)
-   [Configuration](#configuration)
    -   [Properties](#properties)
-   [MockService](#mockservice)
    -   -   [Examples](#examples)
        -   [Adding Interactions](#adding-interactions)
        -   [Request Matching](#request-matching)
            -   [Match on Query Params](#match-on-query-params)
-   [Methods](#methods)
    -   [Parameters](#parameters)
    -   [startMockServer](#startmockserver)
    -   [stopMockServer](#stopmockserver)
    -   [addInteractionToMockServer](#addinteractiontomockserver)
        -   [Parameters](#parameters-1)

### config

### Configuration

This helper should be configured in codecept.conf.(js|ts)

Type: [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

-   `port` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?** Mock server port
-   `host` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Mock server host

### MockService

Mock Server - powered by [msw](https://www.npmjs.com/package/msw)

The MockServer Helper in CodeceptJS empowers you to mock any server or service via HTTP or HTTPS, making it an excellent tool for simulating REST endpoints and other HTTP-based APIs.

<!-- configuration -->

##### Examples

You can seamlessly integrate MockServer with other helpers like REST or Playwright. Here's a configuration example inside the `codecept.conf.js` file:

```javascript
{
  helpers: {
    REST: {...},
    MockServer: {
      require: '@codeceptjs/msw-mock-server',
      // default mock server config
      port: 9393,
      host: 'mock-service.test',
    },
  }
}
```

##### Adding Interactions

Interactions add behavior to the mock server. Use the `I.addInteractionToMockServer()` method to include interactions. It takes an interaction object as an argument, containing request and response details.

```javascript
I.addInteractionToMockServer({
   request: {
     method: 'GET',
     path: '/api/hello'
   },
   response: {
     status: 200,
     body: {
       'say': 'hello to mock server'
     }
   }
});
```

##### Request Matching

When a real request is sent to the mock server, it matches the received request with the interactions. If a match is found, it returns the specified response; otherwise, a 404 status code is returned.

###### Match on Query Params

You can send different responses based on query parameters:

```javascript
I.addInteractionToMockServer({
  request: {
    method: 'GET',
    path: '/api/users',
    queryParams: {
      id: 1
    }
  },
  response: {
    status: 200,
    body: 'user 1'
  }
});

I.addInteractionToMockServer({
  request: {
    method: 'GET',
    path: '/api/users',
    queryParams: {
      id: 2
    }
  },
  response: {
    status: 200,
    body: 'user 2'
  }
});
```

-   GET to `/api/users?id=1` will return 'user 1'.
-   GET to `/api/users?id=2` will return 'user 2'.
-   For all other requests, it returns a 404 status code.

Happy testing with MockServer in CodeceptJS! 🚀

### Methods

#### Parameters

-   `passedConfig`  

#### startMockServer

Start the mock server

Returns **any** void

#### stopMockServer

Stop the mock server

Returns **any** void

#### addInteractionToMockServer

An interaction adds behavior to the mock server

```js
I.addInteractionToMockServer({
   request: {
     method: 'GET',
     path: '/api/hello'
   },
   response: {
     status: 200,
     body: {
       'say': 'hello to mock server'
     }
   }
});
```

```js
// with query params
I.addInteractionToMockServer({
   request: {
     method: 'GET',
     path: '/api/hello',
     queryParams: {
      id: 2
    }
   },
   response: {
     status: 200,
     body: {
       'say': 'hello to mock server'
     }
   }
});
```

##### Parameters

-   `interaction` **(CodeceptJS.MockInteraction | [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** add behavior to the mock server

Returns **any** void
