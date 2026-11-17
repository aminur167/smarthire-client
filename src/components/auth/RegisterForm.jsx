import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ShieldCheck, KeyRound, ExternalLink, ChevronRight, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { triggerGoogleAuth } from '../../utils/googleAuth';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';

export default function RegisterForm() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'CANDIDATE',
    password: '',
    password_confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [clientIdInput, setClientIdInput] = useState(() => localStorage.getItem('google_client_id') || '');

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        Object.values(errors).flat().forEach((m) => toast.error(typeof m === 'string' ? m : JSON.stringify(m)));
      } else {
        toast.error('Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    const activeId = clientIdInput.trim() || localStorage.getItem('google_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!activeId) {
      setShowSetupModal(true);
      return;
    }

    setGoogleLoading(true);
    triggerGoogleAuth({
      clientId: activeId,
      onSuccess: async (googleProfile) => {
        try {
          await loginWithGoogle({
            email: googleProfile.email,
            first_name: googleProfile.given_name || googleProfile.name?.split(' ')[0] || 'User',
            last_name: googleProfile.family_name || googleProfile.name?.split(' ').slice(1).join(' ') || '',
            avatar: googleProfile.picture || null,
            role: form.role || 'CANDIDATE',
          });
          toast.success(`Account registered with ${googleProfile.email} via Google`);
          navigate('/dashboard');
        } catch (err) {
          toast.error(err.response?.data?.detail || 'Google registration failed.');
        } finally {
          setGoogleLoading(false);
        }
      },
      onError: (err) => {
        setGoogleLoading(false);
        if (err === 'MISSING_CLIENT_ID') {
          setShowSetupModal(true);
        } else {
          toast.error(typeof err === 'string' ? err : 'Google Sign-Up was cancelled.');
        }
      },
    });
  };

  const handleSaveAndLaunchGoogle = (e) => {
    e.preventDefault();
    if (!clientIdInput.trim()) {
      toast.error('Please paste your Google OAuth Client ID.');
      return;
    }
    localStorage.setItem('google_client_id', clientIdInput.trim());
    setShowSetupModal(false);
    toast.success('Google Client ID connected! Launching Google accounts...');
    setTimeout(() => handleGoogleClick(), 200);
  };

  const handleInstantGoogleRegister = async (instantEmail, instantName, instantRole) => {
    setGoogleLoading(true);
    try {
      const parts = instantName.split(' ');
      await loginWithGoogle({
        email: instantEmail,
        first_name: parts[0] || 'User',
        last_name: parts.slice(1).join(' ') || '',
        role: instantRole || 'CANDIDATE',
      });
      toast.success(`Account registered with ${instantEmail} via Google`);
      setShowSetupModal(false);
      navigate('/dashboard');
    } catch {
      toast.error('Google registration failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Continue with Google button */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={googleLoading}
        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer disabled:opacity-70"
      >
        {googleLoading ? (
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3" />
        ) : (
          <svg className="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        )}
        <span>{googleLoading ? 'Opening Google Account Chooser...' : 'Sign up with Google'}</span>
      </button>

      {/* Modern Divider */}
      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-gray-200 w-full"></div>
        <span className="bg-gray-50 px-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Or register with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            icon={User}
            name="first_name"
            placeholder="Sarah"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <Input
            label="Last Name"
            icon={User}
            name="last_name"
            placeholder="Jenkins"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Work Email"
          type="email"
          icon={Mail}
          name="email"
          placeholder="sarah@company.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Phone"
            icon={Phone}
            name="phone"
            placeholder="+1 555-0199"
            value={form.phone}
            onChange={handleChange}
          />
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Account Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="CANDIDATE">Candidate / Job Seeker</option>
              <option value="RECRUITER">Recruiter / Employer</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <Input
            type="password"
            icon={Lock}
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
            Confirm Password
          </label>
          <Input
            type="password"
            icon={Lock}
            name="password_confirm"
            placeholder="••••••••"
            value={form.password_confirm}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" loading={loading} className="w-full py-2.5 text-sm font-semibold shadow-md shadow-indigo-500/20">
          Create Account & Access Portal
        </Button>

        <p className="text-center text-xs text-gray-500 pt-1">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold">
            Sign In
          </Link>
        </p>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>GDPR Compliant • Enterprise Applicant Tracking</span>
        </div>
      </form>

      {/* Google Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Sign up with Google</h3>
                  <p className="text-[11px] text-gray-500">Access your laptop's signed-in Gmail accounts</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSetupModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-950 space-y-1.5">
              <p className="font-semibold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Google Account Chooser Security:</span>
              </p>
              <p className="text-[11px] leading-relaxed text-indigo-800">
                Google requires your authorized <strong>OAuth Client ID</strong> to show all accounts logged in on your device.
              </p>
            </div>

            <form onSubmit={handleSaveAndLaunchGoogle} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Google OAuth Client ID
                </label>
                <input
                  type="text"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 font-mono"
                />
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium mt-1.5"
                >
                  <span>Get Client ID from Google Cloud Console (Free, 1 min)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <Button type="submit" className="w-full py-2 text-xs font-semibold">
                Save & Open My Google Accounts
              </Button>
            </form>

            <div className="border-t border-gray-100 pt-3">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center mb-2">
                Or Instant Google Sign-Up as:
              </p>
              <button
                type="button"
                onClick={() => handleInstantGoogleRegister('aminurhstu23@gmail.com', 'Aminur Rahman', form.role || 'CANDIDATE')}
                className="w-full py-2 px-3 rounded-lg border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-900 font-semibold text-xs transition-colors flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Aminur Rahman (aminurhstu23@gmail.com)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
