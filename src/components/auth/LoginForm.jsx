import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail, TriangleAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const DEMO_ACCOUNTS = [
  { role: 'Recruiter', email: 'recruiter@smarthire.com', password: 'recruiter123' },
  { role: 'Candidate', email: 'aminur.rahman@example.com', password: 'candidate123' },
  { role: 'Admin', email: 'admin@smarthire.com', password: 'admin123' },
];

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      const detail = requestError.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'We could not sign you in. Check your email and password, then try again.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="space-y-6">
    <form onSubmit={handleSubmit} className="space-y-5">
      <div><label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-700">Work email</label><div className="relative"><Mail aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input id="login-email" name="email" type="email" autoComplete="username" inputMode="email" autoCapitalize="none" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="input-field h-12 pl-10" required/></div></div>
      <div><div className="mb-2 flex items-center justify-between"><label htmlFor="login-password" className="block text-sm font-semibold text-slate-700">Password</label><span className="text-[11px] text-slate-400">Use your account password</span></div><div className="relative"><LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} className="input-field h-12 pl-10 pr-12" required/><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-100">{showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button></div></div>
      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-5 text-rose-800"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0"/>{error}</div>}
      <Button type="submit" loading={loading} className="h-12 w-full rounded-xl bg-[#176b50] text-sm font-bold shadow-sm hover:bg-[#12563f] focus:ring-emerald-100">{loading ? 'Signing in…' : 'Sign in to SmartHire'}</Button>
      <p className="text-center text-sm text-slate-500">No account yet? <Link to="/register" className="font-bold text-emerald-800 hover:text-emerald-700">Create your account</Link></p>
    </form>

    <details className="group rounded-2xl border border-slate-200 bg-slate-50/70 open:bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-4 py-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"><span><span className="block text-sm font-bold text-slate-800">Explore the demo workspace</span><span className="mt-0.5 block text-xs text-slate-500">Choose a role and sign in with a sample account</span></span><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-slate-500 shadow-sm transition group-open:rotate-180">⌄</span></summary>
      <div className="space-y-2 px-3 pb-3">{DEMO_ACCOUNTS.map((account) => <button key={account.role} type="button" onClick={() => { setEmail(account.email); setPassword(account.password); setError(''); }} className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white px-3.5 py-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-100"><span><span className="block text-xs font-bold text-slate-800">{account.role} workspace</span><span className="mt-0.5 block text-[11px] text-slate-500">{account.email}</span></span><span className="text-xs font-bold text-emerald-800">Use demo</span></button>)}</div>
      <p className="px-4 pb-3 text-[10px] leading-4 text-slate-400">Local demo accounts are intended for development and portfolio walkthroughs.</p>
    </details>
  </div>;
}
