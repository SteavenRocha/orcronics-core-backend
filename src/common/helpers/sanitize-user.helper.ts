import { User } from "../../users/entities/user.entity";

export function sanitizeUser(user: User): Omit<User, 'password_hash' | 'refresh_token_hash'> {
    const { password_hash, refresh_token_hash, ...safe } = user;
    return safe;
}