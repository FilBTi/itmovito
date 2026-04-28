import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  ParseIntPipe,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import {
  CreateItemDto,
  Item,
  ItemFilterDto,
  UpdateItemDto,
} from './dto/items.dto';

@ApiTags('items')
@Controller('/item')
export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  @Get('')
  async list(@Query() query: ItemFilterDto) {
    return this.service.getItemsWithFilter(query);
  }

  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Item> {
    return this.service.getItemById(id);
  }

  @Post('')
  async create(@Body() data: CreateItemDto) {
    return this.service.createItems(data);
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateItemDto,
  ) {
    return this.service.updateItems(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteItems(id);
  }
}
