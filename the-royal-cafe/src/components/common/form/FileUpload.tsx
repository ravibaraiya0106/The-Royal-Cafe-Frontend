import { FiUpload } from "react-icons/fi";

type Props = {
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

const FileUpload = ({ file, onChange, error }: Props) => {
  return (
    <div className="mt-4">
      <label className="w-full flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:border-brand transition">
        <div className="flex items-center gap-2 text-gray-600">
          <FiUpload size={18} />
          <span className="text-sm">{file ? file.name : "Upload Image"}</span>
        </div>

        <span className="text-xs text-gray-400">Browse</span>

        <input
          type="file"
          accept="image/*" // restrict to images
          onChange={onChange}
          className="hidden"
        />
      </label>

      {/* Error */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {/* Preview */}
      {file && (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="mt-2 w-20 h-20 object-cover rounded-lg border"
        />
      )}
    </div>
  );
};

export default FileUpload;
