const NewsTicker = () => {
  const marqueeContent = "★ SALE IS LIVE — UP TO 50% OFF ★ | ◆ FREE SHIPPING ON ORDERS OVER ₹999 ◆ | ● NEW ARRIVALS EVERY WEEK ● | ♦ EXTRA 10% OFF ON FIRST ORDER ♦";

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}
      </style>
      <div className="overflow-hidden bg-black text-white py-3 border-b border-gray-700">
        <div className="whitespace-nowrap w-[200%] flex animate-marquee">
          <span className="text-sm font-medium tracking-wider mx-8">{marqueeContent}</span>
          <span className="text-sm font-medium tracking-wider mx-8" aria-hidden="true">{marqueeContent}</span>
        </div>
      </div>
    </>
  );
};

export default NewsTicker;
