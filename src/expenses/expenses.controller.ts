import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from '../auth/dto/create-expense.dto';
import { UpdateExpenseDto } from '../auth/dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/role.decorators';
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    // If userId is not provided, use the current user's ID
    if (!createExpenseDto.userId) {
      createExpenseDto.userId = req.user.id;
    }
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({ status: 200, description: 'Expenses retrieved successfully' })
  findAll() {
    return this.expensesService.findAll();
  }

  @Get('my-expenses')
  @ApiOperation({ summary: 'Get expenses for current user' })
  @ApiResponse({
    status: 200,
    description: 'User expenses retrieved successfully',
  })
  findMyExpenses(@Request() req) {
    return this.expensesService.findByUserId(req.user.id);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly expenses' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Monthly expenses retrieved successfully',
  })
  getMonthlyExpenses(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.expensesService.getMonthlyExpenses(year, month);
  }

  @Get('financial-summary')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get financial summary for a year' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Financial summary retrieved successfully',
  })
  getFinancialSummary(@Query('year') year: number) {
    return this.expensesService.getFinancialSummary(year);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
