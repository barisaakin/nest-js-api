import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TableColumnDto {
  @ApiProperty({ description: 'Column label' })
  @IsString()
  label: string;
}

export class TableFieldDto {
  @ApiProperty({ description: 'Table columns' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableColumnDto)
  columns: TableColumnDto[];

  @ApiProperty({ description: 'Number of rows in the table' })
  @IsNumber()
  rowCount: number;
} 