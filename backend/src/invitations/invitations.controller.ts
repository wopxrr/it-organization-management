import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@ApiTags('📧 Invitations')
@ApiBearerAuth()
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post(':organizationId/invite')
  @ApiOperation({ summary: 'Mengundang anggota ke organisasi' })
  invite(
    @Param('organizationId') organizationId: number,
    @Request() req,
    @Body() dto: CreateInvitationDto,
  ) {
    return this.invitationsService.invite(organizationId, req.user.id, dto);
  }

  @Public()
  @Get('accept/:token')
  @ApiOperation({ summary: 'Cek detail undangan (public)' })
  getInvitationDetail(@Param('token') token: string) {
    return {
      success: true,
      message: 'Gunakan endpoint POST untuk accept undangan',
      token,
    };
  }

  @Post('accept/:token')
  @ApiOperation({ summary: 'Menerima undangan' })
  acceptInvitation(@Param('token') token: string, @Request() req) {
    return this.invitationsService.acceptInvitation(token, req.user.id);
  }

  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Melihat daftar undangan organisasi' })
  getInvitations(
    @Param('organizationId') organizationId: number,
    @Request() req,
  ) {
    return this.invitationsService.getOrganizationInvitations(
      organizationId,
      req.user.id,
    );
  }
}