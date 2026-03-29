import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

const CartButton = ({ cartCount }: { cartCount: number }) => {
  return (
    <Link
      to="/cart"
      className="relative mr-3 p-2 rounded-xl hover:bg-gray-100 transition"
    >
      <FiShoppingCart className="w-6 h-6 text-gray-700 hover:text-brand" />

      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartButton;

