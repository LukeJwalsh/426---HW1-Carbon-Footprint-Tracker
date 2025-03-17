import React from "react";

interface ActivityFiltersProps {
  filterCategory: string;
  setFilterCategory: React.Dispatch<React.SetStateAction<string>>;
  sortCriteria: string;
  setSortCriteria: React.Dispatch<React.SetStateAction<string>>;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  filterCategory,
  setFilterCategory,
  sortCriteria,
  setSortCriteria,
}) => {
  return (
    <div className="filters flex flex-wrap gap-4 mb-4 items-center text-sm">
      {/* Filter by Category */}
      <div className="flex items-center space-x-2">
        <label htmlFor="filterCategory" className="font-semibold">
          Filter by Category:
        </label>
        <select
          id="filterCategory"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm
                     focus:outline-none focus:ring-1 focus:ring-blue-400
                     bg-white"
        >
          <option value="All">All</option>
          <option value="Driving">Driving (miles)</option>
          <option value="Flying">Flying (hrs)</option>
          <option value="Bus">Bus (miles)</option>
          <option value="Recycling">Recycling (lbs)</option>
        </select>
      </div>

      {/* Sort Criteria */}
      <div className="flex items-center space-x-2">
        <label htmlFor="sortCriteria" className="font-semibold">
          Sort by:
        </label>
        <select
          id="sortCriteria"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm
                     focus:outline-none focus:ring-1 focus:ring-blue-400
                     bg-white"
        >
          <option value="DateAsc">Date (Ascending)</option>
          <option value="DateDesc">Date (Descending)</option>
          <option value="CarbonAsc">Carbon Impact (Low to High)</option>
          <option value="CarbonDesc">Carbon Impact (High to Low)</option>
        </select>
      </div>
    </div>
  );
};

export default ActivityFilters;