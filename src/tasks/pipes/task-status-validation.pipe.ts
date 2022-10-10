import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValiationPipe implements PipeTransform{
    readonly allowedStatuses = [
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS,
        TaskStatus.OPEN
    ];
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();
        if(!this.IsStatusValid(value)){
            throw new BadRequestException(`"${value}" is not a valid status`);
        }
        return value;
    }

    private IsStatusValid(status:any){
        const index = this.allowedStatuses.indexOf(status);
        return index !== -1;
    }

}