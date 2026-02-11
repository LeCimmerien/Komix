import { failure, success, type Result } from '$lib/utils/result';
import db from '$lib/server/data/database';
import { user } from '$lib/server/data/database/schema';
import { eq } from 'drizzle-orm';
import type { User } from './UserRepository';
import keystore from '$lib/server/data/keystore';

export enum SessionError {
	NOT_FOUND,
	CREATION_FAILED
}

export class SessionRepository {
	static async create(userId: string): Promise<Result<string, SessionError>> {
		const sessionId = crypto.randomUUID();
		keystore.set(sessionId, userId);
		return success(sessionId);
	}

	static async getUserBySessionId(sessionId: string): Promise<Result<User, SessionError>> {
		const userId = keystore.get(sessionId);

		if (!userId) {
			return failure(SessionError.NOT_FOUND);
		}

		const [u] = await db
			.select({ id: user.id, username: user.username })
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		return u ? success(u) : failure(SessionError.NOT_FOUND);
	}

	static async delete(sessionId: string): Promise<void> {
		keystore.delete(sessionId);
	}
}
