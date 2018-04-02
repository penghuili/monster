export interface Project {
  id?: string;
  title?: string;
  note?: string;
  status?: ProjectStatus;
  finishAt?: number;
  createdAt?: number;
  updatedAt?: number;
}

export enum ProjectStatus {
  InProgress,
  Archive
}

export function createProject(data: Project): Project {
  const timestamp = new Date().getTime();
  return {
    id: `t${timestamp}`,
    title: data.title,
    note: data.note,
    status: ProjectStatus.InProgress,
    createdAt: data.createdAt
  };
}
