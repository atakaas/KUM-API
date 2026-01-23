import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './database/prisma.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './task/task.module';
import { VillasModule } from './villas/villas.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { ExpensesModule } from './expenses/expenses.module';
import { DashboardModule } from './dashboard/dashboard.module';

import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    /**
     * Global environment & config
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [jwtConfig],
    }),

    /**
     * Rate limiting (basic API protection)
     */
    ThrottlerModule.forRoot([
      {
        ttl: 60_000, // 1 minute
        limit: 100,
      },
    ]),

    /**
     * Database layer
     */
    PrismaModule,

    /**
     * Application features
     */
    AuthModule,
    UsersModule,
    TasksModule,
    VillasModule,
    RoomsModule,
    BookingsModule,
    ExpensesModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
