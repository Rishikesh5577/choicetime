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
    <div className="overflow-hidden relative py-1.5">
      <div className={`flex whitespace-nowrap w-max ${animClass}`}>
        {[...items, ...items].map((name, i) => (
          <span
            key={i}
            className="inline-flex items-center mx-1.5 sm:mx-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-md bg-white border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap shadow-sm"
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
            animation: marqueeLeft 60s linear infinite;
          }
          .animate-marquee-right {
            animation: marqueeRight 60s linear infinite;
          }
        `}
      </style>
      <section className="pt-2 md:pt-4 pb-8 md:pb-12 bg-[#F7F4EE] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-widest">
              Our Brands
            </h2>
            <div className="mt-2 mx-auto w-12 h-0.5 bg-gray-800 rounded-full"></div>
          </div>
        </div>

        {/* Full-width marquee rows */}
        <div className="space-y-1.5">
          <MarqueeRow items={topRow} direction="left" />
          <MarqueeRow items={bottomRow} direction="right" />
        </div>
      </section>
    </>
  );
};

export default SubcategoryMarquee;
