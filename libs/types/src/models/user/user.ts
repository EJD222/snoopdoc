import { Type, type } from "arktype";
import { TBrand } from "../../utils/brand.js";
import { Timestamp } from "../../utils/timestamps.js";

export type TUserId = TBrand<string, "userId">
export const UserId: Type<TUserId> = type('string.uuid#userId');

export const User = type({
    '...': Timestamp,
    id: UserId,
    firstName: type('string').atLeastLength({
        rule: 1,
        meta: { message: 'First name must not be empty.' }
    }),
    lastName: type('string').atLeastLength({
        rule: 1,
        meta: { message: 'Last name must not be empty.' }
    }),
    email: type('string').atLeastLength({
        rule: 1,
        meta: { message: 'Email must not be empty.' },
    }),
    password: type('string').atLeastLength({
        rule: 1,
        meta: { message: 'Password must not be empty' },
    }),
})
export const UserKeys = User.keyof();
export type TUserKeys = typeof UserKeys.infer;
