import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
        const currentY = window.pageYOffset;
        const scrollingDown = currentY > lastY;

        if (scrollingDown) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }

        setLastY(currentY);

        if (scrollTimeout) clearTimeout(scrollTimeout);
        const timeoutId = setTimeout(() => setIsHidden(false), 200);
        setScrollTimeout(timeoutId);
      };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [lastY, scrollTimeout]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 hover:scale-110
            ${isHidden ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'}
          `}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default BackToTop;

