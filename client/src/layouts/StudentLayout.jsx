import {
  LayoutDashboard,
  BookCopy,
  History,
  Heart,
  Bell,
  UserRound,
  ClipboardList,
} from 'lucide-react';
import DashboardLayout from './DashboardLayout.jsx';

const links = [
  {
    items: [
      { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/dashboard/borrowed', label: 'My Borrowed Books', icon: BookCopy },
      { to: '/dashboard/history', label: 'Borrowing History', icon: History },
      { to: '/dashboard/requests', label: 'My Requests', icon: ClipboardList },
      { to: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
      { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
      { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
    ],
  },
];

const StudentLayout = () => (
  <DashboardLayout links={links} title="Student Portal" subtitle="Track loans, requests and your reading list" notificationsPath="/dashboard/notifications" />
);

export default StudentLayout;
