import { Area } from "../../areas/entities/area.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DeviceMetadata } from "./device-metadata.entity";

@Entity('devices')
export class Device {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    type: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    serial: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    username: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deleted_at: Date;

    @ManyToOne(() => Area, (area) => area.devices, {
        nullable: false
    })
    @JoinColumn({ name: 'area_id' })
    area: Area;

    @OneToMany(() => DeviceMetadata, (DeviceMetadata) => DeviceMetadata.device, {
        cascade: true
    })
    metadata: DeviceMetadata[];
}
