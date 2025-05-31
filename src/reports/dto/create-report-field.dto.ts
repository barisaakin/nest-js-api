import { IsString, IsBoolean, IsOptional, IsInt, Min, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TableFieldDto } from './table-field.dto';

export class CreateReportFieldDto {
  @ApiProperty({ description: 'Type of the field (text, heading, textarea, number, table, etc.)' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Label of the field' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'Whether the field is required', required: false, default: false })
  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @ApiProperty({ description: 'Text alignment (start, center, end)', required: false, default: 'start' })
  @IsString()
  @IsOptional()
  align?: string;

  @ApiProperty({ description: 'Whether the text is bold', required: false, default: false })
  @IsBoolean()
  @IsOptional()
  bold?: boolean;

  @ApiProperty({ description: 'Whether the text is italic', required: false, default: false })
  @IsBoolean()
  @IsOptional()
  italic?: boolean;

  @ApiProperty({ description: 'Whether the text is underlined', required: false, default: false })
  @IsBoolean()
  @IsOptional()
  underline?: boolean;

  @ApiProperty({ description: 'Value of the field', required: false })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ description: 'Background color of the field', required: false, default: '' })
  @IsString()
  @IsOptional()
  bgColor?: string;

  @ApiProperty({ description: 'Font color of the field', required: false, default: '' })
  @IsString()
  @IsOptional()
  fontColor?: string;

  @ApiProperty({ description: 'Font size of the field', required: false, default: 16 })
  @IsInt()
  @Min(1)
  @IsOptional()
  fontSize?: number;

  @ApiProperty({ description: 'Height of the field', required: false, default: '' })
  @IsString()
  @IsOptional()
  height?: string;

  @ApiProperty({ description: 'Width of the field', required: false, default: '' })
  @IsString()
  @IsOptional()
  width?: string;

  @ApiProperty({ description: 'Margin of the field', required: false, default: '' })
  @IsString()
  @IsOptional()
  margin?: string;

  @ApiProperty({ 
    description: 'Table configuration (only for type: "table")',
    type: TableFieldDto,
    required: false 
  })
  @IsObject()
  @IsOptional()
  tableConfig?: TableFieldDto;
} 