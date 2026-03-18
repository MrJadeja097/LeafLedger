import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum TreeStatus {
  PENDING = 'pending',     // User requested on-chain, awaiting NGO confirmation
  CONFIRMED = 'confirmed', // NGO has planted the real tree
  REJECTED = 'rejected',   // For some reason, planting was not possible
}

@Entity('trees')
export class Tree {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.trees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  longitude: number;

  @Column({ nullable: true })
  locationName: string;

  @Column({ type: 'enum', enum: TreeStatus, default: TreeStatus.PENDING })
  status: TreeStatus;

  @Column({ nullable: true })
  tokenId: string; // On-chain NFT token ID

  @Column({ nullable: true })
  transactionHash: string;

  @Column({ nullable: true })
  metadataUri: string;

  @Column({ nullable: true })
  ngoPartner: string;

  @CreateDateColumn()
  plantedAt: Date;
}
