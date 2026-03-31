import { describe, it, expect } from 'vitest';
import { getTimeString } from './index';

describe('getTimeString', () => {
    it('formats zero correctly', () => {
        expect(getTimeString(0)).toBe('0:00');
    });

    it('pads seconds below 10', () => {
        expect(getTimeString(65)).toBe('1:05');
    });

    it('formats larger values', () => {
        expect(getTimeString(754)).toBe('12:34');
    });
});
