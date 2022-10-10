import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TaskRepository } from './tasks/task.repository';
import { TasksModule } from './tasks/tasks.module';


@Module({
  imports: [
    
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
