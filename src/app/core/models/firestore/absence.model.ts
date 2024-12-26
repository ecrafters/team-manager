export interface Absence {
  id?: string;
  userId: string;
  type: 'vacation' | 'sick' | 'remote' | 'other';
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  approvedBy?: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}