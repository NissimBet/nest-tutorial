import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { CONFIG } from 'src/config/env.config';

/**
 * Definir un modulo para ralizar las autenticaciones
 */
@Module({
  // los imports son los modulos disponibles a usar dentro del modulo 'auth'
  imports: [
    TypeOrmModule.forFeature([UserRepository]), // inyectar el modulo de typeorm para usar con el repositorio de usuarios
    // inyectar el modulo de passport, usando por default la estrategia de 'jwt'
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    // inyectar el modulo de manejo de jwt de nest, con el secret (esencialmente deberia ser secreto, random y no como esta aca) y los settings de firmado de los jwt
    JwtModule.register({
      secret: CONFIG.SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  // los exports son modulos que ese modulo provee para ser usados en otras partes
  // se va a poder usar la estrategia de jwt y el modulo de passport en otros lados, como en /tasks
  exports: [JwtStrategy, PassportModule],
  // son los controladores que el modulo usa
  controllers: [AuthController],
  // los providers son proveedores que son instanciados por el inyector de nest y que son accesibles dentro de este modulo
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
