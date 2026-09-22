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
  { path: '/FamilyTables', icon: Users, label: 'Tables' },
  { path: '/Newsfeed', icon: Newspaper, label: 'Feed', hideFromBottomNav: true },
  { path: '/Profile', icon: User, label: 'Profile' },
];

export const ADMIN_NAV_ITEM = {
  path: '/AdminDashboard',
  icon: Shield,
  label: 'Admin',
};

export const PUBLIC_ROUTES = [
  '/',
  '/Splash',
  '/Welcome',
  '/Login',
  '/Register',
  '/EmailLogin',
  '/PhoneLogin',
  '/OTP',
  '/AboutUs',
  '/PrivacyPolicy',
  '/screens',
  '/aymm-catalog',
  '/aymm-demo',
  '/aymm-login',
];

export const AUTH_LAYOUT_ROUTES = [
  '/Home',
  '/Messages',
  '/FamilyTables',
  '/Newsfeed',
  '/Profile',
  '/AdminDashboard',
];

export function getVisibleNavItems({ isFamily, isAdmin, bottomNavOnly = false }) {
  let items = NAV_ITEMS.filter((item) => !(isFamily && item.hideForFamily));
  if (bottomNavOnly) {
    items = items.filter((item) => !item.hideFromBottomNav);
  }
  if (isAdmin) {
    items.push(ADMIN_NAV_ITEM);
  }
  return items;
}
