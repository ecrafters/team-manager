export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'developer';
  avatar?: string;
  phone?: string;
  department?: string;
  preferences: {
    language: string;
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      browser: boolean;
    };
  };
}