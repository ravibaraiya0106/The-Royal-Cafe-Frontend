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
      className="block py-2 px-3 rounded-lg text-gray-700 hover:text-white hover:bg-brand md:p-0"
    >
      {label}
    </Link>
  );
};

export default NavItem;
