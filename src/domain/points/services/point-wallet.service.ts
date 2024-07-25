import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaTransaction } from 'src/infrastructure/database/prisma/types/prisma.types';
import { PointWalletRepository } from '../../../infrastructure/points/repository/point-wallet.repository';
import {
  ChargePointModel,
  DeductPointModel,
  GetPointByUserIdModel,
} from '../model/point-wallet.model';

@Injectable()
export class PointWalletService {
  constructor(
    @Inject(PointWalletRepository)
    private readonly pointWalletRepository: PointWalletRepository,
  ) {}

  async chargePoints(model: ChargePointModel, tx?: PrismaTransaction) {
    return await this.pointWalletRepository.chargePoints(model, tx);
  }

  async getBalance(model: GetPointByUserIdModel, tx?: PrismaTransaction) {
    const userPoint = await this.pointWalletRepository.getBalanceByUserId(
      model,
      tx,
    );
    return userPoint?.amount ? userPoint.amount : new Decimal(0);
  }
  async getBalanceByUserIdWithLock(
    model: GetPointByUserIdModel,
    tx?: PrismaTransaction,
  ) {
    const userPoint =
      await this.pointWalletRepository.getBalanceByUserIdWithLock(model, tx);
    if (!userPoint) {
      throw new HttpException(
        '포인트 정보를 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return userPoint?.amount ? userPoint.amount : new Decimal(0);
  }
  async createPointWallet(model: ChargePointModel, tx?: PrismaTransaction) {
    return await this.pointWalletRepository.createPointWallet(model, tx);
  }
  async deductPoints(model: DeductPointModel, tx?: PrismaTransaction) {
    const getModel = GetPointByUserIdModel.create(model.userId);
    const userPoint = await this.pointWalletRepository.getBalanceByUserId(
      getModel,
      tx,
    );
    const getPoint = userPoint?.amount ? userPoint.amount : new Decimal(0);

    if (getPoint < model.usedPoint) {
      throw new HttpException(
        '유저의 포인트가 부족합니다.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return this.pointWalletRepository.deductPoints(model, tx);
  }
}
