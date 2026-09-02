export const getImageUrl = (image?: string | null): string => {
  if (!image) return "/default.jpg";

  const trimmed = image.trim();

  // Return direct links (http/https), base64 data URLs, or blob URLs as-is
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Prepend backend base URL for relative upload paths
  const baseUrl = (import.meta.env.VITE_FILE_URL || "http://localhost:5000").replace(/\/+$/, "");
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  return `${baseUrl}${cleanPath}`;
};
