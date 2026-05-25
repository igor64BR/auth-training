export class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
  workspaceId?: number;
  assigneeId?: number | null;
}
