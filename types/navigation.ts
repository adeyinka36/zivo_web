export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive?: boolean;
}

export interface NavigationProps {
  currentPath?: string;
  className?: string;
}

export type NavigationVariant = 'sidebar' | 'header';
