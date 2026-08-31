import { type } from "arktype";
import { User } from "../../models/user/user.js";
import { Password } from "../../utils/password.js";

export const CurrentUser = type({
    '...': User.omit(
        'createdAt',
        'updatedAt',
        'deletedAt',
        'password',
    )
});
export type TCurrentUser = typeof CurrentUser.infer;

export const RegisterUserRequest = type({
    '...': CurrentUser,
    password: Password
})
export type TRegisterUserRequest = typeof RegisterUserRequest.infer;