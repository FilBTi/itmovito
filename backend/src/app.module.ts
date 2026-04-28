import { Module } from '@nestjs/common';
import { ItemModule } from './services/items/items.module';

@Module({
  imports: [ItemModule],
})
export class AppModule {}
