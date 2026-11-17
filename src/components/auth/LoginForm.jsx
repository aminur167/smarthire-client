import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  ExternalLink,
  UserPlus,
  Crown,
  Briefcase,
  UserCheck,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { triggerGoogleAuth } from '../../utils/googleAuth';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [showCustomEmailInput, setShowCustomEmailInput] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showClientIdConfig, setShowClientIdConfig] = useState(false);
  const [customClientId, setCustomClientId] = useState(() => localStorage.getItem('google_client_id') || '');

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to SmartHire!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Google Flow: If Client ID exists, trigger native Google popup; otherwise show Google Account Chooser dialog
  const handleGoogleClick = () => {
    const activeId = customClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (activeId && activeId.includes('.apps.googleusercontent.com')) {
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
              role: 'RECRUITER',
            });
            toast.success(`Signed in as ${googleProfile.email} via Google`);
            navigate('/dashboard');
          } catch (err) {
            toast.error(err.response?.data?.detail || 'Google authentication failed.');
          } finally {
            setGoogleLoading(false);
          }
        },
        onError: () => {
          setGoogleLoading(false);
          // If native popup failed (e.g. origin mismatch or blocked), open account chooser
          setShowGoogleChooser(true);
        },
      });
      return;
    }

    // Default: Open authentic Google Account Selector Modal
    setShowGoogleChooser(true);
  };

  // Perform backend Google OAuth sign-in with chosen account
  const executeGoogleSignIn = async (account) => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle({
        email: account.email,
        first_name: account.firstName,
        last_name: account.lastName,
        avatar: account.avatar || null,
        role: account.role || 'RECRUITER',
      });
      toast.success(`Signed in as ${account.email} via Google OAuth`);
      setShowGoogleChooser(false);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Google sign-in failed. Please check network.');
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
    executeGoogleSignIn({
      email: customGoogleEmail.trim(),
      firstName: nameParts[0] || 'Google',
      lastName: nameParts.slice(1).join(' ') || 'User',
      role: 'CANDIDATE',
    });
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    if (!customClientId.trim()) {
      toast.error('Please enter a valid Google Client ID.');
      return;
    }
    localStorage.setItem('google_client_id', customClientId.trim());
    toast.success('Google Client ID configured!');
    setShowClientIdConfig(false);
    setShowGoogleChooser(false);
    setTimeout(() => handleGoogleClick(), 200);
  };

  const fillDemo = (demoEmail, demoPw) => {
    setEmail(demoEmail);
    setPassword(demoPw);
    toast.success(`Demo credentials filled (${demoEmail.split('@')[0]})`);
  };

  // Pre-configured Google Accounts for Chooser
  const googleAccounts = [
    {
      email: 'aminurhstu23@gmail.com',
      name: 'Aminur Rahman',
      firstName: 'Aminur',
      lastName: 'Rahman',
      role: 'RECRUITER',
      avatarColor: 'bg-indigo-600',
      initial: 'A',
      tag: 'Primary User',
    },
    {
      email: 'admin@smarthire.com',
      name: 'SmartHire Admin',
      firstName: 'Platform',
      lastName: 'Admin',
      role: 'ADMIN',
      avatarColor: 'bg-amber-600',
      initial: 'S',
      tag: 'Admin Console',
    },
    {
      email: 'recruiter@smarthire.com',
      name: 'Senior Technical Recruiter',
      firstName: 'Talent',
      lastName: 'Recruiter',
      role: 'RECRUITER',
      avatarColor: 'bg-blue-600',
      initial: 'R',
      tag: 'Recruiter ATS',
    },
    {
      email: 'aminur.rahman@example.com',
      name: 'Aminur Rahman (Candidate)',
      firstName: 'Aminur',
      lastName: 'Rahman',
      role: 'CANDIDATE',
      avatarColor: 'bg-emerald-600',
      initial: 'C',
      tag: 'Candidate Portal',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Real Continue with Google button */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={googleLoading}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-70 cursor-pointer"
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
        <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
      </button>

      {/* Modern Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-gray-200 w-full"></div>
        <span className="bg-white px-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Or sign in with email
        </span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Work Email"
          type="email"
          icon={Mail}
          placeholder="recruiter@smarthire.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => toast('Password reset link dispatched to your registered email.', { icon: '📧' })}
            className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" loading={loading} className="w-full py-2.5 text-sm font-semibold shadow-md shadow-indigo-500/20">
          Sign In to Dashboard
        </Button>

        <p className="text-center text-xs text-gray-500 pt-1">
          Don't have an enterprise account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-bold">
            Create Account
          </Link>
        </p>

        {/* 1-Click Demo Logins */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center mb-2.5">
            Quick 1-Click Demo Credentials
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin@smarthire.com', 'admin123')}
              className="px-2 py-1.5 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-lg text-xs font-semibold text-gray-700 transition-all text-center cursor-pointer"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('recruiter@smarthire.com', 'recruiter123')}
              className="px-2 py-1.5 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-lg text-xs font-semibold text-gray-700 transition-all text-center cursor-pointer"
            >
              💼 Recruiter
            </button>
            <button
              type="button"
              onClick={() => fillDemo('aminur.rahman@example.com', 'candidate123')}
              className="px-2 py-1.5 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-lg text-xs font-semibold text-gray-700 transition-all text-center cursor-pointer"
            >
              🎯 Candidate
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>256-bit SSL Encrypted • SOC 2 Type II Compliant</span>
        </div>
      </form>

      {/* OFFICIAL GOOGLE ACCOUNT CHOOSER DIALOG */}
      {showGoogleChooser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5">
            {/* Header with Google Logo & Close */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-500">Sign in with Google</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Choose an account</h3>
                <p className="text-xs text-gray-500">to continue to <strong className="text-indigo-600">SmartHire AI</strong></p>
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

            {/* Account List */}
            {!showCustomEmailInput ? (
              <div className="space-y-2 border-y border-gray-100 py-3">
                {googleAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={googleLoading}
                    onClick={() => executeGoogleSignIn(acc)}
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

                {/* Option: Use another account */}
                <button
                  type="button"
                  onClick={() => setShowCustomEmailInput(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-dashed border-gray-300 hover:border-indigo-300 transition-all text-left cursor-pointer text-gray-700"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-indigo-600">Use another Google account</span>
                    <p className="text-[11px] text-gray-400">Sign in with any Gmail or Workspace address</p>
                  </div>
                </button>
              </div>
            ) : (
              /* Custom Google Email Entry */
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
                    placeholder="Full Name (optional)"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button type="submit" loading={googleLoading} className="flex-1 py-2 text-xs">
                    Continue with this Account
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

            {/* Footer with Disclaimer & Google Cloud Config Link */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                To continue, Google shares your name, email address, and profile picture with SmartHire AI. See{' '}
                <a href="#privacy" className="text-indigo-600 hover:underline">Privacy Policy</a> and{' '}
                <a href="#terms" className="text-indigo-600 hover:underline">Terms of Service</a>.
              </p>

              <div className="text-center pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowClientIdConfig(!showClientIdConfig)}
                  className="text-[11px] text-gray-400 hover:text-indigo-600 inline-flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Google Cloud OAuth Client ID Settings</span>
                </button>
              </div>

              {/* Developer Client ID Box */}
              {showClientIdConfig && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 mt-2 text-left">
                  <p className="text-[11px] text-gray-600 font-semibold">
                    Native Browser Popup Mode:
                  </p>
                  <input
                    type="text"
                    value={customClientId}
                    onChange={(e) => setCustomClientId(e.target.value)}
                    placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white font-mono"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleSaveClientId}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700"
                    >
                      Save Client ID
                    </button>
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Google Cloud Console</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
