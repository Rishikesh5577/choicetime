import { useState, useEffect, useRef } from 'react';
import { reelAPI } from '../utils/api';

// Individual Video Reel Component
const VideoReel = ({ reel }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current.muted = true;
          setIsMuted(true);
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Video play error:', error);
        setHasError(true);
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[190px]">
      <div className="relative rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 group">
        {/* Video Container - 9:16 aspect ratio */}
        <div className="aspect-[9/16] relative">
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
              Failed to load
            </div>
          ) : (
            <video
              ref={videoRef}
              src={reel.videoUrl}
              className="w-full h-full object-cover cursor-pointer"
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              poster={reel.thumbnailUrl || undefined}
              onClick={handlePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setHasError(true)}
            />
          )}
          
          {/* Play Button Overlay */}
          {!isPlaying && !hasError && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
              onClick={handlePlay}
            >
              <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}

          {/* Pause overlay on hover when playing */}
          {isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
              onClick={handlePlay}
            >
              <div className="w-11 h-11 rounded-full bg-black/40 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              </div>
            </div>
          )}

          {/* Mute Button */}
          {!hasError && (
            <button
              onClick={toggleMute}
              className="absolute bottom-10 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
            >
              {isMuted ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          )}

          {/* Title at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <p className="text-white text-[11px] font-medium truncate">{reel.title}</p>
          </div>
        </div>
      </div>
      
      {/* Buy Now Button */}
      {reel.productLink && (
        <a
          href={reel.productLink}
          className="block w-full mt-2 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-center text-xs font-semibold rounded-lg transition-colors tracking-wide"
        >
          Shop Now
        </a>
      )}
    </div>
  );
};

const InstagramReels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const cached = localStorage.getItem('instagramReels');
        if (cached) {
          try {
            const parsedCache = JSON.parse(cached);
            if (parsedCache?.reels?.length) {
              setReels(parsedCache.reels);
              setLoading(false);
            }
          } catch (e) {}
        }
        
        const response = await reelAPI.getReels();
        if (response.success) {
          setReels(response.data.reels || []);
          localStorage.setItem('instagramReels', JSON.stringify(response.data));
        }
      } catch (err) {
        console.error('Error fetching reels:', err);
        setError('Failed to load reels');
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="pt-2 md:pt-4 pb-10 md:pb-16 bg-[#F7F4EE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-widest">
              Trending Reels
            </h2>
            <div className="mt-2 mx-auto w-12 h-0.5 bg-gray-800 rounded-full"></div>
          </div>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-gray-300 border-t-gray-800"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || reels.length === 0) {
    return null;
  }

  return (
    <section className="pt-2 md:pt-4 pb-10 md:pb-16 bg-[#F7F4EE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-widest">
            Trending Reels
          </h2>
          <div className="mt-2 mx-auto w-12 h-0.5 bg-gray-800 rounded-full"></div>
          <p className="text-gray-500 mt-3 text-xs md:text-sm">
            Watch & shop from{' '}
            <a 
              href="https://www.instagram.com/choice_collection_kothrud" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-800 font-semibold hover:underline"
            >
              @choice_collection_kothrud
            </a>
          </p>
        </div>

        {/* Scroll Controls & Reels Container */}
        <div className="relative group/scroll">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-[40%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors -ml-1 md:-ml-4 opacity-0 group-hover/scroll:opacity-100"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Horizontal Scroll Reels */}
          <div 
            ref={scrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto pb-2 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <style>{`.scroll-smooth::-webkit-scrollbar { display: none; }`}</style>
            {reels.map((reel) => (
              <VideoReel key={reel._id} reel={reel} />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-[40%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors -mr-1 md:-mr-4 opacity-0 group-hover/scroll:opacity-100"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default InstagramReels;
