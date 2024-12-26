export interface Absence {
  id?: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  type: 'vacation' | 'sick' | 'remote' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  validationComment?: string;
  validatedBy?: string;
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}