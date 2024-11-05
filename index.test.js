import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import MockService from './index.js';
const apiUrl = 'http://example.com'

describe('MockService', () => {
    let I;
    let addInteractionToMockServerSpy

    beforeEach(async () => {
        I = new MockService({ host: apiUrl })
        await I.startMockServer();
        addInteractionToMockServerSpy = jest.spyOn(I, 'addInteractionToMockServer');
    });

    afterEach(async () => {
        addInteractionToMockServerSpy.mockRestore();
        await I.stopMockServer();
    })

    test('should start the mock server', async () => {
        expect(I.constructor.name).toBe('MockService');
    });

    test('should stop the mock server', async () => {
        const stopMockServerSpy = jest.spyOn(I, 'stopMockServer');
        await I.stopMockServer();
        expect(stopMockServerSpy).toHaveBeenCalled();
        stopMockServerSpy.mockRestore();
    });

    test('should add an interaction to the mock server', async () => {
        // Define the interaction to be added
        const interaction = {
            request: {
                method: 'GET',
                path: '/api/test',
                queryParams: { id: '123' },
            },
            response: {
                status: 200,
                body: { message: 'Hello, mock server!' },
            },
        };

        await I.addInteractionToMockServer(interaction);

        expect(addInteractionToMockServerSpy).toHaveBeenCalledTimes(1);
        expect(addInteractionToMockServerSpy).toHaveBeenCalledWith(interaction);
    });

    test('should return the correct response based on query parameters', async () => {
        // Define the interaction to be added
        const interaction = {
            request: {
                method: 'GET',
                path: '/api/test',
                queryParams: { id: '1' },
            },
            response: {
                status: 200,
                body: 'user 1',
            },
        };

        await I.addInteractionToMockServer(interaction);

        expect(addInteractionToMockServerSpy).toHaveBeenCalledTimes(1);
        expect(addInteractionToMockServerSpy).toHaveBeenCalledWith(interaction);

        const response = await fetch(`${apiUrl}/api/test?id=1`);
        const responseBody = await response.text();

        expect(response.status).toBe(200);
        expect(responseBody).toContain('user 1');
    });
});
