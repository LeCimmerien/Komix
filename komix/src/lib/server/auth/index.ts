import bcrypt from 'bcrypt';

export type HashedPassword = string & { readonly __brand: unique symbol };

export async function hashPassword(plain: string): Promise<HashedPassword> {
    const saltRounds = 12;
    const hash = await bcrypt.hash(plain, saltRounds);
    return hash as HashedPassword;
}

export async function checkHash(plain: string, hashedPassword: HashedPassword): Promise<boolean> {
    return bcrypt.compare(plain, hashedPassword);
}