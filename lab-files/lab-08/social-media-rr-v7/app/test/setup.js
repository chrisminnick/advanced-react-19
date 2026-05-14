import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './handlers.js';

// Single MSW server per test process. Tests can override individual handlers
// with server.use(...) inside `it`; resetHandlers() cleans those up between
// tests.
//
// onUnhandledRequest: 'error' is the most important line in this file. It
// turns a forgotten handler into a loud failure instead of a quiet undefined.
export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
