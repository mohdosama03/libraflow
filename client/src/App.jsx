import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import StudentLayout from './layouts/StudentLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Books from './pages/Books.jsx';
import BookDetails from './pages/BookDetails.jsx';
import Categories from './pages/Categories.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import NotFound from './pages/NotFound.jsx';

import StudentDashboard from './pages/student/StudentDashboard.jsx';
import MyBorrowed from './pages/student/MyBorrowed.jsx';
import BorrowHistory from './pages/student/BorrowHistory.jsx';
import MyRequests from './pages/student/MyRequests.jsx';
import Wishlist from './pages/student/Wishlist.jsx';
import StudentNotifications from './pages/student/Notifications.jsx';
import Profile from './pages/student/Profile.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageBooks from './pages/admin/ManageBooks.jsx';
import ManageCategories from './pages/admin/ManageCategories.jsx';
import ManageStudents from './pages/admin/ManageStudents.jsx';
import StudentDetail from './pages/admin/StudentDetail.jsx';
import IssueBook from './pages/admin/IssueBook.jsx';
import ReturnBook from './pages/admin/ReturnBook.jsx';
import ManageRequests from './pages/admin/ManageRequests.jsx';
import ManageFines from './pages/admin/ManageFines.jsx';
import Reports from './pages/admin/Reports.jsx';
import AdminNotifications from './pages/admin/AdminNotifications.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route
        element={
          <ProtectedRoute role="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/dashboard/borrowed" element={<MyBorrowed />} />
        <Route path="/dashboard/history" element={<BorrowHistory />} />
        <Route path="/dashboard/requests" element={<MyRequests />} />
        <Route path="/dashboard/wishlist" element={<Wishlist />} />
        <Route path="/dashboard/notifications" element={<StudentNotifications />} />
        <Route path="/dashboard/profile" element={<Profile />} />
      </Route>

      <Route
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<ManageBooks />} />
        <Route path="/admin/categories" element={<ManageCategories />} />
        <Route path="/admin/students" element={<ManageStudents />} />
        <Route path="/admin/students/:id" element={<StudentDetail />} />
        <Route path="/admin/issue" element={<IssueBook />} />
        <Route path="/admin/return" element={<ReturnBook />} />
        <Route path="/admin/requests" element={<ManageRequests />} />
        <Route path="/admin/fines" element={<ManageFines />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
