import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly db: DatabaseService) {}

  create(data: CreateTaskDto) {
    return this.db.task.create({ data });
  }

  findAll() {
    return this.db.task.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const task = await this.db.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: number, data: UpdateTaskDto) {
    await this.findOne(id);
    return this.db.task.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.db.task.delete({ where: { id } });
  }
}
