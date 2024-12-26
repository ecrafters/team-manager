import { Absence } from '../../../features/absences/models/absence.model';

// Mock des absences
export const MOCK_ABSENCES: Absence[] = [
  {
    id: '1',
    userId: '1',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-20'),
    type: 'vacation',
    status: 'approved',
    reason: 'Vacances d\'hiver'
  },
  {
    id: '2',
    userId: '1',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-02'),
    type: 'remote',
    status: 'approved',
    reason: 'Télétravail'
  },
  {
    id: '3',
    userId: '1',
    startDate: new Date('2024-03-10'),
    endDate: new Date('2024-03-12'),
    type: 'sick',
    status: 'pending',
    reason: 'Maladie'
  }
];

// Mock des projets
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: Date;
  endDate: Date;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Refonte Site Web',
    description: 'Modernisation du site web corporate',
    status: 'active',
    progress: 65,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30')
  },
  {
    id: '2',
    name: 'App Mobile',
    description: 'Développement application mobile',
    status: 'on-hold',
    progress: 30,
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-08-15')
  }
];

// Mock des membres de l'équipe
export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  avatar: string;
}

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Manager',
    department: 'Tech',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'Developer',
    department: 'Tech',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    role: 'Designer',
    department: 'Design',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];