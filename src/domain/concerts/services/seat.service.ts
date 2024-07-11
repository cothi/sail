import { Injectable } from '@nestjs/common';
import { CreateSeatsModel } from '../model/seat.model';
import { Prisma, Seat, SeatStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { SeatRepository } from 'src/infrastructure/database/repositories/concerts/seat.repository';

@Injectable()
export class SeatService {
  constructor(private readonly seatRepository: SeatRepository) {}
  async createSeat(
    createSeatModel: CreateSeatsModel,
  ): Promise<Prisma.BatchPayload> {
    const seats = this.generateSeatNumber(
      createSeatModel.concertDateId,
      createSeatModel.seatNumber,
      createSeatModel.price,
      createSeatModel.status,
    );
    return await this.seatRepository.createMany(seats);
  }

  async getSeatsByConcertDateId(concertDateId: string) {}

  async getSeatById(seatId: string) {}

  async reserveSeat(seatId: string) {}

  async cancelSeat(seatId: string) {}

  private generateSeatNumber(
    concertDateId: string,
    totalSeat: number,
    price: Decimal,
    seatStatus: SeatStatus,
  ): Omit<Seat, 'id' | 'createdAt' | 'updatedAt'>[] {
    return Array.from({ length: totalSeat }, (_, index) => ({
      concertDateId,
      seatNumber: index + 1,
      status: SeatStatus.AVAILABLE,
      price: price,
    }));
  }
}
