import { Link } from 'react-router-dom';

const DESKTOP_BANNER =
  'https://res.cloudinary.com/dzd47mpdo/image/upload/v1774793598/green_and_yellow_modern_watch_banner_1920_x_600_px_ivfzej.png';

const MOBILE_BANNER =
  'https://res.cloudinary.com/dzd47mpdo/image/upload/v1774794124/green_and_yellow_modern_watch_retractable_banner_600_x_600_px_bowqhd.png';

const HeroCarousel = () => (
  <div className="relative w-full overflow-hidden">
    <div className="hidden md:block relative w-full">
      <Link to="/" className="block">
        <img
          src={DESKTOP_BANNER}
          alt="Banner"
          className="w-full h-auto object-contain"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </Link>
    </div>

    <div className="block md:hidden relative w-full">
      <Link to="/" className="block">
        <img
          src={MOBILE_BANNER}
          alt="Banner"
          className="w-full h-auto object-cover block select-none"
          draggable={false}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </Link>
    </div>
  </div>
);

export default HeroCarousel;
