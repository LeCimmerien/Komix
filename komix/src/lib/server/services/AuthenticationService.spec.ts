import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { success, failure } from '$lib/utils/result';
import type { HashedPassword } from '../auth';

const { fakeHash } = vi.hoisted(() => ({
	fakeHash: 'hashed_password' as unknown as HashedPassword
}));

vi.mock('$lib/server/logger', () => ({
	default: {
		child: () => ({
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
			debug: vi.fn()
		})
	}
}));

vi.mock('../auth', () => ({
	hashPassword: vi.fn().mockResolvedValue(fakeHash),
	checkHash: vi.fn()
}));

vi.mock('../repositories/UserRepository', () => ({
	UserRepository: {
		fetchPasswordHashByEmail: vi.fn(),
		create: vi.fn()
	}
}));

vi.mock('../repositories/SessionRepository', () => ({
	SessionRepository: {
		create: vi.fn(),
		delete: vi.fn(),
		getUserBySessionId: vi.fn()
	}
}));

import { AuthenticationService, AuthError } from './AuthenticationService';
import { UserRepository } from '../repositories/UserRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { checkHash } from '../auth';

describe('AuthenticationService', () => {
	const mockFetchPassword = UserRepository.fetchPasswordHashByEmail as Mock;
	const mockUserCreate = UserRepository.create as Mock;
	const mockSessionCreate = SessionRepository.create as Mock;
	const mockSessionDelete = SessionRepository.delete as Mock;
	const mockGetUserBySession = SessionRepository.getUserBySessionId as Mock;
	const mockCheckHash = checkHash as Mock;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('login', () => {
		it('should return INVALID_CREDENTIALS when user is not found', async () => {
			mockFetchPassword.mockResolvedValue(failure('USER_NOT_FOUND'));

			const result = await AuthenticationService.login('unknown@test.com', 'password');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(AuthError.INVALID_CREDENTIALS);
		});

		it('should return INVALID_CREDENTIALS when password is wrong', async () => {
			mockFetchPassword.mockResolvedValue(
				success({ id: 'user-1', hashedPassword: fakeHash })
			);
			mockCheckHash.mockResolvedValue(false);

			const result = await AuthenticationService.login('user@test.com', 'wrongpassword');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(AuthError.INVALID_CREDENTIALS);
		});

		it('should return a session id on successful login', async () => {
			mockFetchPassword.mockResolvedValue(
				success({ id: 'user-1', hashedPassword: fakeHash })
			);
			mockCheckHash.mockResolvedValue(true);
			mockSessionCreate.mockResolvedValue(success('session-123'));

			const result = await AuthenticationService.login('user@test.com', 'correctpassword');

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toBe('session-123');
		});
	});

	describe('register', () => {
		it('should return USER_ALREADY_EXISTS when user creation fails', async () => {
			mockUserCreate.mockResolvedValue(failure('USER_ALREADY_EXISTS'));

			const result = await AuthenticationService.register(
				'existing@test.com',
				'existinguser',
				'password'
			);

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(AuthError.USER_ALREADY_EXISTS);
		});

		it('should return a session id on successful registration', async () => {
			mockUserCreate.mockResolvedValue(success({ id: 'user-2', username: 'newuser' }));
			mockSessionCreate.mockResolvedValue(success('session-456'));

			const result = await AuthenticationService.register(
				'new@test.com',
				'newuser',
				'password'
			);

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toBe('session-456');
		});
	});

	describe('createSessionFromUserId', () => {
		it('should return SESSION_CREATION_FAILED when session creation fails', async () => {
			mockSessionCreate.mockResolvedValue(failure('CREATION_FAILED'));

			const result = await AuthenticationService.createSessionFromUserId('user-1');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(AuthError.SESSION_CREATION_FAILED);
		});

		it('should return the session id on success', async () => {
			mockSessionCreate.mockResolvedValue(success('session-789'));

			const result = await AuthenticationService.createSessionFromUserId('user-1');

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toBe('session-789');
		});
	});

	describe('logout', () => {
		it('should call SessionRepository.delete with the session id', async () => {
			await AuthenticationService.logout('session-123');

			expect(mockSessionDelete).toHaveBeenCalledWith('session-123');
		});
	});

	describe('getUserFromToken', () => {
		it('should return TOKEN_EXPIRED when session is not found', async () => {
			mockGetUserBySession.mockResolvedValue(failure('NOT_FOUND'));

			const result = await AuthenticationService.getUserFromToken('invalid-token');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(AuthError.TOKEN_EXPIRED);
		});

		it('should return the user on valid token', async () => {
			const user = { id: 'user-1', username: 'testuser' };
			mockGetUserBySession.mockResolvedValue(success(user));

			const result = await AuthenticationService.getUserFromToken('valid-token');

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toEqual(user);
		});
	});
});
