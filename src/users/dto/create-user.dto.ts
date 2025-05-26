import { IsString, IsEmail, IsOptional, IsInt, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'USER',
    description: 'The role of the user',
    enum: Role,
    default: Role.USER,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({
    example: 1,
    description: 'The ID of the company this user belongs to',
  })
  @IsInt()
  @IsOptional()
  companyId?: number;
}
