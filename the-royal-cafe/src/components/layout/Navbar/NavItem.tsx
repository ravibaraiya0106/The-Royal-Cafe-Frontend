import { Link } from "react-router-dom";

type Props = {
  to: string;
  label: string;
  onClick?: () => void;
};

const NavItem = ({ to, label, onClick }: Props) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-brand transition-all duration-300"
    >
      {label}
    </Link>
  );
};

export default NavItem;
