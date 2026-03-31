import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversationEventDocument = HydratedDocument<ConversationEvent>;

@Schema({
  timestamps: true,
  collection: 'conversation_events',
})
export class ConversationEvent {
  @Prop({ required: true })
  sessionId!: string;

  @Prop({ required: true })
  eventId!: string;

  @Prop({
    required: true,
    enum: ['user_speech', 'bot_speech', 'system'],
  })
  type!: 'user_speech' | 'bot_speech' | 'system';

  @Prop({ type: Object, required: true })
  payload!: Record<string, unknown>;

  @Prop({ required: true, type: Date })
  timestamp!: Date;
}

export const ConversationEventSchema =
  SchemaFactory.createForClass(ConversationEvent);

// Unique per session
ConversationEventSchema.index({ sessionId: 1, eventId: 1 }, { unique: true });

// Query optimization for ordered pagination
ConversationEventSchema.index({ sessionId: 1, timestamp: 1 });