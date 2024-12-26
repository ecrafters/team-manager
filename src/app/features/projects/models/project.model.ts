export interface Project {
  id?: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: Date;  // Made required
  endDate: Date;    // Made required
  teamMembers: string[]; // Array of user IDs
  createdBy: string; // User ID of creator
  createdAt: Date;
  updatedAt: Date;
}