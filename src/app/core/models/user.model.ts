export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'developer' | 'crafters' | 'quickwins' | 'onboard';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}