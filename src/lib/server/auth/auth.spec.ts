import { describe, it, expect } from 'vitest';
import { hashPassword, checkHash, type HashedPassword } from './index';

describe('auth', () => {
	describe('hashPassword', () => {
		it('should return a hashed string different from the input', async () => {
			const hash = await hashPassword('mypassword');
			expect(hash).not.toBe('mypassword');
			expect(typeof hash).toBe('string');
		});

		it('should produce different hashes for the same input (salted)', async () => {
			const hash1 = await hashPassword('mypassword');
			const hash2 = await hashPassword('mypassword');
			expect(hash1).not.toBe(hash2);
		});
	});

	describe('checkHash', () => {
		it('should return true for a matching password', async () => {
			const hash = await hashPassword('correctpassword');
			const result = await checkHash('correctpassword', hash);
			expect(result).toBe(true);
		});

		it('should return false for a wrong password', async () => {
			const hash = await hashPassword('correctpassword');
			const result = await checkHash('wrongpassword', hash);
			expect(result).toBe(false);
		});
	});
});
