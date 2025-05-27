import { IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateReportPageDto } from './create-report-page.dto';

export class CreateReportDto {
  @ApiProperty({ description: 'Name of the report' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the report', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Pages in the report',
    type: [CreateReportPageDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReportPageDto)
  pages: CreateReportPageDto[];
} 