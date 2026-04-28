import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ItemsService } from './items.service';
import { PrismaService } from 'src/prisma/prisma.service';

type PrismaMock = {
  item: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    count: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  $transaction: jest.Mock;
};

describe('ItemsService', () => {
  let service: ItemsService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = {
      item: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [ItemsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(ItemsService);
  });

  describe('getItems', () => {
    it('returns all items from prisma', async () => {
      const items = [{ id: 1, name: 'a' }];
      prisma.item.findMany.mockResolvedValue(items);

      await expect(service.getItems()).resolves.toEqual(items);
      expect(prisma.item.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('getItemById', () => {
    it('returns the item when found', async () => {
      const item = { id: 1, name: 'foo' };
      prisma.item.findUnique.mockResolvedValue(item);

      await expect(service.getItemById(1)).resolves.toEqual(item);
      expect(prisma.item.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('throws NotFoundException when missing', async () => {
      prisma.item.findUnique.mockResolvedValue(null);

      await expect(service.getItemById(99)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('getItemsWithFilter', () => {
    it('applies pagination and returns items + total', async () => {
      prisma.$transaction.mockResolvedValue([[{ id: 1 }], 1]);

      const result = await service.getItemsWithFilter({
        sortBy: 'createdAt',
        order: 'desc',
        page: 2,
        limit: 10,
      } as any);

      expect(result).toEqual({ items: [{ id: 1 }], total: 1 });
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('createItems', () => {
    it('forwards data to prisma.item.create', async () => {
      const dto = {
        name: 'x',
        description: 'd',
        category: 'auto',
        price: 10,
      } as any;
      prisma.item.create.mockResolvedValue({ id: 1, ...dto });

      await service.createItems(dto);

      expect(prisma.item.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('updateItems', () => {
    it('targets the right id with the right data', async () => {
      const dto = { price: 200 } as any;
      prisma.item.update.mockResolvedValue({ id: 5, ...dto });

      await service.updateItems(5, dto);

      expect(prisma.item.update).toHaveBeenCalledWith({
        where: { id: 5 },
        data: dto,
      });
    });
  });

  describe('deleteItems', () => {
    it('deletes by id', async () => {
      prisma.item.delete.mockResolvedValue({ id: 1 });

      await service.deleteItems(1);

      expect(prisma.item.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
