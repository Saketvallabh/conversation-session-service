import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConversationSession,
  ConversationSessionDocument,
} from '../schemas/conversation-session.schema';
import { Model } from 'mongoose';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(ConversationSession.name)
    private readonly sessionModel: Model<ConversationSessionDocument>,
  ) {}

  async findBySessionId(sessionId: string) {
    return this.sessionModel.findOne({ sessionId }).lean();
  }

  async upsertSession(data: {
    sessionId: string;
    status: 'initiated' | 'active' | 'completed' | 'failed';
    language: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.sessionModel.findOneAndUpdate(
      { sessionId: data.sessionId },
      {
        $setOnInsert: {
          sessionId: data.sessionId,
          status: data.status,
          language: data.language,
          metadata: data.metadata ?? null,
          startedAt: new Date(),
          endedAt: null,
        },
      },
      {
        new: true,
        upsert: true,
      },
    ).lean();
  }

  async completeSession(sessionId: string) {
    return this.sessionModel.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          status: 'completed',
          endedAt: new Date(),
        },
      },
      {
        new: true,
      },
    ).lean();
  }
}