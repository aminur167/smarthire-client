import { Briefcase } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left: Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">SmartHire</h1>
          <p className="text-lg text-white/80 mb-6">AI-Powered Recruitment Management System</p>
          <div className="space-y-3 text-left bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            {['AI Resume Matching', 'Smart Candidate Ranking', 'Automated Interview Scheduling', 'Real-time Analytics Dashboard'].map((f) => (
              <p key={f} className="text-sm text-white/90 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-400 rounded-full" />{f}</p>
            ))}
          </div>
        </div>
      </div>
      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><Briefcase className="w-5 h-5 text-white" /></div>
            <h1 className="text-xl font-bold text-gray-800">SmartHire</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
