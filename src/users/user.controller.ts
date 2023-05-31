import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from "@nestjs/common";
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createAuthDto: CreateUserDto) {
    return this.UserService.create(createAuthDto);
  }
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.UserService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.UserService.findOne(id);
  }
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateUserDto) {
    return this.UserService.update(id, updateAuthDto);
  }
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.UserService.remove(id);
  }
}
