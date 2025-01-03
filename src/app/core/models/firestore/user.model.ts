export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'developer';
  department?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}