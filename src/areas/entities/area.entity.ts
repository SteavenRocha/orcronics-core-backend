import { Branch } from "src/branches/entities/branch.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('areas')
export class Area {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255, nullable: false })
    name: string;

    @Column('text', { nullable: true })
    description?: string;

    @Column({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'timestamp' })
    updated_at: Date;

    @Column({ type: 'timestamp' })
    deleted_at: Date;

    @ManyToOne(() => Branch, (branch) => branch.areas, {
        nullable: false,
    })
    @JoinColumn({ name: 'branch_id' })
    branch: Branch;
}
