import { createParamDecorator, ExecutionContext, InternalServerErrorException, SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
        // This should not happen if the guard is applied correctly before this decorator is used.
        throw new InternalServerErrorException('User not found in request context. Ensure AuthGuard is active.');
        }

        // If a specific property is requested (e.g., @GetUser('userId')) return it
        if (data) {
        return user[data];
        }

        // Otherwise, return the whole user object
        return user;
    },
);