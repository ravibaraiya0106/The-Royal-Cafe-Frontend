import { useState } from "react";

type Item = {
  id: number;
  name: string;
  image: string;
};

const ItemCard = ({ item }: { item: Item }) => {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-white max-w-sm border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Image */}
      <img
        className="w-full h-48 object-cover"
        src={item.image}
        alt={item.name}
      />

      {/* Content */}
      <div className="p-5 text-center">
        {/* Tag */}
        <span className="inline-flex items-center bg-brand/10 border border-brand/20 text-brand text-xs font-medium px-2 py-1 rounded-md">
          ☕ Popular
        </span>

        {/* Title */}
        <h5 className="mt-3 mb-4 text-xl font-semibold text-gray-800">
          {item.name}
        </h5>

        {/* Add to Cart */}
        {count === 0 ? (
          <button
            onClick={() => setCount(1)}
            className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 transition"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCount(count - 1)}
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              -
            </button>

            <span className="font-semibold text-lg">{count}</span>

            <button
              onClick={() => setCount(count + 1)}
              className="w-8 h-8 rounded-full bg-brand text-white hover:bg-brand/90"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
