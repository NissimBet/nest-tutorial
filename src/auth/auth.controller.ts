import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

/**
 * Se define que es un controlador. Se encarga de la ruta '/auth'
 */
@Controller('auth')
export class AuthController {
  // inyectar la instancia de servicio de autenticacion al controlador para ser accedido internamente
  constructor(private authService: AuthService) {}

  // handle de la ruta 'auth/signup' por el metodo POST
  @Post('/signup')
  async signUp(
    /* @Body(ValidationPipe) regresa del cuerpo del request los datos y valida que esten correctos segun el AuthCredentialsDto
       la validacion se hace en base a los decoradores definidos en la clase. En este caso que el username sea entre 4 y 20 caracteres
       y que el password tenga entre 8 y 20 caracters y que sea "seguro" */
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    await this.authService.signUp(authCredentialsDto);
  }

  // handle de la ruta 'auth/signin' por el metodo POST
  @Post('/signin')
  async signin(
    /* @Body(ValidationPipe) regresa del cuerpo del request los datos y valida que esten correctos segun el AuthCredentialsDto
       la validacion se hace en base a los decoradores definidos en la clase. En este caso que el username sea entre 4 y 20 caracteres
       y que el password tenga entre 8 y 20 caracters y que sea "seguro" */
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    return await this.authService.signIn(authCredentialsDto);
  }

  // Esta ruta se hizo de prueba para demostrar la extraccion de los datos del token y la validacion del token mismo
  // handle de la ruta 'auth/test' por el metodo POST
  @Post('/test')
  // utiliza por default el guard de passport para 'jwt'. Esto se define asi en el auth.module cuando se genera el PassportModule({defaultStrategy: 'jwt'})
  @UseGuards(AuthGuard())
  // hace accesible los datos de usuario presentes en el token, al pasar por el custom decorator de GetUser()
  async test(@GetUser() userData: User) {
    console.log(userData);
  }
}
