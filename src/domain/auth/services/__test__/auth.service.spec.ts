import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { UserModel } from 'src/domain/auth/model/user.model';
import { AuthRepository } from 'src/infrastructure/auth/repositories/auth.repository';
import { FindUserByEmailModel } from '../../model/find-user-by-email.model';
import { AuthService } from '../auth.service';
import { FindUserByIdModel } from '../../model/find-use-by-id.model';

describe('AuthService', () => {
  let authService: AuthService;
  let repository: jest.Mocked<AuthRepository>;

  beforeEach(async () => {
    const repositoryMock = {
      registerUser: jest.fn(),
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: repositoryMock },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    repository = module.get(AuthRepository);
  });

  describe('registerUser', () => {
    it('유저가 성공적으로 생성되어야 합니다.', async () => {
      const registerUserModel = RegisterUserModel.create('test@test.ai');
      const expectedUserModel = UserModel.create('1', 'test@test.ai');
      repository.registerUser.mockResolvedValue(expectedUserModel);
      const result = await authService.registerUser(registerUserModel);
      expect(result).toEqual(expectedUserModel);
    });
  });

  describe('findUserByEmail', () => {
    it('유저가 성공적으로 조회되어야 합니다.', async () => {
      const loginUserModel = FindUserByEmailModel.create('test@test.ai');
      const expectedUserModel = UserModel.create('1', 'test@test.ai');
      repository.findUserByEmail.mockResolvedValue(expectedUserModel);
      const result = await authService.findUserByEmail(loginUserModel);
      expect(result).toEqual(expectedUserModel);
    });
  });

  describe('findUserById', () => {
    it('유저가 성공적으로 조회되어야 합니다.', async () => {
      const expectedUserModel = UserModel.create('1', 'test@test.ai');
      repository.findUserById.mockResolvedValue(expectedUserModel);
      const findUserModel = FindUserByIdModel.create('1');
      const result = await authService.findUserById(findUserModel);
      expect(result).toEqual(expectedUserModel);
    });
  });
});
