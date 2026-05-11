import { failure, success, type Result } from "$lib/utils/result";
import db from '$lib/server/data/database';
import { user } from '$lib/server/data/database/schema'
import { eq } from "drizzle-orm";
import type { HashedPassword } from "../auth";

export interface User {
    id: string;
    username: string;
}

export interface UserWithHashedPassword {
    id: string;
    hashedPassword: HashedPassword
}

enum UserError {
    USER_NOT_FOUND,
    USER_ALREADY_EXISTS
}

export class UserRepository {
    static async findById(id: string): Promise<Result<User, UserError>> {
        const [u] = await db.select({
            id: user.id,
            username: user.username
        }).from(user).where(eq(user.id, id)).limit(1)

        return u?.id ? success(u) : failure(UserError.USER_NOT_FOUND);
    }

    static async findByEmail(email: string): Promise<Result<User, UserError>> {
        const [u] = await db.select({
            id: user.id,
            username: user.username
        }).from(user).where(eq(user.email, email)).limit(1)

        return u?.id ? success(u) : failure(UserError.USER_NOT_FOUND);
    }

    static async fetchPasswordHashByEmail(email: string): Promise<Result<UserWithHashedPassword, UserError>> {
        const [u] = await db.select({
            id: user.id,
            hashedPassword: user.passwordHash,
        }).from(user).where(eq(user.email, email)).limit(1)

        return u ? success(u) : failure(UserError.USER_NOT_FOUND);
    }

    static async create(email: string, username: string, passwordHash: HashedPassword): Promise<Result<User, UserError>> {
        try {
            const [u] = await db.insert(user).values({
                username,
                email,
                passwordHash
            }).returning({ id: user.id, username: user.username });

            return success(u);
        } catch (error: any) {
            if (error.code === '23505') {
                return failure(UserError.USER_ALREADY_EXISTS);
            }
            throw error;
        }
    }
}
