# Backend

REST API на NestJS 10 + Prisma 7 (PostgreSQL) для управления объявлениями (`Item`).

## Стек

- NestJS 10, TypeScript 5
- Prisma 7 + PostgreSQL (через `pg`)
- Zod для валидации
- Jest для тестов

## Запуск

```bash
pnpm install
pnpm prisma migrate dev
pnpm dev
```

Для продакшена: `pnpm build && pnpm start:prod`.

### Переменные окружения

`.env` в корне `backend/`:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/avito
```

## Эндпоинты

Базовый путь — `/item`.

| Метод | Путь        | Описание                |
|-------|-------------|-------------------------|
| GET   | `/item`     | Список объявлений       |
| GET   | `/item/:id` | Объявление по id        |
| POST  | `/item`     | Создать объявление      |
| POST  | `/item/:id` | Обновить объявление     |

## Модель `Item`

`id`, `name`, `description`, `category`, `price`, `createdAt`, `updatedAt`, и опциональные `model`, `brandName`, `color`, `status`. Полное описание — в [prisma/schema.prisma](prisma/schema.prisma).

## Структура

```
src/
  main.ts            — точка входа
  app.module.ts      — корневой модуль
  prisma/            — PrismaService
  services/items/    — контроллер, сервис, DTO
prisma/
  schema.prisma      — схема БД
  migrations/        — миграции
```

## Скрипты

- `pnpm dev` — запуск с watch
- `pnpm build` — сборка в `dist/`
- `pnpm test` / `pnpm test:e2e` — тесты
- `pnpm lint` / `pnpm format` — линт и форматирование
