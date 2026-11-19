import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, Mail, TriangleAlert, UserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const fields = [
  { name: 'first_name', label: 'First name', placeholder: 'Alex', autoComplete: 'given-name' },
  { name: 'last_name', label: 'Last name', placeholder: 'Morgan', autoComplete: 'family-name' },
];

export default function RegisterForm() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', role: 'CANDIDATE', password: '', password_confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (form.password !== form.password_confirm) { setError('Your passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Choose a password with at least 8 characters.'); return; }
    setLoading(true);
    try { await register(form); navigate('/dashboard', { replace: true }); }
    catch (requestError) {
      const errors = requestError.response?.data;
      const first = errors && Object.values(errors).flat().find((value) => typeof value === 'string');
      setError(first || 'We could not create your account. Please check the details and try again.');
    } finally { setLoading(false); }
  };

  return <form onSubmit={submit} className="space-y-4">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{fields.map(({ name, label, placeholder, autoComplete }) => <div key={name}><label htmlFor={name} className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</label><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input id={name} name={name} autoComplete={autoComplete} value={form[name]} onChange={change} placeholder={placeholder} required className="input-field h-11 pl-9"/></div></div>)}</div>
    <div><label htmlFor="register-email" className="mb-1.5 block text-xs font-semibold text-slate-700">Email address</label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input id="register-email" name="email" type="email" autoComplete="email" value={form.email} onChange={change} placeholder="you@company.com" required className="input-field h-11 pl-9"/></div></div>
    <div><label htmlFor="register-phone" className="mb-1.5 block text-xs font-semibold text-slate-700">Phone <span className="font-normal text-slate-400">(optional)</span></label><input id="register-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={change} placeholder="+880 1XXX-XXXXXX" className="input-field h-11"/></div>
    <div><label htmlFor="register-role" className="mb-1.5 block text-xs font-semibold text-slate-700">I’m joining as</label><div className="relative"><BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><select id="register-role" name="role" value={form.role} onChange={change} className="input-field h-11 appearance-none pl-9"><option value="CANDIDATE">Candidate · I’m looking for a role</option><option value="RECRUITER">Recruiter · I’m hiring talent</option></select></div></div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><div><label htmlFor="register-password" className="mb-1.5 block text-xs font-semibold text-slate-700">Password</label><input id="register-password" name="password" type="password" autoComplete="new-password" minLength={8} value={form.password} onChange={change} placeholder="At least 8 characters" required className="input-field h-11"/></div><div><label htmlFor="register-confirm" className="mb-1.5 block text-xs font-semibold text-slate-700">Confirm password</label><input id="register-confirm" name="password_confirm" type="password" autoComplete="new-password" minLength={8} value={form.password_confirm} onChange={change} placeholder="Re-enter password" required className="input-field h-11"/></div></div>
    {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-800"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0"/>{error}</div>}
    <Button type="submit" loading={loading} className="h-11 w-full rounded-xl bg-[#176b50] text-sm font-bold shadow-sm hover:bg-[#12563f]">{loading ? 'Creating your account…' : 'Create account'}</Button>
    <p className="text-center text-xs text-slate-500">Already have an account? <Link to="/login" className="font-bold text-emerald-800 hover:text-emerald-700">Sign in</Link></p>
  </form>;
}
