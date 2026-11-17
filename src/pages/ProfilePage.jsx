import { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, changePassword } from '../api/auth';
import CVUpload from '../components/candidates/CVUpload';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  Camera,
  Trash2,
  ShieldCheck,
  Mail,
  Phone,
  Briefcase,
  Lock,
  User as UserIcon,
  Sparkles,
  FileText,
  Calendar,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function ProfilePage() {
  const { user, loadUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'security' | 'resume'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    toast.success('Photo preview ready. Click "Save Profile" to update.');
  };

  const handleRemoveAvatar = async () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Save null avatar immediately
    try {
      const formData = new FormData();
      formData.append('first_name', form.first_name);
      formData.append('last_name', form.last_name);
      formData.append('avatar', '');
      await updateProfile(formData);
      await loadUser();
      toast.success('Avatar removed.');
    } catch {
      toast.error('Failed to remove avatar.');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append('first_name', form.first_name);
      formData.append('last_name', form.last_name);
      formData.append('phone', form.phone);
      formData.append('bio', form.bio);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      await updateProfile(formData);
      await loadUser();
      toast.success('Profile updated successfully!');
      setAvatarFile(null);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to update profile.';
      toast.error(errorMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      const msg = err.response?.data?.old_password?.[0] || err.response?.data?.detail || 'Password change failed.';
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner & Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover gradient */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 relative p-6 flex items-end justify-between">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SmartHire Enterprise Profile
            </span>
          </div>
          <div className="relative z-10 hidden sm:flex items-center gap-2 text-white/80 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>Member since {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : '2026'}</span>
          </div>
        </div>

        {/* Profile info & Floating Avatar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-4">
              {/* Avatar Container with upload overlay */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl ring-4 ring-white shadow-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={user?.first_name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(`${user?.first_name || ''} ${user?.last_name || 'User'}`)
                  )}
                </div>

                {/* Upload action overlay button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
                  title="Upload / Change Profile Picture"
                >
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-[11px] font-medium">Change Photo</span>
                </button>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                />

                {/* Remove button if avatar exists */}
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Title & Badge */}
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    {user?.first_name} {user?.last_name || 'User'}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600" title="Verified Account" />
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  {user?.email}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {user?.role || 'RECRUITER'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Camera className="w-4 h-4 text-gray-500" />
                Upload Photo
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-100 pt-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'general'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              General Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              Security & Password
            </button>
            {user?.role === 'CANDIDATE' && (
              <button
                onClick={() => setActiveTab('resume')}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'resume'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                Resume & Documents
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab 1: General Profile Details */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Personal Details</h2>
              <p className="text-xs text-gray-500">Update your public identity and profile credentials.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="First Name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="e.g. Sarah"
                required
              />
              <Input
                label="Last Name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="e.g. Jenkins"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed directly.</p>
              </div>

              <Input
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 019-2834"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Professional Bio / Summary
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none transition-all text-sm leading-relaxed"
                placeholder="Experienced Talent Acquisition Specialist specializing in scaling high-growth engineering teams..."
              />
              <p className="text-[11px] text-gray-400 mt-1">Brief summary shown to candidates and team members.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="submit" loading={savingProfile} className="px-6">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Security & Authentication</h2>
              <p className="text-xs text-gray-500">Manage your password and safeguard your account.</p>
            </div>
          </div>

          <form onSubmit={handleSavePassword} className="max-w-md space-y-4">
            <Input
              label="Current Password"
              name="old_password"
              type="password"
              value={passwordForm.old_password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              required
            />
            <Input
              label="New Password"
              name="new_password"
              type="password"
              value={passwordForm.new_password}
              onChange={handlePasswordChange}
              placeholder="Minimum 8 characters"
              required
            />
            <Input
              label="Confirm New Password"
              name="confirm_password"
              type="password"
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
              placeholder="Re-enter new password"
              required
            />

            <div className="pt-2">
              <Button type="submit" loading={savingPassword} className="w-full">
                Update Password
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Resume Upload for Candidates */}
      {activeTab === 'resume' && user?.role === 'CANDIDATE' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Resume & Credentials</h2>
              <p className="text-xs text-gray-500">Upload your latest PDF CV for AI matching and applicant ranking.</p>
            </div>
          </div>
          <CVUpload />
        </div>
      )}
    </div>
  );
}
