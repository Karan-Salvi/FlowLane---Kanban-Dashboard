import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface FilterPopoverProps {
  onClose: () => void;
  filter: { title: string };
  setFilter: (filter: { title: string }) => void;
}

export default function FilterPopover({
  onClose,
  filter,
  setFilter,
}: FilterPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleClear = () => {
    setFilter({ title: "" });
  };

  return (
    <div
      ref={popoverRef}
      className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg overflow-hidden shadow-2xl z-10"
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">Filter Tasks</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label
            htmlFor="title-filter"
            className="text-xs font-medium text-gray-600"
          >
            Search by title
          </label>
          <input
            id="title-filter"
            type="text"
            value={filter.title}
            onChange={(e) => setFilter({ ...filter, title: e.target.value })}
            placeholder="Keyword..."
            className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          onClick={handleClear}
          className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary/90 cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
