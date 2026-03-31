import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import {
  ConversationSession,
  ConversationSessionSchema,
} from './schemas/conversation-session.schema';
import {
  ConversationEvent,
  ConversationEventSchema,
} from './schemas/conversation-event.schema';
import { SessionRepository } from './repositories/session.repository';
import { EventRepository } from './repositories/event.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ConversationSession.name,
        schema: ConversationSessionSchema,
      },
      {
        name: ConversationEvent.name,
        schema: ConversationEventSchema,
      },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionRepository, EventRepository],
})
export class SessionsModule {}