import { Module } from '@nestjs/common'
import { HttpModule } from './http/http.module'
import { ConfigModule } from '@nestjs/config'
import { validateEnv } from './env/env'
import { EnvModule } from './env/env.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnv,
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
