import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../task-status.enum';
import { GetTasksFilterDto } from './get-tasks-filter.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
  async getTasks(dto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = dto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('upper(task.status) = upper(:status)', { status: status });
    }

    if (search) {
      query.andWhere(
        'lower(task.title) LIKE lower(:search) OR lower(task.description) LIKE lower(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }
  async createTask(dto: CreateTaskDto): Promise<Task> {
    const newTask = this.create({
      status: TaskStatus.OPEN,
      title: dto.title,
      description: dto.description,
    });

    await this.save(newTask);

    return newTask;
  }
}
