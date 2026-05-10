import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineCalendarDays, HiOutlineMap } from 'react-icons/hi2';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-8 border border-white/10"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-navy-900 shadow-xl">
              {user?.full_name?.[0] || 'U'}
            </div>
          </div>
          
          <div className="flex-1 space-y-6 w-full text-center md:text-left">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                {user?.full_name || 'VoyageAI User'}
              </h1>
              <p className="text-cyan-400 flex items-center justify-center md:justify-start gap-2">
                <HiOutlineEnvelope className="w-5 h-5" />
                {user?.email || 'user@example.com'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-lg text-cyan-400">
                  <HiOutlineUser className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Account Role</p>
                  <p className="font-semibold">{user?.role === 'admin' ? 'Administrator' : 'Traveler'}</p>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                  <HiOutlineCalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Member Since</p>
                  <p className="font-semibold">2026</p>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4 md:col-span-2">
                <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
                  <HiOutlineMap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Trip Stats</p>
                  <p className="font-semibold">Ready to explore new destinations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
