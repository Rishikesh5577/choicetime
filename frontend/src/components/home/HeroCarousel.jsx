import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const IconChevronLeft = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconChevronRight = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const carouselSlides = [
  { image: 'https://res.cloudinary.com/daxdjob49/image/upload/v1770665113/Pink_Red_Minimalist_Feminine_Gift_Box_Sale_Promotion_Banner_1920_x_600_px_ejjeop.svg', mobileImage: 'https://res.cloudinary.com/daxdjob49/image/upload/v1770666099/Happy_Valentine_s_Day_840_x_831_px_e0nmgg.svg', link: '/' },
  { image: 'https://res.cloudinary.com/daxdjob49/image/upload/v1770662993/16f64e10-e31c-49b7-b6d0-5b23b7f3a6d9.png', mobileImage: 'https://res.cloudinary.com/daxdjob49/image/upload/v1770663972/343fc93f-3a67-493a-8411-a783328b7fb5.png', link: '/' },
  { image: 'https://res.cloudinary.com/daxdjob49/image/upload/v1770661687/8f9ef7e9-6eef-43fa-b8e0-91fa2284ec27.png', mobileImage: 'https://res.cloudinary.com/daxdjob49/image/upload/v1770669467/Grey_and_Black_Elegant_Mens_Watch_Poster_840_x_831_px_1_pp7gy6.svg', link: '/' },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);
  const intervalRef = useRef(null);

  const resetAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
  }, []);

  useEffect(() => {
    resetAutoPlay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetAutoPlay]);

  const nextSlide = () => { setCurrentSlide((prev) => (prev + 1) % carouselSlides.length); resetAutoPlay(); };
  const prevSlide = () => { setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length); resetAutoPlay(); };
  const goToSlide = (index) => { setCurrentSlide(index); resetAutoPlay(); };

  // Touch / Swipe handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = false;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    const diff = Math.abs(touchStartX.current - touchEndX.current);
    if (diff > 10) isSwiping.current = true;
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - touchEndX.current;
    const MIN_SWIPE = 50;
    if (Math.abs(diff) > MIN_SWIPE) {
      if (diff > 0) nextSlide();   // swipe left → next
      else prevSlide();             // swipe right → prev
      // Prevent the Link navigation when swiping
      if (isSwiping.current) e.preventDefault();
    }
  };

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Desktop Carousel */}
      <div className="hidden md:block relative w-full">
        <div className="relative w-full">
          {carouselSlides.map((slide, index) => (
            <Link
              to={slide.link}
              key={index}
              className={`${index === 0 ? 'relative block' : 'absolute inset-0'} transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              <img
                src={slide.image}
                alt="Banner"
                className="w-full h-auto object-contain"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
              />
            </Link>
          ))}
        </div>
        {/* Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow-lg transition opacity-0 group-hover:opacity-100 transform hover:scale-110">
          <IconChevronLeft />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow-lg transition opacity-0 group-hover:opacity-100 transform hover:scale-110">
          <IconChevronRight />
        </button>
        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${index === currentSlide ? 'w-8 bg-gray-800' : 'w-2 bg-gray-400 hover:bg-gray-600'}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile Banner */}
      <div
        className="block md:hidden relative w-full overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full">
          {carouselSlides.map((slide, index) => (
            <Link
              to={slide.link}
              key={index}
              onClick={(e) => { if (isSwiping.current) e.preventDefault(); }}
              className={`${index === 0 ? 'relative' : 'absolute inset-0'} transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img
                src={slide.mobileImage || slide.image}
                alt="Banner"
                className="w-full h-auto object-cover block select-none"
                draggable={false}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
              />
            </Link>
          ))}
        </div>
        {/* Mobile Indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${index === currentSlide ? 'w-6 bg-gray-800' : 'w-2 bg-gray-400 hover:bg-gray-600'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
