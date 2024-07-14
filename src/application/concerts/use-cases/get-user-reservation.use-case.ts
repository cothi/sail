import { Injectable } from '@nestjs/common';
import { GetUserReservationsModel } from 'src/domain/concerts/model/reservation.model';
import { ReservationService } from 'src/domain/concerts/services/reservation.service';
import { GetUserReservationsResponseDto } from 'src/presentation/dto/points/response/get-user-reservations.dto';

@Injectable()
export class GetUserReservationsUseCase {
  constructor(private reservationService: ReservationService) {}

  async execute(userId: string): Promise<GetUserReservationsResponseDto> {
    const model: GetUserReservationsModel = {
      userId: userId,
    };
    const reservations =
      await this.reservationService.getUserReservations(model);

    const reservationArray = reservations.map((reservation) => ({
      id: reservation.id,
      concertName: reservation.concert.name,
      seatNumber: reservation.seat.seatNumber,
      reservationDate: reservation.concertDate.date,
      status: reservation.status,
    }));

    return GetUserReservationsResponseDto.fromReservations(reservationArray);
  }
}