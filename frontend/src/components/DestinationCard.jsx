import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineStar, HiOutlineMapPin, HiOutlineCurrencyDollar } from 'react-icons/hi2';

export default function DestinationCard({ destination, index = 0 }) {
  const [imgStatus, setImgStatus] = useState('loading'); // 'loading', 'loaded', 'error'
  
  const fallbackImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'; // High-quality travel placeholder

  const handleImageLoad = () => setImgStatus('loaded');
  const handleImageError = (e) => {
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
      setImgStatus('loaded');
    } else {
      setImgStatus('error');
    }
  };

  const imageSource = destination.image_url ? destination.image_url : fallbackImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/destination/${destination.id}`} className="group block h-full">
        <div className="glass-card overflow-hidden h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-52 overflow-hidden bg-white/5">
            {/* Skeleton Loader */}
            {imgStatus === 'loading' && (
              <div className="absolute inset-0 animate-pulse bg-white/10" />
            )}
            
            <img
              src={imageSource}
              alt={destination.name}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${imgStatus === 'loading' ? 'opacity-0' : 'opacity-100'}`}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Rating badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full z-10">
              <HiOutlineStar className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-semibold text-gold-400">{destination.rating || '4.5'}</span>
            </div>

            {/* Category badge */}
            {destination.category && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-cyan-500/20 backdrop-blur-md rounded-full border border-cyan-400/20 z-10">
                <span className="text-xs font-medium text-cyan-400 capitalize">{destination.category}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-display font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
              {destination.name}
            </h3>
            <div className="flex items-center gap-1 text-white/50 text-sm mb-3">
              <HiOutlineMapPin className="w-4 h-4" />
              <span className="truncate">{destination.city && `${destination.city}, `}{destination.country}</span>
            </div>
            <p className="text-white/40 text-sm line-clamp-2 mb-4 flex-1">
              {destination.description || 'Discover this amazing destination and create unforgettable memories.'}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
              <div className="flex items-center gap-1 text-cyan-400">
                <HiOutlineCurrencyDollar className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {destination.average_cost ? `$${destination.average_cost}` : '---'}
                </span>
                <span className="text-xs text-white/30">avg/trip</span>
              </div>
              {destination.best_season && (
                <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                  Best: {destination.best_season}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
