import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    OPERATOR = 'operator',
    VIEWER = 'viewer',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    username: string;

    /* @Column({ type: 'varchar', length: 150, unique: true })
    email: string; */

    @Column({ type: 'varchar' })
    password_hash: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
    role: UserRole;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deleted_at: Date;
}