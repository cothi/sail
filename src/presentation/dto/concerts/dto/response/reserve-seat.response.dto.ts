import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '@prisma/client';
import { ReservationModel } from 'src/domain/concerts/model/reservation.model';

export class ReserveSeatResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '예약 ID',
  })
  id: string;

  @ApiProperty({
    example: '456e7890-e89b-12d3-a456-426614174000',
    description: '사용자 ID',
  })
  userId: string;

  @ApiProperty({
    example: '789a1234-e89b-12d3-a456-426614174000',
    description: '좌석 ID',
  })
  seatId: string;

  @ApiProperty({
    enum: ReservationStatus,
    example: ReservationStatus.PENDING,
    description: '예약 상태',
  })
  status: ReservationStatus;

  @ApiProperty({
    example: '2023-07-15T10:00:00.000Z',
    description: '예약 생성 시간',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-07-15T10:15:00.000Z',
    description: '예약 만료 시간',
  })
  expiresAt: Date;

  static fromReservation(model: ReservationModel): ReserveSeatResponseDto {
    const dto = new ReserveSeatResponseDto();
    dto.id = model.reservationId;
    dto.userId = model.userId;
    dto.seatId = model.seatId;
    dto.status = model.status;
    dto.createdAt = model.createdAt;
    dto.expiresAt = model.expireAt;
    return dto;
  }
}
