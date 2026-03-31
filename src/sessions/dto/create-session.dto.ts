import { IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsIn(['initiated', 'active', 'completed', 'failed'])
  status!: 'initiated' | 'active' | 'completed' | 'failed';

  @IsString()
  @IsNotEmpty()
  language!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}