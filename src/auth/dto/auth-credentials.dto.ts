import { IsString, MaxLength, MinLength, Matches } from 'class-validator';

/**
 * Este DTO (Data Transfer Object) se usa para las credenciales de autenticacion.
 * Al usar el validationPipe, valida los valores de la clase (username, password).
 * Si la validacion falla, Nest regresa un error
 */
export class AuthCredentialsDto {
  /**
   * Se valida que el nombre de usuario es un string, con 4-20 caracteres
   */
  @IsString() // Validacion de string
  @MinLength(4) // Validacion de longitud minima
  @MaxLength(20) // Validacion de longitud maxima
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  }) // Validacion de la contrasena. Debe tener 1 numero o caracter especial, 1 uppercase y 1 lowercase
  password: string;
}
