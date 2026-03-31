import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

export class AddEventDto {
  @IsString()
  @IsNotEmpty()
  eventId!: string;

  @IsString()
  @IsIn(['user_speech', 'bot_speech', 'system'])
  type!: 'user_speech' | 'bot_speech' | 'system';

  @IsObject()
  payload!: Record<string, unknown>;

  @IsDateString()
  timestamp!: string;
}