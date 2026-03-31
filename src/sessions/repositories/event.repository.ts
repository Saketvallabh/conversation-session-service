import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConversationEvent,
  ConversationEventDocument,
} from '../schemas/conversation-event.schema';
import { Model } from 'mongoose';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(ConversationEvent.name)
    private readonly eventModel: Model<ConversationEventDocument>,
  ) {}

  async findBySessionAndEventId(sessionId: string, eventId: string) {
    return this.eventModel.findOne({ sessionId, eventId }).lean();
  }

  async createEvent(data: {
    sessionId: string;
    eventId: string;
    type: 'user_speech' | 'bot_speech' | 'system';
    payload: Record<string, unknown>;
    timestamp: Date;
  }) {
    return this.eventModel.create(data);
  }

  async getEventsBySessionId(
    sessionId: string,
    limit: number,
    offset: number,
  ) {
    return this.eventModel
      .find({ sessionId })
      .sort({ timestamp: 1, _id: 1 })
      .skip(offset)
      .limit(limit)
      .lean();
  }

  async countBySessionId(sessionId: string) {
    return this.eventModel.countDocuments({ sessionId });
  }
}