import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Device } from "./device.entity";

@Entity('device_metadata')
export class DeviceMetadata {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    field: string;

    @Column({ type: 'text', nullable: false })
    value: string;

    /* Aplicamos Hard Delete pora ahora */
    /* @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date; */

    @ManyToOne(() => Device, (device) => device.metadata, { nullable: false })
    @JoinColumn({ name: 'device_id' })
    device: Device;
}
