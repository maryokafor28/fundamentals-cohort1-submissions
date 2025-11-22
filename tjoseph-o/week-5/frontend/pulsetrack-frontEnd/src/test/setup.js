import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

global.confirm = vi.fn(() => true);
global.alert = vi.fn();

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});