import { failure, success, type Result } from '$lib/utils/result';
import redis from '$lib/server/infra/redis';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days

export enum SessionError {
	NOT_FOUND,
	CREATION_FAILED
}

export class SessionRepository {
	static async create(userId: string): Promise<Result<string, SessionError>> {
		const sessionId = crypto.randomUUID()
		const result = await redis.set(`session:${sessionId}`, userId, 'EX', SESSION_TTL_SECONDS)
		if (result !== 'OK') return failure(SessionError.CREATION_FAILED)
		return success(sessionId)
	}

	static async getUserIdBySessionId(sessionId: string): Promise<Result<string, SessionError>> {
		const userId = await redis.get(`session:${sessionId}`)
		return userId ? success(userId) : failure(SessionError.NOT_FOUND)
	}

	static async delete(sessionId: string): Promise<void> {
		await redis.del(`session:${sessionId}`)
	}
}
