export interface Project {
  id?: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: Date;
  endDate: Date;
  teamMembers: string[]; // User IDs
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}