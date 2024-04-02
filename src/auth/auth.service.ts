import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(dto: AuthCredentialsDto): Promise<User> {
    return this.usersRepository.createUser(dto);
  }
  async signIn(dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = dto;

    const user = await this.usersRepository.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException('User with such username doesn`t exist!');
    }

    const isCorrectPwd = await bcrypt.compare(password, user.password);

    if (!isCorrectPwd) {
      throw new UnauthorizedException('Wrong password!');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
