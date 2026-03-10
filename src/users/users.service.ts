import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password_hash' | 'refresh_token_hash'>> {
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('email already in use');
    }

    const password_hash = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password_hash
    });

    const saved = await this.usersRepository.save(user);

    return this.sanitize(saved);
  }

  // Uso interno (auth) — retorna la entidad completa con hash
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email, is_active: true } });
  }

  private sanitize(user: User): Omit<User, 'password_hash' | 'refresh_token_hash'> {
    const { password_hash, refresh_token_hash, ...safe } = user;
    return safe;
  }
}
