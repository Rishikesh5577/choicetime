import { useState, useEffect, useRef } from 'react';
import { reelAPI } from '../utils/api';

// Individual Video Reel Component - Instagram Style
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
    <div className="flex-shrink-0 w-[180px] sm:w-[200px]">
      <div className="relative rounded-xl overflow-hidden bg-gray-900 shadow-md group">
        {/* Video Container - Instagram reel aspect ratio */}
        <div className="aspect-[9/16] relative">
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs">
              Failed
            </div>
          ) : (
            <video
              ref={videoRef}
              src={reel.videoUrl}
              className="w-full h-full object-cover cursor-pointer"
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
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
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={handlePlay}
            >
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
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
              <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              </div>
            </div>
          )}

          {/* Mute Button */}
          {!hasError && (
            <button
              onClick={toggleMute}
              className="absolute bottom-10 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors z-10"
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

          {/* Instagram Reels Icon */}
          <div className="absolute top-2.5 right-2.5">
            <svg className="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
            </svg>
          </div>

          {/* Title at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-xs font-medium truncate">{reel.title}</p>
          </div>
        </div>
      </div>
      
      {/* Buy Now Button */}
      {reel.productLink && (
        <a
          href={reel.productLink}
          className="block w-full mt-2 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white text-center text-sm font-semibold rounded-lg transition-all shadow-sm"
        >
          Buy Now
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
        setLoading(true);
        const response = await reelAPI.getReels();
        if (response.success) {
          setReels(response.data.reels || []);
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
      const scrollAmount = 180;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="pt-6 md:pt-10 pb-12 md:pb-20 bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Reels
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base">Watch our latest videos</p>
          </div>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || reels.length === 0) {
    return null;
  }

  return (
    <section className="pt-6 md:pt-10 pb-12 md:pb-20 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header - Matching Shop By Category style */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Reels
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Watch our latest videos{' '}
            <a 
              href="https://www.instagram.com/choice_collection_kothrud" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 transition-colors font-medium"
            >
              @choice_collection_kothrud
            </a>
          </p>
        </div>

        {/* Scroll Controls & Reels Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors -ml-2 md:-ml-5"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Horizontal Scroll Reels */}
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reels.map((reel) => (
              <VideoReel key={reel._id} reel={reel} />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors -mr-2 md:-mr-5"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default InstagramReels;
