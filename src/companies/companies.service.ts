import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, User } from '@prisma/client';
import { PrismaErrorHandler } from '../common/errors/prisma-error.handler';
import { EntityNotFoundException } from 'src/common/exceptions/business.exception';

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
      PrismaErrorHandler.handle(error);
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

  public async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company & { users: User[] }> {
    try {
      return await this.prisma.company.update({
        where: { id },
        data: updateCompanyDto,
        include: {
          users: true,
        },
      });
    } catch (error) {
      PrismaErrorHandler.handle(error);
    }
  }

  public async remove(id: number): Promise<Company> {
    const company = await this.findOne(id);
  
    if (company.users?.length > 0) {
      throw new BadRequestException(
        `Company cannot be deleted because it has ${company.users.length} related users.`,
      );
    }
    
    return await this.prisma.company.delete({
      where: { id },
    });
  }
}
