import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Category, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const items = [
  {
    id: 1,
    name: 'Toyota Camry 2020',
    description: 'Седан в хорошем состоянии, один владелец.',
    category: Category.auto,
    price: 2300000,
  },
  {
    id: 2,
    name: 'Ноутбук Lenovo',
    description: 'Рабочий ноутбук для учебы и разработки.',
    category: Category.electronics,
    price: 120000,
  },
  {
    id: 3,
    name: 'iPhone 14 Pro',
    description: 'Смартфон 256 ГБ, без сколов и царапин.',
    category: Category.electronics,
    price: 85000,
  },
  {
    id: 4,
    name: 'Квартира-студия',
    description: 'Студия рядом с метро, 28 м².',
    category: Category.real_estate,
    price: 7200000,
  },
  {
    id: 5,
    name: 'Volkswagen Polo',
    description: 'Автомобиль после ТО, зимняя резина в комплекте.',
    category: Category.auto,
    price: 1100000,
  },
];

async function main() {
  for (const item of items) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
      },
      create: item,
    });
  }

  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('"Item"', 'id'),
      (SELECT MAX(id) FROM "Item")
    )
  `;

  console.log(`Seeded ${items.length} items`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
