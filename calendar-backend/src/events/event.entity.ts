import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Event {

    constructor(data: Partial<Event>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({type: 'varchar', length: 255})
    startDate: Date;

    @Column({type: 'varchar', length: 255})
    endDate: Date;

    @Column({type: 'varchar', length: 255})
    summary: string;

    @Column({type: 'varchar', length: 255})
    description: string;

    @ManyToOne(type => User, (user) => user.events)
    user: User;
}