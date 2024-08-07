import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CreateConcertDateUseCase } from 'src/application/concerts/use-cases/create-concert-date.use-case';
import { CreateSeatUseCase } from 'src/application/concerts/use-cases/create-seat.use-case';
import { ReserveSeatUseCase } from 'src/application/concerts/use-cases/reserve-seat.user-case';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';
import { ConcertService } from 'src/domain/concerts/services/concert.service';
import { ReservationService } from 'src/domain/concerts/services/reservation.service';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { ConcertDateRepository } from 'src/infrastructure/concerts/repositories/concert-date.repository';
import { ConcertRepository } from 'src/infrastructure/concerts/repositories/concert.repository';
import { SeatRepository } from 'src/infrastructure/concerts/repositories/seat.repository';
import { ConcertsController } from 'src/presentation/controller/concerts/concerts.controller';
import { CreateConcertUseCase } from '../application/concerts/use-cases/create-concert.use-case';
import { EnqueueModule } from './enqueue.module';
import { GetUserReservationsUseCase } from 'src/application/concerts/use-cases/get-user-reservation.use-case';
import { GetConcertSeatsUseCase } from 'src/application/concerts/use-cases/get-concert-seats.use-case';
import { GetConcertsUseCase } from 'src/application/concerts/use-cases/get-conserts.use-case';
import { GetConcertDatesUseCase } from 'src/application/concerts/use-cases/get-concert-dates.use-case';
import { ReservationRepository } from 'src/infrastructure/concerts/repositories/reservation.repository';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, JwtModule, EnqueueModule],
  controllers: [ConcertsController],
  providers: [
    GetConcertsUseCase,
    GetUserReservationsUseCase,
    CreateConcertDateUseCase,
    CreateConcertUseCase,
    CreateSeatUseCase,
    GetConcertSeatsUseCase,
    ReserveSeatUseCase,
    GetConcertDatesUseCase,
    ConcertDateService,
    ReservationService,
    SeatService,
    ConcertService,
    ReservationRepository,
    ConcertRepository,
    ConcertDateRepository,
    SeatRepository,
  ],
  exports: [ReservationService, SeatService],
})
export class ConcertsModule {}
