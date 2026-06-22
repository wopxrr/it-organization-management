import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';


@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  token!: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'ACCEPTED'],
    default: 'PENDING',
  })
  status!: 'PENDING' | 'ACCEPTED';

  @Column({ type: 'int' })
  organization_id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Organization, (org) => org.invitations)
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization;
}