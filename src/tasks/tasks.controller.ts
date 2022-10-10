import { Body, Controller, Get, Post ,Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValiationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService : TaskService){}

    @Get()
    getTasks(@Query(ValidationPipe) filterdto:GetTasksFilterDto) : Promise<Task[]>{
     
        return this.tasksService.getTasks(filterdto);
    }
    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id:number) : Promise<Task>{
      return this.tasksService.getTaskbyId(id);
    }
  
    @Post()
    @UsePipes(ValidationPipe)
  async createTask(@Body() CreateTaskDto:CreateTaskDto) :Promise<Task>{
    return await this.tasksService.createTask(CreateTaskDto);  
  }

  @Delete('/:id')
  deleteTask(@Param('id',ParseIntPipe) id:number){
    return this.tasksService.deleteTask(id);
  }
  @Patch('/:id/status')
  updateTaskStatus(@Param('id') id:number , @Body('status',TaskStatusValiationPipe) status:TaskStatus) : Promise<Task>{
        return this.tasksService.updateTaskStatus(id,status);
  }
  
}
