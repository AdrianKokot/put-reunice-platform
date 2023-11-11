import { RouterLink } from '@angular/router';
import {
  ExtendedAccountType,
  ExtendedAccountTypeEnum,
} from '@reunice/modules/shared/data-access';

export interface DashboardTile {
  title: string;
  url: RouterLink['routerLink'];
  icon: string;
  description: string;
  role?: ExtendedAccountType;
}

export const dashboardTiles: DashboardTile[] = [
  {
    title: 'UNIVERSITIES',
    url: ['universities'],
    icon: 'tuiIconHome',
    description: 'UNIVERSITIES_MANAGEMENT',
    role: ExtendedAccountTypeEnum.ADMIN,
  },
  {
    title: 'TEMPLATES',
    url: ['templates'],
    icon: 'tuiIconMap',
    description: 'TEMPLATES_FOR_UNIVERSITY_PAGES',
    role: ExtendedAccountTypeEnum.ADMINISTRATIVE,
  },
  {
    title: 'PAGES',
    url: ['pages'],
    icon: 'tuiIconFile',
    description: 'UNIVERSITY_PAGES_CONTENT',
  },
  {
    title: 'USERS',
    url: ['users'],
    icon: 'tuiIconUsers',
    description: 'ACCOUNTS_AND_ROLES_MANAGEMENT',
    role: ExtendedAccountTypeEnum.ADMINISTRATIVE,
  },
  {
    title: 'BACKUPS',
    url: ['backups'],
    icon: 'tuiIconPackage',
    description: 'SYSTEM_BACKUP_AND_RESTORE',
    role: ExtendedAccountTypeEnum.ADMIN,
  },
  {
    title: 'TICKETS',
    url: ['tickets'],
    icon: 'tuiIconMessageCircle',
    description: 'USERS_QUESTIONS',
  },
];
