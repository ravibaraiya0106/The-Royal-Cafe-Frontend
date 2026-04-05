import React from "react";
import Loader from "@/components/common/Loader";

export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
};

const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
}: Props<T>) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <div className="overflow-hidden border border-gray-200 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[640px]">
            {/* Header */}
            <thead className="bg-brand text-white">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`px-4 py-3 font-semibold ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                          ? "text-right"
                          : "text-left"
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length}>
                    <Loader text="Fetching items..." />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-8 text-gray-600"
                  >
                    No Data Found
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-brand/5 transition-colors"
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-4 py-3 text-gray-700 ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                              ? "text-right"
                              : "text-left"
                        }`}
                      >
                        {col.render
                          ? col.render(row)
                          : String(row[col.accessor] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
