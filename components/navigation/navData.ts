import { Home, Plus, User, LogOut } from 'lucide-react';
import { NavItem } from '../../types/navigation';

export const navigationItems: NavItem[] = [
  {
    id: 'explore',
    label: 'Explore',
    href: '/explore',
    icon: Home,
  },
  {
    id: 'create',
    label: 'Create',
    href: '/create',
    icon: Plus,
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export const getActiveNavItem = (currentPath: string): string => {
  if (currentPath.startsWith('/explore')) return 'explore';
  if (currentPath.startsWith('/create')) return 'create';
  if (currentPath.startsWith('/profile')) return 'profile';
  return 'explore';
};
