import { useEffect, useMemo, useState } from "react";

const CafeCarousel = () => {
  const slides = useMemo(
    () => [
      {
        src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
        alt: "Coffee",
      },
      {
        src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
        alt: "Cafe",
      },
      {
        src: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        alt: "Dessert",
      },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => window.clearInterval(id);
  }, [slides.length]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      id="cafe-carousel"
      className="relative w-full z-0"
    >
      {/* Carousel wrapper */}
      <div className="relative h-64 overflow-hidden md:h-[650px]">
        {slides.map((s, idx) => (
          <div
            // Only the active slide should be visible
            key={s.src}
            className={
              idx === activeIndex
                ? "block duration-700 ease-in-out"
                : "hidden duration-700 ease-in-out"
            }
          >
            <img
              src={s.src}
              className="absolute block w-full h-full object-cover"
              alt={s.alt}
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        {slides.map((s, idx) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={
              idx === activeIndex
                ? "w-3 h-3 rounded-full bg-white"
                : "w-3 h-3 rounded-full bg-white/50"
            }
          />
        ))}
      </div>

      {/* Prev */}
      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 group"
        onClick={goPrev}
        aria-label="Previous banner"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand/50 group-hover:bg-brand text-white">
          ❮
        </span>
      </button>

      {/* Next */}
      <button
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 group"
        onClick={goNext}
        aria-label="Next banner"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand/50 group-hover:bg-brand text-white">
          ❯
        </span>
      </button>
    </div>
  );
};

export default CafeCarousel;
