import { Body, Controller, Get, Post ,Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValiationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())

export class TasksController {
    constructor(private tasksService : TaskService){}

    @Get()
    getTasks(
      @Query(ValidationPipe) filterdto:GetTasksFilterDto,
      @GetUser() user:User

    ) : Promise<Task[]>{
     
        return this.tasksService.getTasks(filterdto,user);
    }
    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id:number,@GetUser() user:User) : Promise<Task>{
      return this.tasksService.getTaskbyId(id,user);
    }
  
    @Post()
    @UsePipes(ValidationPipe)
  async createTask(
    @Body() CreateTaskDto:CreateTaskDto,
    @GetUser() user:User
    ) 
    :Promise<Task>{
    return await this.tasksService.createTask(CreateTaskDto,user);  
  }

  @Delete('/:id')
  deleteTask(@Param('id',ParseIntPipe) id:number,
             @GetUser() user:User){
    return this.tasksService.deleteTask(id,user);
  }
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id:number ,
    @Body('status',TaskStatusValiationPipe) status:TaskStatus,
    @GetUser() user:User
    ) : Promise<Task>{
        return this.tasksService.updateTaskStatus(id,status,user);
  }
  
}
