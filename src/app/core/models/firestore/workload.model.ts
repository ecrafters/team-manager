export interface Workload {
  id?: string;
  userId: string;
  projectId: string;
  allocation: number; // Percentage of time allocated
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}