import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6 bg-white rounded-[5px] shadow-sm border border-gray-200 p-1 px-4">
      {/* LEFT INFO */}
      <div className="text-sm text-gray-500">
        Page <span className="font-semibold text-brand">{page}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center gap-2">
        {/* PREV */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`p-2 rounded-lg border ${
            page === 1
              ? "text-gray-300 border-gray-200 cursor-not-allowed"
              : "hover:bg-brand hover:text-white border-gray-300"
          }`}
        >
          <FiChevronLeft />
        </button>

        {/* PAGE NUMBERS */}
        {generatePages().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              page === p
                ? "bg-brand text-white shadow-sm"
                : "text-gray-600 hover:bg-brand/10"
            }`}
          >
            {p}
          </button>
        ))}

        {/* NEXT */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`p-2 rounded-lg border ${
            page === totalPages
              ? "text-gray-300 border-gray-200 cursor-not-allowed"
              : "hover:bg-brand hover:text-white border-gray-300"
          }`}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
