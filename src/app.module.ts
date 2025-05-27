import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, CompaniesModule, ReportsModule],
})
export class AppModule {}
