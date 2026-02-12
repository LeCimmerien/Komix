import { describe, it, expect, beforeEach } from 'vitest';
import keystore from './index';

describe('keystore', () => {
	beforeEach(() => {
		keystore.delete('session-1');
		keystore.delete('session-2');
	});

	it('should store and retrieve a value', () => {
		keystore.set('session-1', 'user-1');
		expect(keystore.get('session-1')).toBe('user-1');
	});

	it('should return undefined for missing keys', () => {
		expect(keystore.get('nonexistent')).toBeUndefined();
	});

	it('should delete a value', () => {
		keystore.set('session-1', 'user-1');
		keystore.delete('session-1');
		expect(keystore.get('session-1')).toBeUndefined();
	});

	it('should report whether a key exists', () => {
		expect(keystore.has('session-1')).toBe(false);
		keystore.set('session-1', 'user-1');
		expect(keystore.has('session-1')).toBe(true);
	});

	it('should overwrite existing values', () => {
		keystore.set('session-1', 'user-1');
		keystore.set('session-1', 'user-2');
		expect(keystore.get('session-1')).toBe('user-2');
	});

	it('should handle multiple keys independently', () => {
		keystore.set('session-1', 'user-1');
		keystore.set('session-2', 'user-2');
		expect(keystore.get('session-1')).toBe('user-1');
		expect(keystore.get('session-2')).toBe('user-2');
	});
});
