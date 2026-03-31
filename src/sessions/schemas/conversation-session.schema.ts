import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversationSessionDocument = HydratedDocument<ConversationSession>;

@Schema({
  timestamps: true,
  collection: 'conversation_sessions',
})
export class ConversationSession {
  @Prop({ required: true, unique: true, index: true })
  sessionId!: string;

  @Prop({
    required: true,
    enum: ['initiated', 'active', 'completed', 'failed'],
  })
  status!: 'initiated' | 'active' | 'completed' | 'failed';

  @Prop({ required: true })
  language!: string;

  @Prop({ required: true, default: Date.now, type: Date })
  startedAt!: Date;

  @Prop({ type: Date, default: null })
  endedAt!: Date | null;

  @Prop({ type: Object, default: null })
  metadata?: Record<string, unknown>;
}

export const ConversationSessionSchema =
  SchemaFactory.createForClass(ConversationSession);