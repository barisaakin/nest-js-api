import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User, Company, Prisma } from '@prisma/client';
import { PrismaErrorHandler } from '../common/errors/prisma-error.handler';
import {
  EntityNotFoundException,
  InvalidRelationException,
} from '../common/exceptions/business.exception';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(createUserDto: CreateUserDto): Promise<User & { company: Company | null }> {
    try {
      const { email, firstName, lastName, companyId } = createUserDto;

      if (companyId) {
        const company = await this.prisma.company.findUnique({
          where: { id: companyId },
        });

        if (!company) {
          throw new InvalidRelationException(`Company with ID ${companyId} not found`);
        }
      }

      const userData: Prisma.UserCreateInput = {
        email,
        firstName,
        lastName,
        role: Role.USER,
        company: companyId
          ? {
              connect: { id: companyId },
            }
          : undefined,
      };

      return await this.prisma.user.create({
        data: userData,
        include: {
          company: true,
        },
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  public async findAll(): Promise<(User & { company: Company | null })[]> {
    return this.prisma.user.findMany({
      include: {
        company: true,
      },
    });
  }

  public async findOne(id: number): Promise<User & { company: Company | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!user) {
      throw new EntityNotFoundException('User');
    }

    return user;
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User & { company: Company | null }> {
    try {
      if (updateUserDto.companyId) {
        const company = await this.prisma.company.findUnique({
          where: { id: updateUserDto.companyId },
        });

        if (!company) {
          throw new InvalidRelationException(
            `Company with ID ${updateUserDto.companyId} not found`,
          );
        }
      }

      const updateData: Prisma.UserUpdateInput = {
        ...updateUserDto,
        company: updateUserDto.companyId
          ? {
              connect: { id: updateUserDto.companyId },
            }
          : undefined,
      };

      return await this.prisma.user.update({
        where: { id },
        data: updateData,
        include: {
          company: true,
        },
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  public async remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
