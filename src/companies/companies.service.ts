import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {
  EntityNotFoundException,
  EntityAlreadyExistsException,
  BusinessRuleViolationException,
} from '../common/exceptions/business.exception';
import { Prisma, Company, User } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(createCompanyDto: CreateCompanyDto): Promise<Company & { users: User[] }> {
    try {
      const { name, phoneOfRepresentative, emailOfRepresentative } = createCompanyDto;

      return await this.prisma.company.create({
        data: {
          name,
          phoneOfRepresentative,
          emailOfRepresentative,
        },
        include: {
          users: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new EntityAlreadyExistsException('Company', 'name');
        }
      }
      throw error;
    }
  }

  public async findAll(): Promise<(Company & { users: User[] })[]> {
    return this.prisma.company.findMany({
      include: {
        users: true,
      },
    });
  }

  public async findOne(id: number): Promise<Company & { users: User[] }> {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    if (!company) {
      throw new EntityNotFoundException('Company');
    }

    return company;
  }

  public async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company & { users: User[] }> {
    try {
      return await this.prisma.company.update({
        where: { id },
        data: updateCompanyDto,
        include: {
          users: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new EntityAlreadyExistsException('Company', 'name');
        }
      }
      throw error;
    }
  }

  public async remove(id: number): Promise<Company> {
    const company = await this.findOne(id);

    if (company.users && company.users.length > 0) {
      throw new BusinessRuleViolationException(
        `Cannot delete company with ID ${id} because it has ${company.users.length} associated users`,
      );
    }

    return this.prisma.company.delete({
      where: { id },
    });
  }
}
