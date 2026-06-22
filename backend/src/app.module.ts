import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organization.module';
import { InvitationsModule } from './invitations/invitations.module'; 
import { JwtAuthGuard } from './auth/guards/jwt-auth.guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    OrganizationsModule, 
    InvitationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}