import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ShieldCheck, CheckCircle2, ChevronRight, UserPlus, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
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
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [showCustomEmailInput, setShowCustomEmailInput] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleRole, setCustomGoogleRole] = useState('CANDIDATE');

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

  const executeGoogleSignUp = async (account) => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle({
        email: account.email,
        first_name: account.firstName,
        last_name: account.lastName,
        role: account.role || 'CANDIDATE',
      });
      toast.success(`Account registered with ${account.email} via Google`);
      setShowGoogleChooser(false);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Google registration failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) {
      toast.error('Please enter a valid Google email.');
      return;
    }
    const nameParts = (customGoogleName.trim() || customGoogleEmail.split('@')[0]).split(' ');
    executeGoogleSignUp({
      email: customGoogleEmail.trim(),
      firstName: nameParts[0] || 'Google',
      lastName: nameParts.slice(1).join(' ') || 'User',
      role: customGoogleRole,
    });
  };

  const googleAccounts = [
    {
      email: 'aminurhstu23@gmail.com',
      name: 'Aminur Rahman',
      firstName: 'Aminur',
      lastName: 'Rahman',
      role: 'CANDIDATE',
      avatarColor: 'bg-indigo-600',
      initial: 'A',
      tag: 'Candidate / Recruiter',
    },
    {
      email: 'aminur.candidate@gmail.com',
      name: 'Aminur Rahman (Job Seeker)',
      firstName: 'Aminur',
      lastName: 'Rahman',
      role: 'CANDIDATE',
      avatarColor: 'bg-emerald-600',
      initial: 'C',
      tag: 'Candidate Portal',
    },
    {
      email: 'talent.partner@gmail.com',
      name: 'Talent Acquisition Lead',
      firstName: 'Talent',
      lastName: 'Lead',
      role: 'RECRUITER',
      avatarColor: 'bg-blue-600',
      initial: 'T',
      tag: 'Recruiter ATS',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Continue with Google button */}
      <button
        type="button"
        onClick={() => setShowGoogleChooser(true)}
        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
      >
        <svg className="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Sign up with Google</span>
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

      {/* Google Account Chooser Modal for Register */}
      {showGoogleChooser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-500">Sign up with Google</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Choose an account</h3>
                <p className="text-xs text-gray-500">to register your SmartHire AI profile</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowGoogleChooser(false);
                  setShowCustomEmailInput(false);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!showCustomEmailInput ? (
              <div className="space-y-2 border-y border-gray-100 py-3">
                {googleAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={googleLoading}
                    onClick={() => executeGoogleSignUp(acc)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full ${acc.avatarColor} text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm`}>
                        {acc.initial}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 text-sm truncate">{acc.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                            {acc.tag}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{acc.email}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShowCustomEmailInput(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-dashed border-gray-300 hover:border-indigo-300 transition-all text-left cursor-pointer text-gray-700"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-indigo-600">Register another Google account</span>
                    <p className="text-[11px] text-gray-400">Sign up using custom Gmail or Google Workspace</p>
                  </div>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 border-y border-gray-100 py-4">
                <p className="text-xs font-semibold text-gray-700">Enter your Google Email:</p>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="you@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Full Name (e.g. John Doe)"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Select Your Role
                  </label>
                  <select
                    value={customGoogleRole}
                    onChange={(e) => setCustomGoogleRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="CANDIDATE">Candidate / Job Seeker</option>
                    <option value="RECRUITER">Recruiter / Employer</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button type="submit" loading={googleLoading} className="flex-1 py-2 text-xs">
                    Register with Google
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowCustomEmailInput(false)}
                    className="px-3 py-2 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                By continuing, Google shares your profile details with SmartHire AI. See{' '}
                <a href="#privacy" className="text-indigo-600 hover:underline">Privacy Policy</a> and{' '}
                <a href="#terms" className="text-indigo-600 hover:underline">Terms of Service</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
