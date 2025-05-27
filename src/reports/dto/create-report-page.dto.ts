import { IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateReportFieldDto } from './create-report-field.dto';

export class CreateReportPageDto {
  @ApiProperty({ description: 'Name of the page' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Fields in the page',
    type: [CreateReportFieldDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReportFieldDto)
  fields: CreateReportFieldDto[];
} 