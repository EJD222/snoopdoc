import argon2 from 'argon2'

export async function hashPassword(password: string) {
    const hashedPassword = argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
    });

    return hashedPassword;
}

export async function verifyPassword(
    hashedPassword: string,
    password: string,
) {
    return await argon2.verify(hashedPassword, password);
}