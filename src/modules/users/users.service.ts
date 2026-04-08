import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { sanitizeUser } from '../../common/helpers/sanitize-user.helper';
import { BuildQueryDto } from '../../common/dto/build-query.dto';
import { paginate } from '../../common/helpers/paginator.helper';
import { PrismaService } from '../../prisma/prisma.service';
import { HashUtils } from '../../common/utils/hash.util';
import { User, UserRole } from '../../generated/prisma/client';

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {

    const passwordHash = await HashUtils.hash(createUserDto.password);

    const saved = await this.prisma.user.create({
      data: {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        passwordHash: passwordHash,
        role: createUserDto.role as UserRole,
        isActive: true,
      },
    });

    return sanitizeUser(saved);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
        isActive: true
      },
    });

    return sanitizeUser(user);
  }

  async findAll(buildQueryDto: BuildQueryDto) {
    const { search } = buildQueryDto;

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const result = await paginate<User>(this.prisma.user, buildQueryDto, {
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      ...result,
      data: result.data.map(sanitizeUser),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto & { password?: string }) {
    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const { password, ...rest } = updateUserDto;
    const data: any = {
      firstName: rest.firstName,
      lastName: rest.lastName,
      email: rest.email,
      role: rest.role,
    };

    if (password) {
      data.passwordHash = await HashUtils.hash(password);
    }

    const updated = await this.prisma.user.update({
      where: {
        id,
        deletedAt: null,
        isActive: true
      },
      data,
    });

    return sanitizeUser(updated);
  }

  async updateStatus(id: string, isActive: boolean) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        id,
        deletedAt: null
      }
    });

    if (user.isActive === isActive) {
      throw new BadRequestException(`User is already ${isActive ? 'active' : 'inactive'}`);
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }

  /* AUTH */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email, isActive: true, deletedAt: null },
    });
  }

  async updateRefreshToken(id: string, token: string | null): Promise<void> {
    /* const hash = token ? await HashUtils.hash(token) : null; */ // --> Ya recibe el token hasheado
    await this.prisma.user.update({
      where: { id },
      data: { refreshTokenHash: token },
    });
  }
}
