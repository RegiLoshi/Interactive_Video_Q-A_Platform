import { CiSearch, CiFilter } from "react-icons/ci";
import PopularQuestions from "../questions/QuestionCarousel.jsx";
import { useState, useRef, useEffect } from "react";
import CATEGORY_OPTIONS from "../../data/Categories.js";

const ExplorePage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="w-full flex flex-col justify-center items-center p-4">
      <div className="flex justify-center items-center w-full space-x-6 flex-wrap">
        <div className="relative flex items-center w-[50%] min-w-[280px]">
          <CiSearch className="absolute left-3 text-xl"/>
          <input
            type="text"
            className="w-full py-4 pl-10 pr-4 border shadow-md rounded-md"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            className="p-4 blue-button rounded-md flex items-center justify-between gap-2 shadow-sm hover:bg-blue-100 transition-colors"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <CiFilter className="text-xl" />
            <span className="truncate max-w-[100px]">{filter || "Filter"}</span>
          </button>
          
          {filterOpen && (
            <div className="absolute z-10 mt-1 w-48 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto" style={{ right: 0, maxWidth: "calc(100vw - 2rem)" }}>
              {CATEGORY_OPTIONS.map(category => (
                <div
                  key={category.value}
                  className="p-3 blue-button hover:bg-blue-50 cursor-pointer border-b last:border-b-0 text-gray-700 font-medium truncate"
                  onClick={() => {
                    if(category.label == "No Filter"){
                        setFilter("");
                    }else{
                    setFilter(category.label);
                    }
                    setFilterOpen(false);
                  }}
                >
                  {category.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <section className="mt-8 w-full">
        {!search && !filter && (
          <div className="space-y-8">
            <PopularQuestions text={"Trending Questions"} />
            <PopularQuestions text={"Recommended for you"} />
            <PopularQuestions text={"Featured Questions"} />
          </div>
        )}
        {(search || filter) && (
          <PopularQuestions text={"Based on your search.."} search={search} filter={filter} />
        )}
      </section>
    </main>
  );
};

export default ExplorePage;