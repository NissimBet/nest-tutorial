import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

/**
 * Un service provee una serie de servicios interrelacionados para un modulo
 * Este service se encarga de la autenticacion de un usuario
 *
 * el @Injectable indica que este servicio funciona como un provider
 */
@Injectable()
export class AuthService {
  constructor(
    // inyectar una dependencia. Esta dependencia es una Instancia de UserRepository que maneja logica compleja relacionada al usuario que el servicio no deberia realizar
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    // inyectar el servicio de JWT de nest para manejar el firmado de los tokens
    private jwtService: JwtService,
  ) {}
  // inicializar una instancia de un logger
  private logger = new Logger('AuthService');

  /**
   * Esta funcion hace el inicio de sesion de un usuario y creacion de el token de acceso
   *
   * @param authCredentialsDto datos de validacion del usuario. Se usa un objeto en vez de definir directament username: string, password: string.
   * Previniendo que un cambio en la definicion requiera cambiar en cada instancia de la autenticacion los parametros, similarmente en el cuerpo de la funcion
   */
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    // intentar validar el usuario, por medio del repositorio
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    // crear el payload que se va a almacenar en el token y crear el token
    const payload = <JwtPayload>{ username };
    const token = await this.jwtService.signAsync(payload);
    this.logger.debug(
      `Generated JWT token with paylod ${JSON.stringify(token)}`,
    );

    return { token };
  }

  /**
   * Funcion de manejo del registro de los usuarios. No hay logica fuera de la validacion de datos y creacion del usuario, que lo realiza el repositorio
   * @param authCredentialsDto
   */
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.userRepository.signUp(authCredentialsDto);
  }
}
