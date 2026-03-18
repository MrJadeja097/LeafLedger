import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Tree } from '../trees/tree.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  discordId: string;

  @Column({ nullable: true })
  walletAddress: string;

  @Column({ default: 0, type: 'decimal', precision: 18, scale: 0 })
  tokenBalance: string;

  @Column({ default: 0 })
  treesPlanted: number;

  @OneToMany(() => Tree, (tree) => tree.user)
  trees: Tree[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
