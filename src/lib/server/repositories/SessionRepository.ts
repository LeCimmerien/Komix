import { failure, success, type Result } from '$lib/utils/result';
import keystore from '$lib/server/infra/keystore';

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

	static async getUserIdBySessionId(sessionId: string): Promise<Result<string, SessionError>> {
		const userId = keystore.get(sessionId);
		return userId ? success(userId) : failure(SessionError.NOT_FOUND);
	}

	static async delete(sessionId: string): Promise<void> {
		keystore.delete(sessionId);
	}
}
