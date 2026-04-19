import { useEffect } from "react";

const CafeCarousel = () => {
  useEffect(() => {
    // Re-init Flowbite (important in React)
    import("flowbite");
  }, []);

  return (
    <div
      id="cafe-carousel"
      className="relative w-full z-0"
      data-carousel="slide"
    >
      {/* Carousel wrapper */}
      <div className="relative h-64 overflow-hidden md:h-[650px]">
        {/* Item 1 */}
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
            className="absolute block w-full h-full object-cover"
            alt="Coffee"
          />
        </div>

        {/* Item 2 */}
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
            className="absolute block w-full h-full object-cover"
            alt="Cafe"
          />
        </div>

        {/* Item 3 */}
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <img
            src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735"
            className="absolute block w-full h-full object-cover"
            alt="Dessert"
          />
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        <button
          type="button"
          className="w-3 h-3 rounded-full bg-white"
          data-carousel-slide-to="0"
        ></button>
        <button
          type="button"
          className="w-3 h-3 rounded-full bg-white/50"
          data-carousel-slide-to="1"
        ></button>
        <button
          type="button"
          className="w-3 h-3 rounded-full bg-white/50"
          data-carousel-slide-to="2"
        ></button>
      </div>

      {/* Prev */}
      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 group"
        data-carousel-prev
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand/50 group-hover:bg-brand text-white">
          ❮
        </span>
      </button>

      {/* Next */}
      <button
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 group"
        data-carousel-next
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand/50 group-hover:bg-brand text-white">
          ❯
        </span>
      </button>
    </div>
  );
};

export default CafeCarousel;
