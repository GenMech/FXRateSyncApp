import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [ConfigModule.forRoot(), AccountsModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
