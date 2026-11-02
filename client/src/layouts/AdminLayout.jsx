import {
  LayoutDashboard,
  Library,
  Shapes,
  Users,
  BookUp,
  BookDown,
  ClipboardList,
  Receipt,
  BarChart3,
  Bell,
  Settings,
} from 'lucide-react';
import DashboardLayout from './DashboardLayout.jsx';

const links = [
  {
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    heading: 'Catalog',
    items: [
      { to: '/admin/books', label: 'Books', icon: Library },
      { to: '/admin/categories', label: 'Categories', icon: Shapes },
    ],
  },
  {
    heading: 'Circulation',
    items: [
      { to: '/admin/students', label: 'Students', icon: Users },
      { to: '/admin/issue', label: 'Issue Book', icon: BookUp },
      { to: '/admin/return', label: 'Return Book', icon: BookDown },
      { to: '/admin/requests', label: 'Requests', icon: ClipboardList },
      { to: '/admin/fines', label: 'Fines', icon: Receipt },
    ],
  },
  {
    heading: 'Insights',
    items: [
      { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
      { to: '/admin/notifications', label: 'Notifications', icon: Bell },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const AdminLayout = () => (
  <DashboardLayout links={links} title="Admin Panel" subtitle="Manage the LibraFlow catalog and circulation desk" notificationsPath="/admin/notifications" />
);

export default AdminLayout;
