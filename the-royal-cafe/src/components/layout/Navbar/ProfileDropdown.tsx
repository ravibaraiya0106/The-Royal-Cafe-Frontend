type Props = {
  open: boolean;
  onClose: () => void;
};

const ProfileDropdown = ({ open, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg">
      <div className="px-4 py-3 border-b">
        <p className="text-sm font-semibold">Joseph</p>
        <p className="text-xs text-gray-500">email@test.com</p>
      </div>

      <ul className="p-2 text-sm">
        <li>
          <button
            onClick={onClose}
            className="w-full text-left p-2 hover:bg-brand hover:text-white rounded"
          >
            Dashboard
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
