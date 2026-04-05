import { FiPlus } from "react-icons/fi";

type Props = {
  onClick: () => void;
};

const AddButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 flex items-center justify-center
        rounded-full text-white shadow-lg
        bg-[linear-gradient(135deg,#6b0f0f,#8b1a1a)]
        hover:scale-110 transition
      "
    >
      <FiPlus size={26} />
    </button>
  );
};

export default AddButton;
