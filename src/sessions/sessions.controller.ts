import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { AddEventDto } from './dto/add-event.dto';
import { GetSessionQueryDto } from './dto/get-session-query.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  async createOrUpsertSession(@Body() dto: CreateSessionDto) {
    return this.sessionsService.createOrUpsertSession(dto);
  }

  @Post(':sessionId/events')
  async addEvent(
    @Param('sessionId') sessionId: string,
    @Body() dto: AddEventDto,
  ) {
    return this.sessionsService.addEvent(sessionId, dto);
  }

  @Get(':sessionId')
  async getSession(
    @Param('sessionId') sessionId: string,
    @Query() query: GetSessionQueryDto,
  ) {
    return this.sessionsService.getSession(
      sessionId,
      query.limit,
      query.offset,
    );
  }

  @Post(':sessionId/complete')
  async completeSession(@Param('sessionId') sessionId: string) {
    return this.sessionsService.completeSession(sessionId);
  }
}