import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';

export default function RegisterForm() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', role: 'CANDIDATE', password: '', password_confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const errors = err.response?.data;
      if (errors) Object.values(errors).flat().forEach((m) => toast.error(typeof m === 'string' ? m : JSON.stringify(m)));
      else toast.error('Registration failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="First Name" icon={User} name="first_name" placeholder="Aminur" value={form.first_name} onChange={handleChange} required />
        <Input label="Last Name" icon={User} name="last_name" placeholder="Rahman" value={form.last_name} onChange={handleChange} required />
      </div>
      <Input label="Email" type="email" icon={Mail} name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
      <Input label="Phone" icon={Phone} name="phone" placeholder="+880 1700 000000" value={form.phone} onChange={handleChange} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
        <select name="role" value={form.role} onChange={handleChange} className="input-field">
          <option value="CANDIDATE">Candidate</option>
          <option value="RECRUITER">Recruiter</option>
        </select>
      </div>

      <Input label="Password" type="password" icon={Lock} name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
      <Input label="Confirm Password" type="password" icon={Lock} name="password_confirm" placeholder="••••••••" value={form.password_confirm} onChange={handleChange} required />

      <Button type="submit" loading={loading} className="w-full">Create Account</Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign In</Link>
      </p>
    </form>
  );
}
