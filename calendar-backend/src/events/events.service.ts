import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findOne(id: string): Promise<Event> {
    return this.eventRepository.findOne({ where: { id } });
  }

  async create(event: Partial<Event>): Promise<Event> {
    const newevent = this.eventRepository.create(event);
    return this.eventRepository.save(newevent);
  }

  async update(id: string, event: Partial<Event>): Promise<Event> {
    await this.eventRepository.update(id, event);
    return this.eventRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}