import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CONFIG } from 'src/config/env.config';

/**
 * Estrategia de manejo del token 'jwt' en los requests por medio del AuthGuard.
 * Se le agrega el decorador de Injectable, ya que es un proveedor de servicios
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // se inyecta el repositorio de usuarios, para poder acceder a informacion de un usuario y agregarlo al request
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    // se le manda la configuracion del PassportStrategy(Strategy) que la clase extiende.
    // La configuracion indica que se va a extraer el token tipo Bearer del header de autenticacion con el secret para la decodificacion y verificacion
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: CONFIG.SECRET,
    });
  }

  /**
   * La funcion validate es necesaria en todas las estrategias.
   * Este validate recibe un payload que es el decodificado del token por medio de PassportStrategy, revisa que el usuario del token exista, si no existe, genera un error
   *
   * @param payload los datos del usuario que estan almacenados en el token
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
