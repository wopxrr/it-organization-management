import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { OrganizationMember } from './organization-member.entity';
import { Invitation } from '../../invitations/entities/invitation.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'int' })
  created_by!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.createdOrganizations)
  @JoinColumn({ name: 'created_by' })
  creator!: User;

  @OneToMany(() => OrganizationMember, (member) => member.organization)
  members!: OrganizationMember[];

  @OneToMany(() => Invitation, (invitation) => invitation.organization)
  invitations!: Invitation[];
}