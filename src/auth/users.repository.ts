import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(dto: AuthCredentialsDto): Promise<User> {
    try {
      const { username, password } = dto;

      const salt = await bcrypt.genSaltSync(10);
      const hashedPwd = await bcrypt.hashSync(password, salt);

      const user = this.create({ username: username, password: hashedPwd });
      await this.save(user);
      return user;
    } catch (ex) {
      if (ex.code === '23505') {
        throw new ConflictException(
          'This username already exist! Please write new username!',
        );
      } else {
        throw new InternalServerErrorException(ex.message);
      }
    }
  }
}
