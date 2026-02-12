import { describe, it, expect } from 'vitest';
import { success, failure } from './result';

describe('Result', () => {
	describe('success', () => {
		it('should create a result with ok=true and the given value', () => {
			const result = success('hello');
			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toBe('hello');
		});

		it('should work with object values', () => {
			const result = success({ id: '1', name: 'test' });
			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toEqual({ id: '1', name: 'test' });
		});
	});

	describe('failure', () => {
		it('should create a result with ok=false and the given error', () => {
			const result = failure('something went wrong');
			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe('something went wrong');
		});

		it('should work with enum errors', () => {
			enum TestError {
				NOT_FOUND
			}
			const result = failure(TestError.NOT_FOUND);
			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(TestError.NOT_FOUND);
		});
	});
});
