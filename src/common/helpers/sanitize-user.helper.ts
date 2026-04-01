import { User } from "../../generated/prisma/client";

export function sanitizeUser(user: User): Omit<User, 'passwordHash' | 'refreshTokenHash'> {
    const { passwordHash, refreshTokenHash, ...safeUser } = user;
    return safeUser;
}