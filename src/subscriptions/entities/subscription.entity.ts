import { Customer } from "src/customers/entities/customer.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'service_name' })
    serviceName: string; // 'evihub', 'otro-saas', etc.

    @Column({ name: 'external_account_id', nullable: true })
    externalAccountId: string; // evihubAccountId

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Customer, (customer) => customer.subscriptions)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;
}