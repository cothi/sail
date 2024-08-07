import { ApiProperty } from '@nestjs/swagger';
import { ConcertDateModel } from 'src/domain/concerts/model/concert-date.model';

export class ConcertDateResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '콘서트 날짜 ID',
  })
  concertDateId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '콘서트 ID',
  })
  concertId: string;

  @ApiProperty({
    example: '2021-08-01T14:00:00Z',
    description: '콘서트 날짜 및 시간',
  })
  date: Date;

  @ApiProperty({
    example: 100,
    description: '전체 좌석 수',
  })
  totalSeat: number;

  @ApiProperty({
    example: 50,
    description: '이용 가능한 좌석 수',
  })
  availableSeatCount: number;

  static fromConcertDate(model: ConcertDateModel): ConcertDateResponseDto {
    const dto = new ConcertDateResponseDto();
    dto.concertDateId = model.concertDateId;
    dto.concertId = model.concertId;
    dto.date = model.date;
    dto.totalSeat = model.totalSeat;
    dto.availableSeatCount = model.availableSeatCount;

    return dto;
  }

  static ConcertDates(model: ConcertDateModel): ConcertDateResponseDto {
    const dto = new ConcertDateResponseDto();
    dto.concertDateId = model.concertDateId;
    dto.concertId = model.concertId;
    dto.date = model.date;
    dto.totalSeat = model.totalSeat;
    dto.availableSeatCount = model.availableSeatCount;
    return dto;
  }

  static fromConcertDates(
    models: ConcertDateModel[],
  ): ConcertDateResponseDto[] {
    return models.map((model) => this.ConcertDates(model));
  }
}
