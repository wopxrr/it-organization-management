import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private membersRepository: Repository<OrganizationMember>,
  ) {}

  async create(userId: number, dto: CreateOrganizationDto) {
    // Buat organisasi baru
    const organization = this.organizationsRepository.create({
      name: dto.name,
      description: dto.description || '', // Fix: gunakan string kosong bukan null
      created_by: userId,
    });

    const savedOrg = await this.organizationsRepository.save(organization);

    // Tambahkan creator sebagai OWNER
    const member = this.membersRepository.create({
      organization_id: savedOrg.id,
      user_id: userId,
      role: 'OWNER' as const,
    });

    await this.membersRepository.save(member);

    return {
      success: true,
      message: 'Organisasi berhasil dibuat!',
      data: savedOrg,
    };
  }

  async findAll(userId: number) {
    // Cari semua membership user ini
    const memberships = await this.membersRepository.find({
      where: { user_id: userId },
      relations: ['organization'],
    });

    // Format data
    const data = memberships.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      description: m.organization.description,
      created_by: m.organization.created_by,
      role: m.role,
      created_at: m.organization.created_at,
      updated_at: m.organization.updated_at,
    }));

    return {
      success: true,
      message: 'Daftar organisasi berhasil diambil',
      data: data,
    };
  }

  async findOne(id: number, userId: number) {
    const organization = await this.organizationsRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!organization) {
      throw new NotFoundException('Organisasi tidak ditemukan');
    }

    // Cek apakah user adalah member
    const membership = await this.membersRepository.findOne({
      where: { organization_id: id, user_id: userId },
    });

    if (!membership) {
      throw new ForbiddenException('Anda bukan anggota organisasi ini');
    }

    // Hitung jumlah anggota
    const memberCount = await this.membersRepository.count({
      where: { organization_id: id },
    });

    return {
      success: true,
      data: {
        id: organization.id,
        name: organization.name,
        description: organization.description,
        created_by: organization.created_by,
        creator: organization.creator,
        role: membership.role,
        memberCount: memberCount,
        created_at: organization.created_at,
        updated_at: organization.updated_at,
      },
    };
  }

  async getMembers(organizationId: number, userId: number) {
    // Cek apakah user adalah member
    const membership = await this.membersRepository.findOne({
      where: { organization_id: organizationId, user_id: userId },
    });

    if (!membership) {
      throw new ForbiddenException('Anda bukan anggota organisasi ini');
    }

    const members = await this.membersRepository.find({
      where: { organization_id: organizationId },
      relations: ['user'],
    });

    const data = members.map((m) => ({
      id: m.id,
      userId: m.user_id,
      name: m.user?.name || 'Unknown',
      email: m.user?.email || 'Unknown',
      role: m.role,
      joinedAt: m.created_at,
    }));

    return {
      success: true,
      data: data,
    };
  }
}