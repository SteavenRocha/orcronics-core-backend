import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { sanitizeUser } from 'src/common/helpers/sanitize-user.helper';
import { QueryDto } from 'src/common/dto/query.dto';
import { query } from 'src/common/helpers/query.helper';

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

    return sanitizeUser(saved);
  }

  // privado — para uso interno del service
  private async findOneRaw(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, is_active: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  // Sin relaciones -> devuelve solo el USER con estado ACTIVO
  // público — para controllers
  async findOne(id: string) {
    return sanitizeUser(await this.findOneRaw(id));
  }

  // Uso interno (auth) — retorna la entidad completa con estados inactivos
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id })
  }

  // Uso interno (auth) — retorna la entidad completa con hash
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne
      ({
        where: { email, is_active: true }
      });
  }

  async findAll(queryDto: QueryDto) {
    const result = await query(this.usersRepository, queryDto, {
      order: { created_at: 'DESC' },
    }, 'first_name');

    return {
      ...result,
      data: result.data.map(sanitizeUser),
    };
  }

  // Método privado para verificar el estado del user
  private async findByStatus(id: string, isActive: boolean): Promise<User> {
    const exists = await this.usersRepository.findOne({ where: { id } });

    if (!exists) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    if (exists.is_active !== isActive) {
      throw new BadRequestException(
        `User ${exists.first_name} ${exists.last_name} is already ${exists.is_active ? 'active' : 'inactive'}`
      );
    }

    return exists;
  }

  async deactivate(id: string): Promise<Omit<User, 'password_hash' | 'refresh_token_hash'>> {
    const user = await this.findByStatus(id, true);
    user.is_active = false;
    return sanitizeUser(await this.usersRepository.save(user));
  }

  async activate(id: string): Promise<Omit<User, 'password_hash' | 'refresh_token_hash'>> {
    const user = await this.findByStatus(id, false);
    user.is_active = true;
    return sanitizeUser(await this.usersRepository.save(user));
  }

  async update(id: string, updateUserDto: UpdateUserDto & { password?: string }) {
    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const user = await this.findOneRaw(id);
    const { password, ...rest } = updateUserDto

    Object.assign(user, rest);

    if (password) {
      user.password_hash = await bcrypt.hash(password, 10)
    }

    return sanitizeUser(await this.usersRepository.save(user));
  }

  async remove(id: string) {
    const user = await this.findOneRaw(id);

    if (user.is_active) {
      user.is_active = false;
      await this.usersRepository.save(user);
    }

    await this.usersRepository.softRemove(user);
  }

  // Usado por AuthService para guardar/limpiar refresh token
  async updateRefreshToken(id: string, token: string | null): Promise<void> {
    const hash = token ? await bcrypt.hash(token, 10) : null;
    await this.usersRepository.update(id, { refresh_token_hash: hash });
  }
}
