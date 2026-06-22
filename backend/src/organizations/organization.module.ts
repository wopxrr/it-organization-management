import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organization.service';
import { OrganizationsController } from './organization.controller';
import { Organization } from './entities/organization.entity';
import { OrganizationMember } from './entities/organization-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationMember]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}