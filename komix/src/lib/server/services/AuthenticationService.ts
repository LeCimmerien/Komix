import { success, failure, type Result } from "$lib/utils/result";
import { checkHash, hashPassword } from "../auth";
import { SessionRepository } from "../repositories/SessionRepository";
import { UserRepository, type User } from "../repositories/UserRepository";

export enum AuthError {
    USER_ALREADY_EXISTS,
    INVALID_CREDENTIALS,
    TOKEN_EXPIRED,
    SESSION_CREATION_FAILED
}

export class AuthenticationService {
    static async login(email: string, password: string): Promise<Result<string, AuthError>> {
        const userWithPassword = await UserRepository.fetchPasswordHashByEmail(email);
        if (!userWithPassword.ok) return failure(AuthError.INVALID_CREDENTIALS);

        const passwordMatch = await checkHash(password, userWithPassword.value.hashedPassword)

        if (!passwordMatch) return failure(AuthError.INVALID_CREDENTIALS);

        return await this.createSessionFromUserId(userWithPassword.value.id);
    }

    static async register(email: string, username: string, password: string): Promise<Result<string, AuthError>> {
        const passwordHash = await hashPassword(password)
        const user = await UserRepository.create(email, username, passwordHash)
        
        if (!user.ok) return failure(AuthError.USER_ALREADY_EXISTS)
        
        return await this.createSessionFromUserId(user.value.id);
    }

    static async createSessionFromUserId(userId: string): Promise<Result<string, AuthError>> {
        const session = await SessionRepository.create(userId)
        
        if (!session.ok) return failure(AuthError.SESSION_CREATION_FAILED)

        return success(session.value)
    }

    static async logout(sessionId: string): Promise<void> {
        await SessionRepository.delete(sessionId)
    }

    static async getUserFromToken(token: string): Promise<Result<User, AuthError>> {
        const session = await SessionRepository.getUserBySessionId(token);
        return session.ok ? success(session.value) : failure(AuthError.TOKEN_EXPIRED)
    }
}
