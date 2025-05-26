import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'Acme Corporation',
    description: 'The name of the company',
  })
  @IsString()
  name: string;

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
