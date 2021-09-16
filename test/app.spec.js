const http = require('http');
const Chance = require('chance');

jest.mock('http');

const chance = new Chance();

describe('app', () => {
    const hostName = '127.0.0.1';
    const port = 3000;
    let fakeServer, actualServer, log;

    beforeAll(async () => {
        const log = console.log;

        console.log = jest.fn();

        fakeServer = {
            listen: jest.fn()
        };

        http.createServer.mockReturnValue(fakeServer);

        actualServer = await require('../src/app');
    });

    test('should create server', () => {
        expect(http.createServer).toHaveBeenCalledTimes(1);
        expect(http.createServer).toHaveBeenCalledWith(expect.any(Function));
    });

    test('server should handle default response', () => {
        const fakeResponse = {
            statusCode: chance.natural(),
            setHeader: jest.fn(),
            end: jest.fn()
        };

        http.createServer.mock.calls[0][0]({}, fakeResponse);

        expect(fakeResponse.statusCode).toBe(200);
        expect(fakeResponse.setHeader).toHaveBeenCalledTimes(1);
        expect(fakeResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
        expect(fakeResponse.end).toHaveBeenCalledTimes(1);
        expect(fakeResponse.end).toHaveBeenCalledWith('Hello World');
    })

    describe('server', () => {
        test('should listen on port', () => {
            expect(fakeServer.listen).toHaveBeenCalledTimes(1);
            expect(fakeServer.listen).toHaveBeenCalledWith(port, hostName, expect.any(Function));
        });

        test('should log listening at port', () => {
            fakeServer.listen.mock.calls[0][2]();

            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith(`Server running at http://${hostName}:${port}/`)
        });
    });


});