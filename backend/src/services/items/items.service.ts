import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateItemDto,
  Item,
  ItemFilterDto,
  UpdateItemDto,
} from './dto/items.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  constructor(private prisma: PrismaService) {}

  async getItems(): Promise<Item[]> {
    return this.prisma.item.findMany();
  }

  async getItemsWithFilter(filter: ItemFilterDto) {
    const { search, category, minPrice, maxPrice, sortBy, order, page, limit } =
      filter;

    const where: Prisma.ItemWhereInput = {
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.item.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.item.count({ where }),
    ]);

    return { items, total };
  }

  async getItemById(id: number): Promise<Item> {
    const result = await this.prisma.item.findUnique({ where: { id } });

    if (!result) {
      this.logger.error(`${id} not found`);
      throw new NotFoundException(`Item ${id} not found`);
    }

    return result;
  }

  async createItems(data: CreateItemDto) {
    return this.prisma.item.create({ data });
  }

  async updateItems(selectedItems: number, data: UpdateItemDto) {
    return this.prisma.item.update({ where: { id: selectedItems }, data });
  }

  async deleteItems(id: number) {
    return this.prisma.item.delete({ where: { id } });
  }
}
