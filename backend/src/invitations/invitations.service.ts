import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Invitation } from './entities/invitation.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationMember } from '../organizations/entities/organization-member.entity';
import { User } from '../users/user.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private invitationsRepository: Repository<Invitation>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private membersRepository: Repository<OrganizationMember>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async invite(organizationId: number, userId: number, dto: CreateInvitationDto) {
    // Cek apakah user adalah OWNER
    const membership = await this.membersRepository.findOne({
      where: { organization_id: organizationId, user_id: userId },
    });

    if (!membership || membership.role !== 'OWNER') {
      throw new ForbiddenException('Hanya OWNER yang bisa mengundang anggota');
    }

    const results: Array<
      | { email: string; status: 'SKIPPED'; message: string }
      | { email: string; status: 'SUCCESS'; inviteLink: string }
    > = [];

    for (const email of dto.emails) {
      // Cek apakah email sudah diundang
      const existingInvitation = await this.invitationsRepository.findOne({
        where: { email, organization_id: organizationId },
      });

      if (existingInvitation) {
        results.push({
          email,
          status: 'SKIPPED',
          message: 'Email sudah diundang sebelumnya',
        });
        continue;
      }

      // Cek apakah email sudah menjadi member
      const user = await this.usersRepository.findOne({ where: { email } });
      if (user) {
        const existingMember = await this.membersRepository.findOne({
          where: { organization_id: organizationId, user_id: user.id },
        });
        if (existingMember) {
          results.push({
            email,
            status: 'SKIPPED',
            message: 'User sudah menjadi anggota',
          });
          continue;
        }
      }

      // Buat undangan
      const token = uuidv4();
      const invitation = this.invitationsRepository.create({
        email,
        token,
        organization_id: organizationId,
        status: 'PENDING',
      });

      await this.invitationsRepository.save(invitation);

      // Buat invite link
      const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/join/${token}`;

      results.push({
        email,
        status: 'SUCCESS',
        inviteLink,
      });
    }

    return {
      success: true,
      message: `${results.filter((r) => r.status === 'SUCCESS').length} undangan berhasil dikirim`,
      data: results,
    };
  }

  async acceptInvitation(token: string, userId: number) {
    // Cari undangan
    const invitation = await this.invitationsRepository.findOne({
      where: { token, status: 'PENDING' },
      relations: ['organization'],
    });

    if (!invitation) {
      throw new NotFoundException('Undangan tidak ditemukan atau sudah kadaluarsa');
    }

    // Cek apakah user sudah menjadi member
    const existingMember = await this.membersRepository.findOne({
      where: {
        organization_id: invitation.organization_id,
        user_id: userId,
      },
    });

    if (existingMember) {
      throw new BadRequestException('Anda sudah menjadi anggota organisasi ini');
    }

    // Update status undangan
    invitation.status = 'ACCEPTED';
    await this.invitationsRepository.save(invitation);

    // Tambahkan sebagai member
    const member = this.membersRepository.create({
      organization_id: invitation.organization_id,
      user_id: userId,
      role: 'MEMBER',
    });

    await this.membersRepository.save(member);

    return {
      success: true,
      message: `Selamat! Anda berhasil bergabung dengan ${invitation.organization.name}`,
      data: {
        organization: invitation.organization,
      },
    };
  }

  async getOrganizationInvitations(organizationId: number, userId: number) {
    // Cek membership
    const membership = await this.membersRepository.findOne({
      where: { organization_id: organizationId, user_id: userId },
    });

    if (!membership || membership.role !== 'OWNER') {
      throw new ForbiddenException('Hanya OWNER yang bisa melihat undangan');
    }

    const invitations = await this.invitationsRepository.find({
      where: { organization_id: organizationId },
      order: { created_at: 'DESC' },
    });

    return {
      success: true,
      data: invitations,
    };
  }
}