// src/presentation/dto/payment/payment-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { PaymentType, ReservationStatus, SeatStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class PaymentResponseDto {
  @ApiProperty({
    description: '결제 고유 식별자',
    example: 'pay_1234567890abcdef',
    format: 'uuid',
  })
  paymentId: string;

  @ApiProperty({
    description: '결제를 진행한 사용자의 고유 식별자',
    example: 'user_9876543210fedcba',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: '결제된 금액 (원 단위)',
    example: 50000,
    minimum: 0,
    format: 'int32',
  })
  amount: Decimal;

  @ApiProperty({
    description: '결제 유형',
    enum: PaymentType,
    example: PaymentType.TICKET_PURCHASE,
    enumName: 'PaymentType',
  })
  paymentType: PaymentType;

  @ApiProperty({
    description: '결제가 완료된 날짜와 시간',
    example: '2023-07-15T09:30:00Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: '결제와 연관된 예약의 고유 식별자',
    example: 'res_abcdef1234567890',
    format: 'uuid',
  })
  reservationId: string;

  @ApiProperty({
    description: '예약의 현재 상태',
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
    enumName: 'ReservationStatus',
  })
  reservationStatus: ReservationStatus;

  @ApiProperty({
    description: '예약된 좌석의 고유 식별자',
    example: 'seat_0987654321abcdef',
    format: 'uuid',
  })
  seatId: string;

  @ApiProperty({
    description: '좌석의 현재 상태',
    enum: SeatStatus,
    example: SeatStatus.SOLD,
    enumName: 'SeatStatus',
  })
  seatStatus: SeatStatus;

  @ApiProperty({
    description: '결제 처리 성공 여부',
    example: true,
    type: 'boolean',
  })
  success: boolean;

  @ApiProperty({
    description: '결제 관련 추가 메시지 (오류 발생 시 오류 내용 포함)',
    example: '결제가 성공적으로 처리되었습니다.',
    required: false,
  })
  message?: string;
}