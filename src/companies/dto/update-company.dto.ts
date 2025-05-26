import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    example: 'Acme Corporation',
    description: 'The name of the company',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: '+1 (555) 123-4567',
    description: 'The phone number of the company representative',
  })
  @IsString()
  @IsOptional()
  phoneOfRepresentative?: string;

  @ApiPropertyOptional({
    example: 'contact@acme.com',
    description: 'The email of the company representative',
  })
  @IsEmail()
  @IsOptional()
  emailOfRepresentative?: string;
}
