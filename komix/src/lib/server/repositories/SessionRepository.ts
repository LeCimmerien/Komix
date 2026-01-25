import { failure, success, type Result } from "$lib/utils/result";
import db from '$lib/server/database';
import { session, user } from '$lib/server/database/schema';
import { eq } from "drizzle-orm";
import type { User } from "./UserRepository";

export enum SessionError {
    NOT_FOUND,
    CREATION_FAILED
}

export class SessionRepository {
    static async create(userId: string): Promise<Result<string, SessionError>> {
        try {
            const [s] = await db.insert(session).values({
                userId: userId
            }).returning({ id: session.id });

            return success(s.id);
        } catch (e) {
            return failure(SessionError.CREATION_FAILED);
        }
    }

    static async getUserBySessionId(sessionId: string): Promise<Result<User, SessionError>> {
        const [s] = await db.select({ id: user.id, username: user.username })
            .from(user).leftJoin(session, eq(session.userId, user.id))
            .where(eq(session.id, sessionId))
            .limit(1);

        return s?.id ? success(s) : failure(SessionError.NOT_FOUND);
    }

    static async delete(sessionId: string): Promise<void> {
        await db.delete(session).where(eq(session.id, sessionId));
    }
}