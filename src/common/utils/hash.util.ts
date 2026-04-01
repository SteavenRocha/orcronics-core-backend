import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const HashUtils = {

    async hash(data: string): Promise<string> {
        return bcrypt.hash(data, SALT_ROUNDS);
    },

    async compare(data: string, hash: string): Promise<boolean> {
        return bcrypt.compare(data, hash);
    },
};