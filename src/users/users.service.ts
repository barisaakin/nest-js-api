/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import * as bcrypt from 'bcrypt';

type UserWithCompany = User & { company: Company | null };

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(createUserDto: CreateUserDto): Promise<UserWithCompany> {
    try {
      const { email, firstName, lastName, role = Role.USER, companyId, password } = createUserDto;

      if (companyId) {
        const company = await this.prisma.company.findUnique({
          where: { id: companyId },
        });

        if (!company) {
          throw new InvalidRelationException(`Company with ID ${companyId} not found`);
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userData: Prisma.UserCreateInput = {
        email,
        firstName,
        lastName,
        role,
        password: hashedPassword,
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

  public async findAll(): Promise<UserWithCompany[]> {
    return this.prisma.user.findMany({
      include: {
        company: true,
      },
    });
  }

  public async findOne(id: number): Promise<UserWithCompany> {
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

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<UserWithCompany> {
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

      // If password is being updated, hash it
      if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(updateUserDto.password, 10);
      }

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
