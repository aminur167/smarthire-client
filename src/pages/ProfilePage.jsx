import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../api/auth';
import CVUpload from '../components/candidates/CVUpload';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, loadUser } = useAuth();
  const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', phone: user?.phone || '', bio: user?.bio || '' });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await updateProfile(form); await loadUser(); toast.success('Profile updated!'); }
    catch { toast.error('Update failed'); }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>

      {/* Avatar & Info */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {getInitials(`${user?.first_name} ${user?.last_name}`)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.first_name} {user?.last_name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-100 text-primary-700 mt-1">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
            <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
          </div>
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="input-field" placeholder="Tell us about yourself..." />
          </div>
          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </div>

      {/* Resume Upload for candidates */}
      {user?.role === 'CANDIDATE' && (
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Resume / CV</h3>
          <CVUpload />
        </div>
      )}
    </div>
  );
}
