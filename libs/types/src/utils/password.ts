import { type } from "arktype";

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 64;

export const Password = type.string.narrow((password, ctx) => {
    const length = [...password].length;

    if (length < MIN_PASSWORD_LENGTH) {
        ctx.reject({
            message: 'Password must be at least 12 characters long.',
        });

        return false;
    }

    if (length > MAX_PASSWORD_LENGTH) {
        ctx.reject({
            message: `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`,
        });

        return false;
    }
     
    return true;
});
export type TPassword = typeof Password.infer;