import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineGlobeAlt, HiOutlineSparkles, HiOutlineMap,
  HiOutlineChatBubbleLeftRight, HiOutlineCurrencyDollar,
  HiOutlinePhoto, HiOutlineMagnifyingGlass, HiOutlineStar,
  HiOutlineArrowRight
} from 'react-icons/hi2';
import { destinationsAPI } from '../api';
import DestinationCard from '../components/DestinationCard';

const features = [
  { icon: HiOutlineChatBubbleLeftRight, title: 'AI Travel Guide', desc: 'Chat with our intelligent travel assistant for personalized advice', color: 'from-cyan-400 to-blue-500' },
  { icon: HiOutlineMap, title: 'Trip Planner', desc: 'Generate detailed day-by-day itineraries powered by AI', color: 'from-purple-400 to-pink-500' },
  { icon: HiOutlineCurrencyDollar, title: 'Budget Estimator', desc: 'Get accurate cost breakdowns for any destination', color: 'from-green-400 to-emerald-500' },
  { icon: HiOutlinePhoto, title: 'Virtual Tours', desc: 'Generate AI-powered visual previews of destinations', color: 'from-orange-400 to-red-500' },
  { icon: HiOutlineSparkles, title: 'Smart Recommendations', desc: 'Discover destinations tailored to your preferences', color: 'from-gold-400 to-yellow-500' },
  { icon: HiOutlineGlobeAlt, title: 'Global Coverage', desc: 'Explore thousands of destinations worldwide', color: 'from-teal-400 to-cyan-500' },
];

const testimonials = [
  { name: 'Sarah M.', text: 'VoyageAI planned my entire Italy trip in seconds. The AI suggestions were spot-on!', rating: 5 },
  { name: 'James K.', text: 'The budget estimator saved me hundreds of dollars. Incredibly accurate and helpful.', rating: 5 },
  { name: 'Aisha R.', text: 'I love the virtual destination previews. It helped me decide where to go next!', rating: 4 },
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    destinationsAPI.list(0, 6).then(res => setDestinations(res.data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/explore?q=${searchQuery}`);
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full filter blur-[120px] animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-[150px] animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold-500 rounded-full filter blur-[100px] animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8">
              <HiOutlineSparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Powered by AI • Trusted by 50K+ travelers</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              Discover the World<br />
              <span className="gradient-text">with AI Intelligence</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10">
              Plan your dream trip with our AI-powered platform. Get personalized recommendations,
              detailed itineraries, and budget estimates in seconds.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
              <div className="glass-strong flex items-center p-2">
                <HiOutlineMagnifyingGlass className="w-5 h-5 text-white/30 ml-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where do you want to go? Try 'Paris', 'Tokyo', 'Bali'..."
                  className="flex-1 bg-transparent px-4 py-2 text-white placeholder:text-white/30 focus:outline-none"
                />
                <button type="submit" className="btn-primary !rounded-xl !px-6 !py-2.5">
                  Explore
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/planner" className="btn-primary inline-flex items-center gap-2">
                <HiOutlineMap className="w-5 h-5" /> Plan a Trip
              </Link>
              <Link to="/chat" className="btn-secondary inline-flex items-center gap-2">
                <HiOutlineChatBubbleLeftRight className="w-5 h-5" /> Chat with AI Guide
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-cyan-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              Everything You Need for <span className="gradient-text">Perfect Travel</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Our AI-powered tools make travel planning effortless, from destination discovery to budget management.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass-card p-6 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Destinations ── */}
      {destinations.length > 0 && (
        <section className="py-24 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="flex items-center justify-between mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="section-title">
                  Popular <span className="gradient-text-gold">Destinations</span>
                </h2>
                <p className="text-white/40">Explore top-rated destinations handpicked by our AI</p>
              </div>
              <Link to="/explore" className="btn-secondary inline-flex items-center gap-2 text-sm">
                View All <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.slice(0, 6).map((dest, i) => (
                <DestinationCard key={dest.id} destination={dest} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">What Travelers <span className="gradient-text">Say</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <HiOutlineStar key={j} className="w-4 h-4 text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-white/60 text-sm mb-4 italic">"{t.text}"</p>
                <p className="font-semibold text-sm text-cyan-400">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-strong p-12 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Start Your <span className="gradient-text">Journey</span>?
              </h2>
              <p className="text-white/40 mb-8 max-w-xl mx-auto">
                Join thousands of travelers who use VoyageAI to plan unforgettable trips.
              </p>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-lg !px-8 !py-4">
                Get Started Free <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
              <HiOutlineGlobeAlt className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold gradient-text">VoyageAI</span>
          </div>
          <p className="text-white/30 text-sm">© 2026 VoyageAI. All rights reserved. Powered by Groq AI.</p>
        </div>
      </footer>
    </div>
  );
}
