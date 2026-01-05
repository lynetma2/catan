import pino from 'pino';

export const Logger = pino({
    // Set level to 'debug' for development, 'warn' or 'error' for production
    level: 'debug',
    browser: {
        asObject: true, // Keeps objects expandable in browser DevTools
        serialize: false, // Set to true if you want strict JSON output in console
    },
    base: undefined, // Removes 'pid' and 'hostname' fields which are irrelevant in browser
});