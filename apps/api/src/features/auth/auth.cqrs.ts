import { LoginUserCommandHandler } from "./commands/login-user.command";
import { RegisterUserCommandHandler } from "./commands/register-user.command";

export const commandsHandlers = [
    LoginUserCommandHandler,
    RegisterUserCommandHandler,
];