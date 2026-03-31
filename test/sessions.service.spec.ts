import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from '../src/sessions/sessions.service';
import { SessionRepository } from '../src/sessions/repositories/session.repository';
import { EventRepository } from '../src/sessions/repositories/event.repository';

describe('SessionsService', () => {
  let service: SessionsService;

  const mockSessionRepository = {
    findBySessionId: jest.fn(),
    upsertSession: jest.fn(),
    completeSession: jest.fn(),
  };

  const mockEventRepository = {
    findBySessionAndEventId: jest.fn(),
    createEvent: jest.fn(),
    getEventsBySessionId: jest.fn(),
    countBySessionId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: SessionRepository,
          useValue: mockSessionRepository,
        },
        {
          provide: EventRepository,
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create or return session idempotently', async () => {
    const dto = {
      sessionId: 's1',
      status: 'initiated' as const,
      language: 'en',
    };

    mockSessionRepository.upsertSession.mockResolvedValue(dto);

    const result = await service.createOrUpsertSession(dto);

    expect(result).toEqual(dto);
    expect(mockSessionRepository.upsertSession).toHaveBeenCalledWith(dto);
  });
});