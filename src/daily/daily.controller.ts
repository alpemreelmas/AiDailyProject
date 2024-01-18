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
} from '@nestjs/common';
import { DailyService } from './daily.service';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateDailyDto } from './dto/update-daily.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

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
