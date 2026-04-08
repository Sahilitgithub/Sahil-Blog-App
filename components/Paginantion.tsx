"use client";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginantionCom: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {

  return (
    <div className=" items-center gap-3 bg-black inline-flex p-1 rounded-md">
      {/* Previous Page button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border text-white disabled:opacity-50 rounded-md"
      >
        Prev
      </button>
      {/* Show number of post page */}
      <span className="text-white">
        Page {currentPage} of {totalPages}
      </span>
      {/* Next Page button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border text-white disabled:opacity-50 rounded-md"
      >
        Next
      </button>
    </div>
  );
};

export default PaginantionCom;
