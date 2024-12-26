export interface TeamMember {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'developer';
  department?: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}