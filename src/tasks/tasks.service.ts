import { Injectable, NotFoundException, Query } from '@nestjs/common';
import {TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';


@Injectable()
export class TaskService {

    
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
        ){}

    async getTasks(filterdto:GetTasksFilterDto,user:User) : Promise<Task[]>{
        const {status,search} = filterdto;
        const query = this.taskRepository.createQueryBuilder('task');
        query.where('task.userId = :userId',{userId:user.id})
        if(status){
            query.andWhere('task.status = :status',{status});
        }
        if(search){
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search:`%${search}%`});
        }
        const task= await query.getMany();
        return task;
    }
  

    async getTaskbyId(id: number,user:User) {
        const found = await this.taskRepository.findOneBy({
            id:id,
            userId : parseInt(user.id)
            });
        if(!found){
            throw new NotFoundException();
        }
        return found;
    }

    async createTask(createTaskDto:CreateTaskDto,user:User): Promise<Task>{

        const{title,description} = createTaskDto;
        let task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();
        delete task.user;
        return task;
    }
    async deleteTask(id:number,user:User) : Promise<void>{
        const result =  await this.taskRepository.delete({id,userId:parseInt(user.id)});
        if(result.affected === 0){
            throw new NotFoundException(`Task with id "${id}" not found`)
        }
        
    }
    async updateTaskStatus(id:number,status:TaskStatus,user:User):Promise<Task> {
        const task = await this.getTaskbyId(id,user);
        task.status = status;
        await task.save();
        return task;
    }
}
