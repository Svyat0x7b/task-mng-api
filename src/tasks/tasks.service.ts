import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksRepository } from './dto/tasks.repository';
import { Task } from './dto/task.entity';
import { UpdateResult } from 'typeorm';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  constructor(private tasksRepository: TasksRepository) {}

  async getTasks(dto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(dto);
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(dto);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id: id } });

    if (!found) {
      throw new NotFoundException(`Task with id:${id} not found!`);
    }
    return found;
  }

  async removeTaskById(id: string): Promise<void> {
    let result;
    try {
      result = await this.tasksRepository.delete(id);
    } catch (ex) {
      throw new BadRequestException(ex.message);
    }

    if (result.affected === 0) {
      throw new NotFoundException(
        `Task with such id: ${id} doesnt exist! Deleting failed!`,
      );
    }
  }

  async updateTaskStatusById(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
