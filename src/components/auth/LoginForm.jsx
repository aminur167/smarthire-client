import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('aminurhstu23@gmail.com');
  const [googleName, setGoogleName] = useState('Aminur Rahman');

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

  const handleGoogleSubmit = async (e) => {
    if (e) e.preventDefault();
    setGoogleLoading(true);
    try {
      const parts = googleName.trim().split(' ');
      const firstName = parts[0] || 'Google';
      const lastName = parts.slice(1).join(' ') || 'User';

      await loginWithGoogle({
        email: googleEmail,
        first_name: firstName,
        last_name: lastName,
        role: 'RECRUITER',
      });
      toast.success(`Signed in as ${googleEmail} via Google`);
      setShowGoogleModal(false);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPw) => {
    setEmail(demoEmail);
    setPassword(demoPw);
    toast.success(`Demo credentials filled (${demoEmail.split('@')[0]})`);
  };

  return (
    <div className="space-y-5">
      {/* Continue with Google button */}
      <button
        type="button"
        onClick={() => setShowGoogleModal(true)}
        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <svg className="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Modern Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-gray-200 w-full"></div>
        <span className="bg-gray-50 px-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">
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
            onClick={() => toast('Password reset link has been dispatched to your email.', { icon: '📧' })}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
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
        <div className="border-t border-gray-200/80 pt-4 mt-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center mb-2.5">
            Quick 1-Click Demo Credentials
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin@smarthire.com', 'admin123')}
              className="px-2 py-1.5 bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-lg text-xs font-semibold text-gray-700 transition-all text-center shadow-2xs"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('recruiter@smarthire.com', 'recruiter123')}
              className="px-2 py-1.5 bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-lg text-xs font-semibold text-gray-700 transition-all text-center shadow-2xs"
            >
              💼 Recruiter
            </button>
            <button
              type="button"
              onClick={() => fillDemo('aminur.rahman@example.com', 'candidate123')}
              className="px-2 py-1.5 bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-lg text-xs font-semibold text-gray-700 transition-all text-center shadow-2xs"
            >
              🎯 Candidate
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>256-bit SSL Encrypted • SOC 2 Compliant ATS</span>
        </div>
      </form>

      {/* Google OAuth Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Sign in with Google</h3>
                <p className="text-xs text-gray-400">Choose your Google account</p>
              </div>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-3">
              <div
                onClick={handleGoogleSubmit}
                className="flex items-center gap-3 p-3 rounded-xl border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 cursor-pointer transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  AR
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{googleName}</p>
                  <p className="text-[11px] text-gray-500 truncate">{googleEmail}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Or enter another Google email
                </label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="name@gmail.com"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button type="submit" loading={googleLoading} className="flex-1 py-2 text-xs">
                  Continue with this Account
                </Button>
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
