import React from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  handlePage,
  totalUsers,
  selectedRows,
}) => {
  return (
    <div className="w-full justify-between p-4 flex gap-2 flex-col sm:flex-row">
      <div className="text-sm text-gray-600">
        {selectedRows} of {totalUsers} row(s) selected.
      </div>
      <div className="flex gap-2 flex-col sm:flex-row">
        {totalPages >= 1 && (
          <div className="text-sm flex items-center">
            Page {currentPage} of {totalPages}
          </div>
        )}
        <div className="flex justify-center items-center gap-2">
          <button
            className={`first-page text-sm bg-gray-200 p-2 flex justify-center items-center border ${
              currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handlePage(1)}
          >
            First Page
          </button>
          <button
            className={`previous-page w-[30px] h-[30px] bg-gray-200 p-2 flex justify-center items-center border ${
              currentPage - 1 < 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handlePage(currentPage - 1)}
            disabled={currentPage - 1 < 1}
          >
            <FaAngleLeft />
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            return (
              <button
                key={index + 1}
                className={`${
                  index + 1
                }-page w-[30px] h-[30px] bg-gray-200 p-2 cursor-pointer flex justify-center items-center border ${
                  currentPage === index + 1 ? "text-red-500" : ""
                }`}
                onClick={() => handlePage(index + 1)}
              >
                {index + 1}
              </button>
            );
          })}

          <button
            className={`w-[30px] h-[30px] bg-gray-200 p-2 flex justify-center items-center border ${
              currentPage + 1 > totalPages
                ? "next-page opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => handlePage(currentPage + 1)}
            disabled={currentPage + 1 > totalPages}
          >
            <FaAngleRight />
          </button>
          <button
            className={`last-page bg-gray-200 text-sm p-2 flex justify-center items-center border ${
              currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handlePage(totalPages)}
          >
            Last Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
