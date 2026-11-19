import { ArrowUpRight, BriefcaseBusiness, Check, CircleUserRound, FileSearch2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const capabilities = [
  { icon: FileSearch2, title: 'One clear candidate pipeline', detail: 'Keep applications, decisions and interview steps together.' },
  { icon: Sparkles, title: 'Understandable skill matching', detail: 'See relevant skills and gaps alongside match scores.' },
  { icon: ShieldCheck, title: 'Role-aware workspaces', detail: 'Give recruiters, candidates and admins the right tools.' },
];

export default function LoginPage() {
  return <main className="min-h-screen bg-white lg:grid lg:grid-cols-[1.06fr_.94fr]">
    <section className="relative hidden min-h-screen overflow-hidden bg-[#143c34] px-12 py-10 text-white lg:flex lg:flex-col xl:px-[9%]">
      <div className="absolute -right-28 top-1/4 h-[470px] w-[470px] rounded-full border border-white/[.08]"/><div className="absolute -right-7 top-[32%] h-[300px] w-[300px] rounded-full border border-white/[.08]"/><div className="absolute bottom-[-180px] left-[-110px] h-[420px] w-[420px] rounded-full bg-[#b7eb68]/[.07] blur-3xl"/>
      <Link to="/login" className="relative z-10 inline-flex w-fit items-center gap-3" aria-label="SmartHire home"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d5f5a4] text-[#163d34]"><BriefcaseBusiness className="h-5 w-5"/></span><span className="font-extrabold tracking-tight">SmartHire<span className="ml-1 text-[#d5f5a4]">/</span></span></Link>
      <div className="relative z-10 my-auto max-w-xl py-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.07] px-3 py-1.5 text-xs font-semibold text-[#def6c1]"><Sparkles className="h-3.5 w-3.5"/> Recruitment, brought into focus</span>
        <h1 className="mt-7 max-w-lg text-5xl font-extrabold leading-[1.08] tracking-[-.055em] xl:text-[58px]">Make every hire a more <span className="text-[#d5f5a4]">thoughtful</span> one.</h1>
        <p className="mt-5 max-w-lg text-[15px] leading-7 text-emerald-50/70">A practical workspace for hiring teams to find talent, manage applications and bring better conversations forward.</p>
        <div className="mt-10 space-y-5">{capabilities.map(({ icon: Icon, title, detail }) => <div key={title} className="flex items-start gap-3.5"><span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.08] text-[#d5f5a4]"><Icon className="h-4 w-4"/></span><div><h2 className="text-sm font-bold">{title}</h2><p className="mt-1 text-xs leading-5 text-emerald-50/55">{detail}</p></div></div>)}</div>
      </div>
      <p className="relative z-10 text-xs text-emerald-50/45">Built for the people behind every great team.</p>
    </section>

    <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-[13%]">
      <div className="flex items-center justify-between lg:justify-end"><Link to="/login" className="inline-flex items-center gap-2 font-extrabold tracking-tight text-slate-900 lg:hidden"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#d5f5a4] text-[#163d34]"><BriefcaseBusiness className="h-4 w-4"/></span>SmartHire</Link><span className="text-xs text-slate-500">New to SmartHire? <Link className="font-bold text-emerald-800 hover:text-emerald-700" to="/register">Create account <ArrowUpRight className="inline h-3.5 w-3.5"/></Link></span></div>
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
        <div className="mb-8"><span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf7e2] text-[#47713a]"><CircleUserRound className="h-5 w-5"/></span><h2 className="mt-6 text-[32px] font-extrabold leading-tight tracking-[-.045em] text-slate-950">Welcome back</h2><p className="mt-2 text-sm leading-6 text-slate-500">Sign in to continue to your SmartHire workspace.</p></div>
        <LoginForm />
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-400"><Check className="h-3.5 w-3.5 text-emerald-700"/> Your account is protected by secure token-based sign-in</div>
      </div>
      <p className="text-center text-[11px] text-slate-400">© {new Date().getFullYear()} SmartHire · Recruitment workspace</p>
    </section>
  </main>;
}
