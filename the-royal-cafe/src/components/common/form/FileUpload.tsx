import { FiUpload } from "react-icons/fi";

type Props = {
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FileUpload = ({ file, onChange }: Props) => {
  return (
    <div className="mt-4">
      <label className="w-full flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:border-brand transition">
        <div className="flex items-center gap-2 text-gray-600">
          <FiUpload size={18} />
          <span className="text-sm">{file ? file.name : "Upload Image"}</span>
        </div>

        <span className="text-xs text-gray-400">Browse</span>

        <input type="file" onChange={onChange} className="hidden" />
      </label>
    </div>
  );
};

export default FileUpload;
