import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseArrayPipe,
} from '@nestjs/common';
import { DailyService } from './daily.service';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateDailyDto } from './dto/update-daily.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDailyDto } from './dto/order-daily.dto';

@ApiTags('Daily')
@Controller('daily')
@UseGuards(AuthGuard)
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}

  @Post()
  create(@Req() req, @Body() createDailyDto: CreateDailyDto) {
    return this.dailyService.create(createDailyDto, req.user);
  }

  @Get()
  findAll(@Req() req) {
    return this.dailyService.findAll(req.user);
  }

  @Post('/order')
  order(
    @Req() req,
    @Body(new ParseArrayPipe({ items: OrderDailyDto }))
    orderDailyDtos: OrderDailyDto[],
  ) {
    return this.dailyService.order(orderDailyDtos, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.dailyService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDailyDto: UpdateDailyDto,
    @Req() req,
  ) {
    return this.dailyService.update(id, updateDailyDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.dailyService.remove(id, req.user);
  }
}
