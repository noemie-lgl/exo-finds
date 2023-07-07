import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @Inject(UsersService) private userService: UsersService
  ) {}

  async findAllForOneUser(userId: string): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.userId = :userId', { userId })
      .getMany();
  }

  async findOne(id: string): Promise<Event> {
    return this.eventRepository.findOne({ where: { id } });
  }

  async create(event: Partial<Event>, userId: string): Promise<Event> {
    const user = await this.userService.findOne(userId);
    const newEvent = new Event({
      ...event,
      user: user
    });
    return this.eventRepository.save(newEvent);
  }

  async update(id: string, event: Partial<Event>): Promise<Event> {
    await this.eventRepository.update(id, event);
    return this.eventRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}