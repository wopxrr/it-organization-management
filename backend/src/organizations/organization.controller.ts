import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@ApiTags('🏢 Organizations')
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat organisasi baru' })
  create(@Request() req, @Body() dto: CreateOrganizationDto) {
    return this.organizationsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Mendapatkan semua organisasi user' })
  findAll(@Request() req) {
    return this.organizationsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan detail organisasi' })
  findOne(@Param('id') id: number, @Request() req) {
    return this.organizationsService.findOne(id, req.user.id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Mendapatkan daftar anggota organisasi' })
  getMembers(@Param('id') id: number, @Request() req) {
    return this.organizationsService.getMembers(id, req.user.id);
  }
}