import { Customer } from "src/customers/entities/customer.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('branches')
export class Branch {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    contact_name: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    contact_phone: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deleted_at: Date;

    @ManyToOne(() => Customer, (customer) => customer.branches, {
        nullable: false,
    })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

}
