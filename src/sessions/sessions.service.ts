import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SessionRepository } from './repositories/session.repository';
import { EventRepository } from './repositories/event.repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { AddEventDto } from './dto/add-event.dto';
import { normalizePagination } from '../common/utils/pagination.util';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async createOrUpsertSession(dto: CreateSessionDto) {
    return this.sessionRepository.upsertSession(dto);
  }

  async addEvent(sessionId: string, dto: AddEventDto) {
    const session = await this.sessionRepository.findBySessionId(sessionId);
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    const existingEvent = await this.eventRepository.findBySessionAndEventId(
      sessionId,
      dto.eventId,
    );

    if (existingEvent) {
      return existingEvent; // idempotent behavior
    }

    try {
      const created = await this.eventRepository.createEvent({
        sessionId,
        eventId: dto.eventId,
        type: dto.type,
        payload: dto.payload,
        timestamp: new Date(dto.timestamp),
      });

      return created.toObject();
    } catch (error: any) {
      if (error?.code === 11000) {
        const duplicate = await this.eventRepository.findBySessionAndEventId(
          sessionId,
          dto.eventId,
        );
        if (duplicate) return duplicate;
      }

      throw new ConflictException('Failed to create event');
    }
  }

  async getSession(sessionId: string, limit?: number, offset?: number) {
    const session = await this.sessionRepository.findBySessionId(sessionId);
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    const { limit: normalizedLimit, offset: normalizedOffset } =
      normalizePagination(limit, offset);

    const [events, totalEvents] = await Promise.all([
      this.eventRepository.getEventsBySessionId(
        sessionId,
        normalizedLimit,
        normalizedOffset,
      ),
      this.eventRepository.countBySessionId(sessionId),
    ]);

    return {
      session,
      events,
      pagination: {
        total: totalEvents,
        limit: normalizedLimit,
        offset: normalizedOffset,
      },
    };
  }

  async completeSession(sessionId: string) {
    const session = await this.sessionRepository.findBySessionId(sessionId);
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    if (session.status === 'completed') {
      return session; // idempotent
    }

    return this.sessionRepository.completeSession(sessionId);
  }
}