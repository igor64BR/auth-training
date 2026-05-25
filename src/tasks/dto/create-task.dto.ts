export class CreateTaskDto {
  title!: string;
  description?: string;
  status?: string;
  workspaceId!: number;
  assigneeId?: number;
}
