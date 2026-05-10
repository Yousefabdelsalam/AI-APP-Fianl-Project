import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineMapPin, HiOutlineStar, HiOutlineCurrencyDollar, 
  HiOutlineSun, HiOutlineCloud, HiOutlineMap, HiOutlineChatBubbleLeft
} from 'react-icons/hi2';
import { destinationsAPI, weatherAPI, reviewsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function DestinationDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [weather, setWeather] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destRes = await destinationsAPI.get(id);
        setDestination(destRes.data);
        
        // Fetch weather
        if (destRes.data.city) {
          const weatherRes = await weatherAPI.get(destRes.data.city);
          setWeather(weatherRes.data);
        }

        // Fetch reviews
        const reviewsRes = await reviewsAPI.getByDestination(id);
        setReviews(reviewsRes.data);
      } catch (err) {
        toast.error("Failed to load destination details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to post a review");
      return;
    }
    try {
      await reviewsAPI.create({
        destination_id: parseInt(id),
        rating: rating,
        comment: comment
      });
      toast.success("Review posted!");
      setComment('');
      // Refresh reviews
      const reviewsRes = await reviewsAPI.getByDestination(id);
      setReviews(reviewsRes.data);
    } catch (err) {
      toast.error("Failed to post review");
    }
  };

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!destination) return <div className="pt-24 text-center">Destination not found</div>;

  return (
    <div className="page-container pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image and Description */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img 
              src={destination.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'} 
              className="w-full h-full object-cover"
              alt={destination.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{destination.name}</h1>
              <div className="flex items-center gap-2 text-white/80">
                <HiOutlineMapPin className="w-5 h-5" />
                <span>{destination.city ? `${destination.city}, ` : ''}{destination.country}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass p-8"
          >
            <h2 className="text-2xl font-display font-bold mb-4">About the Destination</h2>
            <p className="text-white/70 leading-relaxed whitespace-pre-line">
              {destination.description}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-white/40 text-xs uppercase font-bold mb-1">Category</p>
                <p className="text-cyan-400 capitalize">{destination.category}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-white/40 text-xs uppercase font-bold mb-1">Best Season</p>
                <p className="text-gold-400">{destination.best_season}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-white/40 text-xs uppercase font-bold mb-1">Avg. Cost</p>
                <p className="text-green-400 font-bold">${destination.average_cost}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-white/40 text-xs uppercase font-bold mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <HiOutlineStar className="text-gold-400 w-4 h-4 fill-gold-400" />
                  <span className="font-bold">{destination.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Reviews & Experiences</h2>
            
            <form onSubmit={handleReviewSubmit} className="glass p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-white/60">Your Rating:</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button 
                      key={s} 
                      type="button" 
                      onClick={() => setRating(s)}
                      className={`${rating >= s ? 'text-gold-400' : 'text-white/20'} transition-colors`}
                    >
                      <HiOutlineStar className={`w-6 h-6 ${rating >= s ? 'fill-gold-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-field min-h-[100px]" 
                placeholder="Share your experience..."
                required
              />
              <button type="submit" className="btn-primary">Post Review</button>
            </form>

            <div className="space-y-4">
              {reviews.map((rev, i) => (
                <motion.div 
                  key={rev.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-6"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-cyan-400">{rev.user_name}</span>
                    <div className="flex items-center gap-1 text-gold-400">
                      <HiOutlineStar className="fill-gold-400 w-4 h-4" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-white/60">{rev.comment}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Actions and Weather */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong p-6 space-y-4 sticky top-24"
          >
            <h3 className="text-xl font-display font-bold mb-2">Plan Your Trip</h3>
            <p className="text-white/50 text-sm">Let our AI create a personalized itinerary for your visit to {destination.name}.</p>
            
            <button 
              onClick={() => navigate('/trip-planner', { state: { destination: destination } })}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <HiOutlineMap className="w-5 h-5" /> Generate Trip Plan
            </button>
            
            <button 
              onClick={() => navigate('/ai-guide', { state: { initialQuery: `Tell me more about ${destination.name}` } })}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <HiOutlineChatBubbleLeft className="w-5 h-5" /> Ask AI Guide
            </button>

            <hr className="border-white/10 my-6" />

            {weather && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold">Current Weather</h4>
                  {weather.temperature > 20 ? <HiOutlineSun className="w-8 h-8 text-gold-400" /> : <HiOutlineCloud className="w-8 h-8 text-cyan-400" />}
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-display font-bold">{Math.round(weather.temperature)}°C</span>
                  <span className="text-white/40 mb-1">{weather.description}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                  <div>
                    <p className="text-white/30 uppercase">Humidity</p>
                    <p className="font-bold">{weather.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-white/30 uppercase">Wind</p>
                    <p className="font-bold">{weather.wind_speed} km/h</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
