import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
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

  async create(createUserDto: CreateUserDto): Promise<User> {

    const existing = await this.usersRepository.findOne({
      where: [{ username: createUserDto.username }],
    });

    if (existing) {
      throw new ConflictException('User already exists');
    }

    const password_hash = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password_hash,
    });

    const saved = await this.usersRepository.save(user);

    return this.sanitize(saved);
  }

  async login(loginDto: LoginDto): Promise<Omit<User, 'password_hash'>> {
    const user = await this.usersRepository.findOne({
      where: [{ username: loginDto.username }],
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.sanitize(user);
  }

  private sanitize(user: User): User {
    const { password_hash, ...clean } = user as any;
    return clean;
  }
}
