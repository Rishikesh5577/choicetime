const faintColors = [
  'bg-rose-50 border-gray-300',
  'bg-sky-50 border-gray-300',
  'bg-amber-50 border-gray-300',
  'bg-emerald-50 border-gray-300',
  'bg-violet-50 border-gray-300',
  'bg-teal-50 border-gray-300',
  'bg-orange-50 border-gray-300',
  'bg-indigo-50 border-gray-300',
  'bg-pink-50 border-gray-300',
  'bg-cyan-50 border-gray-300',
  'bg-lime-50 border-gray-300',
  'bg-fuchsia-50 border-gray-300',
];

const topRow = [
  "Fossil", "Tissot", "Armani Exchange", "Patek Philippe", "Emporio Armani",
  "Hublot", "Cartier", "Seiko", "Rado", "Versace", "MontBlanc", "Maserati"
];

const bottomRow = [
  "Casio", "G-Shock", "Casio Edifice", "Gucci", "Tissot PRX", "Tommy Hilfiger",
  "Rolex", "Hamilton", "Longines", "CR7", "Richard Mille", "Omega"
];

const MarqueeRow = ({ items, direction = 'left' }) => {
  const animClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className="overflow-hidden relative py-2">
      <div className={`flex whitespace-nowrap w-max ${animClass}`}>
        {[...items, ...items].map((name, i) => (
          <span
            key={i}
            className={`inline-flex items-center mx-2 sm:mx-3 px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg border text-sm sm:text-base font-semibold text-gray-900 tracking-wide whitespace-nowrap transition-shadow hover:shadow-md ${faintColors[i % faintColors.length]}`}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};

const SubcategoryMarquee = () => {
  return (
    <>
      <style>
        {`
          @keyframes marqueeLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marqueeRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee-left {
            animation: marqueeLeft 50s linear infinite;
          }
          .animate-marquee-right {
            animation: marqueeRight 50s linear infinite;
          }
          .animate-marquee-left:hover,
          .animate-marquee-right:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <section className="py-6 md:py-10 bg-[#FAFAF8] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-400 mb-2">Trusted worldwide</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-widest">
              Our Brands
            </h2>
            <div className="mt-3 mx-auto w-16 h-[2px] bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Full-width marquee rows */}
        <div className="space-y-3">
          <MarqueeRow items={topRow} direction="left" />
          <MarqueeRow items={bottomRow} direction="right" />
        </div>
      </section>
    </>
  );
};

export default SubcategoryMarquee;
