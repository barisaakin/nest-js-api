/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({
    status: 201,
    description: 'The report has been successfully created.',
    type: CreateReportDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createReportDto: CreateReportDto, @Request() req) {
    console.log('REQ.USER:', req.user);
    return this.reportsService.create(createReportDto, req.user.userId, req.user.companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports for the company' })
  @ApiResponse({
    status: 200,
    description: 'Returns all reports for the company.',
    type: [CreateReportDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Request() req) {
    return this.reportsService.findAll(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the report.',
    type: CreateReportDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.reportsService.findOne(id, req.user.companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report' })
  @ApiResponse({ status: 200, description: 'The report has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.reportsService.delete(id, req.user.companyId);
  }
}
