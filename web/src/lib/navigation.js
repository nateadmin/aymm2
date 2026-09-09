import {
  Home,
  Mail,
  Newspaper,
  Shield,
  User,
  Users,
} from 'lucide-react';

export const APP_NAME = 'Are You My Mother?';

export const NAV_ITEMS = [
  { path: '/Home', icon: Home, label: 'Home', hideForFamily: true },
  { path: '/Messages', icon: Mail, label: 'Letters' },
  { path: '/FamilyTables', icon: Users, label: 'Family Tables' },
  { path: '/Newsfeed', icon: Newspaper, label: 'Feed' },
  { path: '/Profile', icon: User, label: 'Profile' },
];

export const ADMIN_NAV_ITEM = {
  path: '/AdminDashboard',
  icon: Shield,
  label: 'Admin',
};

export const PUBLIC_ROUTES = ['/Welcome', '/AboutUs', '/PrivacyPolicy'];

export const AUTH_LAYOUT_ROUTES = [
  '/Home',
  '/Messages',
  '/FamilyTables',
  '/Newsfeed',
  '/Profile',
  '/AdminDashboard',
];

export function getVisibleNavItems({ isFamily, isAdmin }) {
  const items = NAV_ITEMS.filter((item) => !(isFamily && item.hideForFamily));
  if (isAdmin) {
    items.push(ADMIN_NAV_ITEM);
  }
  return items;
}
