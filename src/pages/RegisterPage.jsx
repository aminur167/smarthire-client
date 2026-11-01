import { Briefcase } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Join SmartHire</h1>
          <p className="text-lg text-white/80">Create your account and start your recruitment journey today.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create account</h2>
          <p className="text-gray-500 text-sm mb-6">Fill in the details to get started</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
