import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

/**
 * El decorador de GetUser se encarga de extraer los datos almacenados en el request de un usuario de tipo usuario.
 * Se llama despues del AuthGuard de 'jwt' que expone la unformacion del usuario proveniente del token, que esta definido en el jwt.strategy
 */
export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
