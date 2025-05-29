/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto, userId: number, companyId: number) {
    try {
      return await this.prisma.report.create({
        data: {
          name: createReportDto.name,
          description: createReportDto.description,
          userId,
          companyId,
          pages: {
            create: createReportDto.pages.map((page) => ({
              name: page.name,
              fields: {
                create: page.fields.map((field) => ({
                  type: field.type,
                  label: field.label,
                  required: field.required,
                  align: field.align,
                  bold: field.bold,
                  italic: field.italic,
                  underline: field.underline,
                  value: field.value,
                  bgColor: field.bgColor,
                  fontColor: field.fontColor,
                  fontSize: field.fontSize,
                  height: field.height,
                  width: field.width,
                  margin: field.margin,
                })),
              },
            })),
          },
        },
        include: {
          pages: {
            include: {
              fields: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('REPORT CREATE ERROR:', error);
      throw error;
    }
  }

  async findAll(companyId: number) {
    try {
      return await this.prisma.report.findMany({
        where: {
          companyId,
        },
        include: {
          pages: {
            include: {
              fields: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('REPORT FINDALL ERROR:', error);
      throw error;
    }
  }

  async findOne(id: number, companyId: number) {
    try {
      const report = await this.prisma.report.findFirst({
        where: {
          id,
          companyId,
        },
        include: {
          pages: {
            include: {
              fields: true,
            },
          },
        },
      });

      if (!report) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }

      return report;
    } catch (error) {
      console.error('REPORT FINDONE ERROR:', error);
      throw error;
    }
  }

  async delete(id: number, companyId: number): Promise<void> {
    try {
      const report = await this.prisma.report.findFirst({
        where: {
          id,
          companyId,
        },
      });

      if (!report) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }

      await this.prisma.report.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error('REPORT DELETE ERROR:', error);
      throw error;
    }
  }

  async update(id: number, updateReportDto: UpdateReportDto, companyId: number) {
    try {
      const report = await this.prisma.report.findFirst({
        where: {
          id,
          companyId,
        },
      });

      if (!report) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }

      // If pages are being updated, we need to handle them separately
      if (updateReportDto.pages) {
        // First delete existing pages and their fields
        await this.prisma.reportPage.deleteMany({
          where: { reportId: id },
        });

        // Then create new pages with their fields
        return await this.prisma.report.update({
          where: { id },
          data: {
            name: updateReportDto.name,
            description: updateReportDto.description,
            pages: {
              create: updateReportDto.pages.map((page) => ({
                name: page.name,
                fields: {
                  create: page.fields.map((field) => ({
                    type: field.type,
                    label: field.label,
                    required: field.required,
                    align: field.align,
                    bold: field.bold,
                    italic: field.italic,
                    underline: field.underline,
                    value: field.value,
                    bgColor: field.bgColor,
                    fontColor: field.fontColor,
                    fontSize: field.fontSize,
                    height: field.height,
                    width: field.width,
                    margin: field.margin,
                  })),
                },
              })),
            },
          },
          include: {
            pages: {
              include: {
                fields: true,
              },
            },
          },
        });
      }

      // If no pages are being updated, just update the basic report info
      return await this.prisma.report.update({
        where: { id },
        data: {
          name: updateReportDto.name,
          description: updateReportDto.description,
        },
        include: {
          pages: {
            include: {
              fields: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('REPORT UPDATE ERROR:', error);
      throw error;
    }
  }
}
