import { useState } from "react";
import SpecialBadge from "../common/badge/SpecialBadge";
import Badge from "../common/badge/Badge";
import { FiLayers, FiMinus, FiPlus } from "react-icons/fi";
import { PrimaryButton, RoundButton } from "../common/form/Button";

type Item = {
  id: number;
  name: string;
  description?: string;
  image: string;
  is_special?: boolean;
  category?: { id: number; name: string } | string;
};

const ItemCard = ({ item }: { item: Item }) => {
  const [count, setCount] = useState(0);

  const categoryName =
    typeof item.category === "string" ? item.category : item.category?.name;

  return (
    <div className="bg-white max-w-sm border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
      {/* IMAGE */}
      <img
        className="w-full h-48 object-cover"
        src={item.image}
        alt={item.name}
      />

      {/* CONTENT */}
      <div className="p-5 text-center">
        {/* CATEGORY BADGE */}
        {categoryName && (
          <div className="flex justify-center mb-2">
            <Badge
              label={categoryName}
              icon={<FiLayers size={12} />}
              variant="primary"
            />
          </div>
        )}

        {/* SPECIAL BADGE */}
        <div className="flex justify-center mb-2">
          <SpecialBadge isSpecial={item.is_special} size="md" />
        </div>

        {/* TITLE */}
        <h5 className="mt-2 mb-3 text-xl font-semibold text-gray-800">
          {item.name}
        </h5>

        {/* DESCRIPTION */}
        {item.description && (
          <p className="text-gray-600 mb-4 text-sm line-clamp-2">
            {item.description}
          </p>
        )}

        {/* CART */}
        {/* CART */}
        {count === 0 ? (
          <PrimaryButton
            label="Add to Cart"
            fullWidth={false}
            onClick={() => setCount(1)}
          />
        ) : (
          <div className="flex items-center justify-center gap-4">
            <RoundButton
              icon={<FiMinus size={16} />}
              variant="secondary"
              onClick={() => setCount(count - 1)}
            />

            <span className="font-semibold text-lg">{count}</span>

            <RoundButton
              icon={<FiPlus size={16} />}
              variant="primary"
              onClick={() => setCount(count + 1)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
