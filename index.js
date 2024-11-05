import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

/**
 * ## Configuration
 *
 * This helper should be configured in codecept.conf.(js|ts)
 *
 * @typedef MockServerConfig
 * @type {object}
 * @prop {number} [port=9393] - Mock server port
 * @prop {string} [host="mock-service.test"] - Mock server host
 */
let config = {
    port: 9393,
    host: 'mock-service.test',
}

let server;
let handlers = [];
let response = {};

/**
 * Mock Server - powered by [msw](https://www.npmjs.com/package/msw)
 *
 * The MockServer Helper in CodeceptJS empowers you to mock any server or service via HTTP or HTTPS, making it an excellent tool for simulating REST endpoints and other HTTP-based APIs.
 *
 * <!-- configuration -->
 *
 * #### Examples
 *
 * You can seamlessly integrate MockServer with other helpers like REST or Playwright. Here's a configuration example inside the `codecept.conf.js` file:
 *
 * ```javascript
 * {
 *   helpers: {
 *     REST: {...},
 *     MockServer: {
 *       require: '@codeceptjs/msw-mock-server',
 *       // default mock server config
 *       port: 9393,
 *       host: 'mock-service.test',
 *     },
 *   }
 * }
 * ```
 *
 * #### Adding Interactions
 *
 * Interactions add behavior to the mock server. Use the `I.addInteractionToMockServer()` method to include interactions. It takes an interaction object as an argument, containing request and response details.
 *
 * ```javascript
 * I.addInteractionToMockServer({
 *    request: {
 *      method: 'GET',
 *      path: '/api/hello'
 *    },
 *    response: {
 *      status: 200,
 *      body: {
 *        'say': 'hello to mock server'
 *      }
 *    }
 * });
 * ```
 *
 * #### Request Matching
 *
 * When a real request is sent to the mock server, it matches the received request with the interactions. If a match is found, it returns the specified response; otherwise, a 404 status code is returned.
 *
 * ##### Match on Query Params
 *
 * You can send different responses based on query parameters:
 *
 * ```javascript
 * I.addInteractionToMockServer({
 *   request: {
 *     method: 'GET',
 *     path: '/api/users',
 *     queryParams: {
 *       id: 1
 *     }
 *   },
 *   response: {
 *     status: 200,
 *     body: 'user 1'
 *   }
 * });
 *
 * I.addInteractionToMockServer({
 *   request: {
 *     method: 'GET',
 *     path: '/api/users',
 *     queryParams: {
 *       id: 2
 *     }
 *   },
 *   response: {
 *     status: 200,
 *     body: 'user 2'
 *   }
 * });
 * ```
 *
 * - GET to `/api/users?id=1` will return 'user 1'.
 * - GET to `/api/users?id=2` will return 'user 2'.
 * - For all other requests, it returns a 404 status code.
 *
 * Happy testing with MockServer in CodeceptJS! 🚀
 *
 * ## Methods
 */
class MockService {
    constructor(passedConfig) {
        config = Object.assign(config, passedConfig)
    }

    /**
     * Start the mock server
     *
     * @returns void
     */
    async startMockServer() {
        server = setupServer()
        server.listen()
    }

    /**
     * Stop the mock server
     *
     * @returns void
     *
     */
    async stopMockServer() {
        await server.close()
    }

    /**
     * An interaction adds behavior to the mock server
     *
     *
     * ```js
     * I.addInteractionToMockServer({
     *    request: {
     *      method: 'GET',
     *      path: '/api/hello'
     *    },
     *    response: {
     *      status: 200,
     *      body: {
     *        'say': 'hello to mock server'
     *      }
     *    }
     * });
     * ```
     * ```js
     * // with query params
     * I.addInteractionToMockServer({
     *    request: {
     *      method: 'GET',
     *      path: '/api/hello',
     *      queryParams: {
     *       id: 2
     *     }
     *    },
     *    response: {
     *      status: 200,
     *      body: {
     *        'say': 'hello to mock server'
     *      }
     *    }
     * });
     * ```
     *
     * @param {CodeceptJS.MockInteraction|object} interaction add behavior to the mock server
     * @returns void
     *
     */
    async addInteractionToMockServer(interaction) {
        let _path = `${config.host}${interaction.request.path}`
        let _queryParams = '?'

        if (interaction.request.queryParams) {
            for (const [key, value] of Object.entries(interaction.request.queryParams)) {
                _queryParams += `${key}=${value}`
            }
        }

        response[_queryParams] = interaction.response.body

        handlers.push(http[interaction.request.method.toLowerCase()](`${_path}`, ({ request }) => {
            if (interaction.request.queryParams) {
                const url = new URL(request.url)
                return HttpResponse.json(response[url.search])
            }
            return HttpResponse.json(interaction.response.body)
        }))
        await server.use(...handlers)
    }
}

export default MockService
