import { Link } from 'react-router-dom';
import { useJobs } from '../../context/JobContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { auth, profile, logout } = useJobs();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const roleLabel = auth?.role === 'perusahaan' ? 'Perusahaan' : 'Pencari Kerja';

  // Navigasi berbeda untuk perusahaan vs pencari kerja
  const navLinks = auth?.role === 'perusahaan'
    ? ['Home', 'Find Candidates', 'Career Notes']
    : ['Home', 'Find Jobs', 'Job Alerts', 'SPK Rekomendasi', 'Career Notes'];

  return (
    <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-brand-lime rounded-md"></div>
        <span className="text-2xl font-bold text-brand-dark">Kerjago</span>
      </Link>

      {/* Nav Links — underline hover */}
      <div className="hidden md:flex items-center gap-8 text-gray-500 font-medium text-sm">
        {navLinks.map((label) => (
          <Link
            key={label}
            to={label === 'Home' ? '/' : label === 'SPK Rekomendasi' ? '/spk-rekomendasi' : '/' + label.toLowerCase().replace(/\s+/g, '-')}
            className="relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-lime-500 after:transition-all after:duration-300 hover:text-brand-dark transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {auth ? (
          <div ref={dropdownRef} className="relative">
            {/* Avatar Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={auth.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-tr from-lime-500 to-emerald-600 text-white font-semibold flex items-center justify-center text-sm">
                  {getInitials(auth.name)}
                </div>
              )}
            </button>

            {/* Dropdown Menu — flat minimal */}
            {isOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-1.5"
                style={{ animation: 'scaleInFade 0.15s ease-out' }}
              >
                {/* Header */}
                <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                  <p className="font-semibold text-gray-800 text-sm truncate">{auth.name}</p>
                  <p className="text-gray-400 text-xs truncate mt-0.5">
                    {auth.email} &middot; {roleLabel}
                  </p>
                </div>

                {/* Menu Item: Profil Saya */}
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profil Saya
                </Link>

                {/* Menu Item: Dashboard (khusus perusahaan) */}
                {auth.role === 'perusahaan' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                )}

                {/* Divider + Logout */}
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-brand-dark transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-brand-lime text-brand-dark font-semibold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              Register Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
