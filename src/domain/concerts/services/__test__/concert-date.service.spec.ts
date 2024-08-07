// src/modules/concert/services/concert-date.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ConcertDateRepository } from 'src/infrastructure/concerts/repositories/concert-date.repository';
import {
  ConcertDateModel,
  GCDByConcertDateIdModel,
  GCDByConcertIdModel,
} from '../../model/concert-date.model';
import { ConcertDateService } from '../concert-date.service';

describe('ConcertDateService', () => {
  let service: ConcertDateService;
  let repository: jest.Mocked<ConcertDateRepository>;

  const expectedResult: ConcertDateModel = {
    concertDateId: '1',
    concertId: '1',
    date: new Date(),
    totalSeat: 50,
    availableSeatCount: 50,
  };
  const expectedResults: ConcertDateModel[] = [
    {
      concertDateId: '1',
      concertId: '1',
      date: new Date(),
      totalSeat: 50,
      availableSeatCount: 50,
    },
  ];

  beforeEach(async () => {
    const repositoryMock = {
      create: jest.fn(),
      findByConcertId: jest.fn(),
      findById: jest.fn(),
      findByDate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertDateService,
        {
          provide: ConcertDateRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ConcertDateService>(ConcertDateService);
    repository = module.get(ConcertDateRepository);
  });

  describe('createConcertDate', () => {
    it('콘서트 날짜 생성해야 합니다.', async () => {
      const createConcertDateModel: ConcertDateModel = {
        concertDateId: '1',
        concertId: '1',
        date: new Date(),
        totalSeat: 50,
        availableSeatCount: 50,
      };

      repository.create.mockResolvedValue(expectedResult);

      const result = await service.createConcertDate(createConcertDateModel);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getConcertDateByConcertId', () => {
    it('concert id로 콘서트 날짜를 가져와야 합니다.', async () => {
      // 이 메서드의 구현이 아직 없으므로 테스트를 추가하지 않았습니다.
      // 구현 후 테스트를 추가해야 합니다.
      const gcdByConcertIdModel: GCDByConcertIdModel = {
        concertId: '1',
      };
      await repository.findByConcertId.mockResolvedValue(expectedResults);

      const result =
        await service.getConcertDateByConcertId(gcdByConcertIdModel);
      expect(result).toEqual(expectedResults);
    });
  });

  describe('getConcertDateByConcertDateId', () => {
    it('date id로 콘서트 날짜를 가져와야 합니다.', async () => {
      const gcdByConcertDateIdModel: GCDByConcertDateIdModel = {
        concertDateId: '1',
      };
      await repository.findById.mockResolvedValue(expectedResult);
      const result = await service.getConcertDateByConcertDateId(
        gcdByConcertDateIdModel,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
