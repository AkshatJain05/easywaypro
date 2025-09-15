import { motion } from "framer-motion"; //For smooth animation

const BarVisualizer = ({
  array,
  comparisons = [],
  swaps = [],
  activeIndices = [],
  sortedIndices = [],
  pivot = null,
  algorithmName = "Sorting Visualizer",
}) => {
  if (!array || array.length === 0) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl m-4 max-w-5xl mx-auto w-full h-72 flex items-center justify-center text-gray-400 text-lg">
        No data to visualize. Please enter some numbers!
      </div>
    );
  }

  const maxVal = Math.max(...array);

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl m-4 max-w-6xl mx-auto w-full">
      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-6 text-center tracking-wide">
        {algorithmName}
      </h3>

      {/* Bars */}
      <div className="flex justify-center items-end h-80 gap-1 border-b-2 border-gray-700 pb-2 w-full overflow-x-auto p-3">
        {array.map((value, index) => {
          let barColor = "bg-blue-500"; // Default

          if (sortedIndices.includes(index)) barColor = "bg-green-500";
          else if (swaps.includes(index)) barColor = "bg-red-500";
          else if (comparisons.includes(index)) barColor = "bg-indigo-800";
          else if (activeIndices.includes(index)) barColor = "bg-yellow-500";
          else if (index === pivot) barColor = "<bg-purple-6></bg-purple-6>00";

          const heightPercentage =
            (value / (maxVal > 0 ? maxVal : 1)) * 95 + 5; // min height 5%

          return (
            <motion.div
              key={index}
              layout
              initial={{ height: 0 }}
              animate={{ height: `${heightPercentage}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`${barColor} rounded-t-md flex items-end justify-center text-xs font-bold text-white shadow-sm`}
              style={{
                width: `${100 / array.length}%`,
                minWidth: "18px",
                maxWidth: "45px",
              }}
              title={`Index: ${index}, Value: ${value}`} 
            >
              <span className="mb-1 block text-center opacity-80">{value}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-500 rounded-sm"></span> Default
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-500 rounded-sm"></span> Active
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-indigo-800 rounded-sm"></span> Comparing
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-500 rounded-sm"></span> Swapping
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-purple-600 rounded-sm"></span> Pivot
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500 rounded-sm"></span> Sorted
        </span>
      </div>
    </div>
  );
};

export default BarVisualizer;
