import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SessionsService } from './sessions.service';
import { Session } from './model/session.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Session])],
  providers: [SessionsService],
  controllers: [],
  exports: [SessionsService],
})
export class SessionsModule {}
