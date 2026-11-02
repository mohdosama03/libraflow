import { useState } from 'react';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Hash, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { userService } from '../../services';
import { initialsFor } from '../../utils/visual';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { user: fresh } = await userService.updateProfile(form);
      updateUser(fresh);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (passwordForm.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setSavingPassword(true);
    try {
      await userService.updateProfile({ password: passwordForm.password });
      setPasswordForm({ password: '', confirmPassword: '' });
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-xl font-semibold text-ink">Profile</h2>
      <p className="mt-1 text-sm text-ink/50">Manage your personal information and password.</p>

      <div className="card mt-6 flex items-center gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-plum-500 text-xl font-semibold text-white">
          {initialsFor(user.name)}
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-ink">{user.name}</p>
          <p className="text-sm text-ink/50">{user.email}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">{user.studentId}</p>
        </div>
      </div>

      <form onSubmit={handleProfileSubmit} className="card mt-6 space-y-4 p-6">
        <p className="font-display text-base font-semibold text-ink">Personal Information</p>

        <div>
          <label className="label">Full name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
            <input className="input pl-10" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
        </div>

        <div>
          <label className="label">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
            <input className="input bg-ink/[0.03] pl-10 text-ink/50" value={user.email} disabled />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Phone</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
              <input className="input pl-10" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Student ID</label>
            <div className="relative">
              <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
              <input className="input bg-ink/[0.03] pl-10 text-ink/50" value={user.studentId} disabled />
            </div>
          </div>
        </div>

        <button type="submit" disabled={savingProfile} className="btn-primary">
          {savingProfile ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="card mt-6 space-y-4 p-6">
        <p className="font-display text-base font-semibold text-ink">Change Password</p>
        <div>
          <label className="label">New password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
            <input
              type="password"
              className="input pl-10"
              placeholder="At least 6 characters"
              value={passwordForm.password}
              onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label">Confirm new password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
            <input
              type="password"
              className="input pl-10"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" disabled={savingPassword} className="btn-outline">
          {savingPassword ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
