import { Injectable, NotFoundException, Query } from '@nestjs/common';
import {TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';


@Injectable()
export class TaskService {

    
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
        ){}

    async getTasks(filterdto:GetTasksFilterDto) : Promise<Task[]>{
        const {status,search} = filterdto;
        const query = this.taskRepository.createQueryBuilder('task');
        if(status){
            query.andWhere('task.status = :status',{status});
        }
        if(search){
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search:`%${search}%`});
        }
        const task= await query.getMany();
        return task;
    }
  

    async getTaskbyId(id: number) {
        const found = await this.taskRepository.findOneBy({
            id: id 
            });
        if(!found){
            throw new NotFoundException();
        }
        return found;
    }

    async createTask(createTaskDto:CreateTaskDto): Promise<Task>{

        const{title,description} = createTaskDto;
        let task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();
        return task;
    }
    async deleteTask(id:number) : Promise<void>{
        const result =  await this.taskRepository.delete(id);
        if(result.affected === 0){
            throw new NotFoundException(`Task with id "${id}" not found`)
        }
        
    }
    async updateTaskStatus(id:number,status:TaskStatus):Promise<Task> {
        const task = await this.getTaskbyId(id);
        task.status = status;
        await task.save();
        return task;
    }
}
