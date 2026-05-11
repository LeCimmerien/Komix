import { success, failure, type Result } from '$lib/utils/result';
import { checkHash, hashPassword } from '../auth';
import { SessionRepository } from '../repositories/SessionRepository';
import { UserRepository, type User } from '../repositories/UserRepository';
import logger from '$lib/server/logger';

const log = logger.child({ module: 'AuthenticationService' });

export enum AuthError {
	USER_ALREADY_EXISTS,
	INVALID_CREDENTIALS,
	TOKEN_EXPIRED,
	SESSION_CREATION_FAILED
}

export class AuthenticationService {
	static async login(email: string, password: string): Promise<Result<string, AuthError>> {
		const userWithPassword = await UserRepository.fetchPasswordHashByEmail(email);
		if (!userWithPassword.ok) {
			log.warn({ email }, 'Login failed: user not found');
			return failure(AuthError.INVALID_CREDENTIALS);
		}

		const passwordMatch = await checkHash(password, userWithPassword.value.hashedPassword);

		if (!passwordMatch) {
			log.warn({ email }, 'Login failed: wrong password');
			return failure(AuthError.INVALID_CREDENTIALS);
		}

		log.info({ userId: userWithPassword.value.id }, 'Login successful');
		return await this.createSessionFromUserId(userWithPassword.value.id);
	}

	static async register(
		email: string,
		username: string,
		password: string
	): Promise<Result<string, AuthError>> {
		const passwordHash = await hashPassword(password);
		const user = await UserRepository.create(email, username, passwordHash);

		if (!user.ok) {
			log.warn({ email, username }, 'Registration failed: user already exists');
			return failure(AuthError.USER_ALREADY_EXISTS);
		}

		log.info({ userId: user.value.id, username }, 'User registered');
		return await this.createSessionFromUserId(user.value.id);
	}

	static async createSessionFromUserId(userId: string): Promise<Result<string, AuthError>> {
		const session = await SessionRepository.create(userId);

		if (!session.ok) {
			log.error({ userId }, 'Session creation failed');
			return failure(AuthError.SESSION_CREATION_FAILED);
		}

		log.debug({ userId }, 'Session created');
		return success(session.value);
	}

	static async logout(sessionId: string): Promise<void> {
		log.info('User logged out');
		await SessionRepository.delete(sessionId);
	}

	static async getUserFromToken(token: string): Promise<Result<User, AuthError>> {
		const session = await SessionRepository.getUserIdBySessionId(token);
		if (!session.ok) {
			log.debug('Token lookup failed');
			return failure(AuthError.TOKEN_EXPIRED);
		}

		const user = await UserRepository.findById(session.value);
		if (!user.ok) {
			log.warn({ userId: session.value }, 'Session references non-existent user');
			return failure(AuthError.TOKEN_EXPIRED);
		}

		return success(user.value);
	}
}
