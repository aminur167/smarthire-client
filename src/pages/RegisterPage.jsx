import { Briefcase, Sparkles, ShieldCheck, CheckCircle2, Award, Zap } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left: Enterprise Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-white max-w-lg relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-indigo-300 backdrop-blur-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Instant Enterprise Setup</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Scale Your Hiring with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">SmartHire</span>
            </h1>
            <p className="text-base text-indigo-200/80 mt-3 leading-relaxed">
              Join thousands of hiring managers and candidates automating talent pipelines with state-of-the-art AI.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: Zap, title: '90% Faster Screening', desc: 'Instant CV parsing and automated candidate scoring.' },
              { icon: Award, title: 'AI-Powered Matching', desc: 'Weighted semantic comparison across tech stacks.' },
              { icon: ShieldCheck, title: 'Enterprise Role Security', desc: 'Dedicated candidate and recruiter portals.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{title}</h4>
                  <p className="text-xs text-indigo-200/70">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-indigo-300/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No credit card required • Instant 1-click Google login available</span>
          </div>
        </div>
      </div>

      {/* Right: Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100">
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
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create an account</h2>
            <p className="text-xs text-gray-500 mt-1">Get started with SmartHire AI applicant tracking today</p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
