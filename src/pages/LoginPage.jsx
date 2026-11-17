import { Briefcase, Sparkles, ShieldCheck, CheckCircle2, Users, Bot } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left: Enterprise Brand Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 items-center justify-center p-12 relative overflow-hidden">
        {/* Glow decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-white max-w-lg relative z-10 space-y-8">
          {/* Logo & Headline */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-indigo-300 backdrop-blur-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Next-Gen Talent Acquisition Suite</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              SmartHire <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">AI</span>
            </h1>
            <p className="text-base text-indigo-200/80 mt-3 leading-relaxed">
              AI-Powered Recruitment Management System engineered for high-velocity hiring teams and elite engineering talent.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 mb-2">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">AI Resume Matcher</h3>
              <p className="text-xs text-indigo-200/70">NLP parsing & candidate scoring engine</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 mb-2">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Talent Pipelines</h3>
              <p className="text-xs text-indigo-200/70">Multi-stage applicant tracking & kanban</p>
            </div>
          </div>

          {/* Social Proof / Trust banner */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-indigo-900">AR</div>
                <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-indigo-900">HR</div>
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-indigo-900">JD</div>
              </div>
              <p className="text-xs text-indigo-200 font-medium pl-1">Trusted by 500+ Hiring Managers</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 99.9% Uptime
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100">
          {/* Mobile Brand */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-gray-900 leading-none">SmartHire</h1>
              <p className="text-[10px] text-gray-400 leading-none mt-1">Enterprise ATS Platform</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-xs text-gray-500 mt-1">Sign in with your enterprise credentials to access the ATS workspace</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
