import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Request,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  //get all events
  @Get()
  async findAllForOneUser(
    @Request() req,
    @Query('userId') userId?: string,
  ): Promise<Event[]> {
    if (userId) {
      // a userId is specified, we retrieve all events linked to this userId
      return this.eventsService.findAllForOneUser(userId);
    } else {
      // a userId is not specified, the user retrieve all events linked to themself
      return this.eventsService.findAllForOneUser(req.user.id);
    }
  }

  //get event by id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event> {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException('Event does not exist!');
    } else {
      return event;
    }
  }

  //create event that will be linked to the user sending the request
  @Post()
  async create(@Request() req, @Body() event: Event): Promise<Event> {
    return this.eventsService.create(event, req.user.id);
  }

  //update event
  @Put(':id')
  async update(@Param('id') id: string, @Body() event: Event): Promise<Event> {
    return this.eventsService.update(id, event);
  }

  //delete event
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    //handle error if event does not exist
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException('Event does not exist!');
    }
    return this.eventsService.delete(id);
  }
}
