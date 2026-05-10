import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineGlobeAlt, HiOutlineMap, HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles, HiOutlineCurrencyDollar, HiOutlineBookmark,
  HiOutlineUserCircle, HiOutlineCog6Tooth, HiOutlineArrowRightOnRectangle,
  HiOutlineBars3, HiOutlineXMark, HiOutlineHome, HiOutlinePhoto,
} from 'react-icons/hi2';

const navLinks = [
  { to: '/', label: 'Home', icon: HiOutlineHome },
  { to: '/explore', label: 'Explore', icon: HiOutlineGlobeAlt },
  { to: '/trip-planner', label: 'Trip Planner', icon: HiOutlineMap },
  { to: '/ai-guide', label: 'AI Guide', icon: HiOutlineChatBubbleLeftRight },
  { to: '/virtual-tour', label: 'Virtual Tour', icon: HiOutlinePhoto },
  { to: '/budget', label: 'Budget', icon: HiOutlineCurrencyDollar },
];

const authLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineSparkles },
  { to: '/saved-trips', label: 'Saved Trips', icon: HiOutlineBookmark },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const allLinks = user ? [...navLinks, ...authLinks] : navLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <HiOutlineGlobeAlt className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg gradient-text hidden sm:block">
              VoyageAI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {allLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${isActive
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${isActive
                    ? 'bg-gold-500/20 text-gold-400'
                    : 'text-gold-400/60 hover:text-gold-400 hover:bg-gold-500/10'
                  }`}
              >
                <HiOutlineCog6Tooth className="w-4 h-4" />
                Admin
              </NavLink>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {user.full_name?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.full_name?.split(' ')[0]}</span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-56 glass-strong p-2 z-50"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-2">
                        <p className="text-sm font-semibold">{user.full_name}</p>
                        <p className="text-xs text-white/40">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-all">
                        <HiOutlineUserCircle className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-all">
                        <HiOutlineSparkles className="w-4 h-4" /> Dashboard
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
                        <HiOutlineArrowRightOnRectangle className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm !px-4 !py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white/60 hover:text-white">
              {mobileOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden glass-strong border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {allLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              ))}
              {user?.role === 'admin' && (
                <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gold-500/20 text-gold-400' : 'text-gold-400/80 hover:bg-gold-500/10'}`}>
                  <HiOutlineCog6Tooth className="w-5 h-5" /> Admin
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
