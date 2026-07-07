import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs, type UserRole } from '../context/JobContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useJobs();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('pencari-kerja');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await register(name, email, password, role, companyName || undefined);
      if (role === 'perusahaan') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      alert(err.message || 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg-light px-4 py-8">
      <div className="bg-white rounded-xl border border-brand-border p-8 w-full max-w-md shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-7 h-7 bg-brand-lime rounded-md"></div>
            <span className="text-2xl font-bold text-brand-dark">Kerjago</span>
        </div>

        <h2 className="text-xl font-bold text-brand-dark text-center mb-1">Create Account</h2>
<p className="text-gray-500 text-sm text-center mb-6">Join Kerjago and find your dream job</p>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              role === 'pencari-kerja' ? 'bg-white shadow-sm text-brand-dark' : 'text-gray-500'
            }`}
            onClick={() => setRole('pencari-kerja')}
          >
            Pencari Kerja
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              role === 'perusahaan' ? 'bg-white shadow-sm text-brand-dark' : 'text-gray-500'
            }`}
            onClick={() => setRole('perusahaan')}
          >
            Perusahaan (Admin)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block font-medium">Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {role === 'perusahaan' && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Company Name</label>
              <input
                type="text"
                placeholder="Your company name"
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 mb-1 block font-medium">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block font-medium">Password</label>
            <input
              type="password"
              placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
              className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-brand-lime text-brand-dark font-semibold py-3 rounded-full text-sm hover:opacity-90 transition-opacity mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-dark font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
