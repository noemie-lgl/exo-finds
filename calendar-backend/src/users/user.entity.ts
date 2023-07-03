import { Event } from 'src/events/event.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({type: 'varchar', length: 255})
    firstName: string;

    @Column({type: 'varchar', length: 255})
    lastName: string;

    @Column({type: 'varchar', length: 255})
    password: string;

    @OneToMany(type => Event, event => event.user)
    events: Event[];
}