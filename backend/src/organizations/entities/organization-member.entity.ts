import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Organization } from './organization.entity';

@Entity('organization_members')
export class OrganizationMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  organization_id!: number;

  @Column({ type: 'int' })
  user_id!: number;

  @Column({
    type: 'enum',
    enum: ['OWNER', 'MEMBER'],
    default: 'MEMBER',
  })
  role!: 'OWNER' | 'MEMBER';

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Organization, (org) => org.members)
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization;

  @ManyToOne(() => User, (user) => user.memberships)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}