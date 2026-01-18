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
import { VillasService } from './villas.service';
import { CreateVillaDto } from '../auth/dto/create-villa.dto';
import { UpdateVillaDto } from '../auth/dto/update-villa.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/role.decorators';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Villas')
@Controller('villas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VillasController {
  constructor(private readonly villasService: VillasService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new villa' })
  @ApiResponse({ status: 201, description: 'Villa created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createVillaDto: CreateVillaDto) {
    return this.villasService.create(createVillaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all villas' })
  @ApiResponse({ status: 200, description: 'Villas retrieved successfully' })
  findAll() {
    return this.villasService.findAll();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available villas for specific dates' })
  @ApiQuery({ name: 'checkInDate', required: true, type: String })
  @ApiQuery({ name: 'checkOutDate', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Available villas retrieved successfully' })
  findAvailable(
    @Query('checkInDate') checkInDate: string,
    @Query('checkOutDate') checkOutDate: string,
  ) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    return this.villasService.findAvailableVillas(checkIn, checkOut);
  }

  @Get('my-villas')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  @ApiOperation({ summary: 'Get villas assigned to current staff' })
  @ApiResponse({ status: 200, description: 'Staff villas retrieved successfully' })
  findMyVillas(@Request() req) {
    return this.villasService.findVillasByStaffId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get villa by ID' })
  @ApiResponse({ status: 200, description: 'Villa retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Villa not found' })
  findOne(@Param('id') id: string) {
    return this.villasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update villa by ID' })
  @ApiResponse({ status: 200, description: 'Villa updated successfully' })
  @ApiResponse({ status: 404, description: 'Villa not found' })
  update(@Param('id') id: string, @Body() updateVillaDto: UpdateVillaDto) {
    return this.villasService.update(id, updateVillaDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete villa by ID' })
  @ApiResponse({ status: 200, description: 'Villa deleted successfully' })
  @ApiResponse({ status: 404, description: 'Villa not found' })
  remove(@Param('id') id: string) {
    return this.villasService.remove(id);
  }
}