import argon2 from 'argon2';

export type HashedPassword = string & { readonly __brand: unique symbol };

export async function hashPassword(plain: string): Promise<HashedPassword> {
    const hash = await argon2.hash(plain, { type: argon2.argon2id });
    return hash as HashedPassword;
}

export async function checkHash(plain: string, hashedPassword: HashedPassword): Promise<boolean> {
    return argon2.verify(hashedPassword, plain);
}