import { Branch } from "src/branches/entities/branch.entity";
import { Device } from "src/devices/entities/device.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('areas')
export class Area {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255, nullable: false })
    name: string;

    @Column('text', { nullable: true })
    description?: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deleted_at: Date;

    @ManyToOne(() => Branch, (branch) => branch.areas, {
        nullable: false,
    })
    @JoinColumn({ name: 'branch_id' })
    branch: Branch;

    @OneToMany(() => Device, (device) => device.area, {
        cascade: true
    })
    devices: Device[];
}
