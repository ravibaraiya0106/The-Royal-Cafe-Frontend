import { CircularProgress } from "@mui/material";

type Props = {
  size?: number;
  text?: string;
};

const Loader = ({ size = 30, text = "Loading..." }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-2">
      <CircularProgress size={size} sx={{ color: "#6b0f0f" }} />
      <span className="text-sm text-gray-500">{text}</span>
    </div>
  );
};

export default Loader;
