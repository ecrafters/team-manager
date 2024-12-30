export interface TeamMember {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'developer' | 'tester' | 'marketing' | 'devops' | 'commercial' | 'accounting' | 'rh';
  department?: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}