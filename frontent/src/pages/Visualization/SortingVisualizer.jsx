import { useState, useEffect } from 'react';

const SortingVisualizer = ({ data, algorithmName = 'Visualizer' }) => {
  const [currentData, setCurrentData] = useState(data || [30, 10, 50, 20, 40]); // Default data

  useEffect(() => {
    if (data) {
      setCurrentData(data);
    }
  }, [data]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl m-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        {algorithmName}
      </h2>

      <div className="flex justify-center items-end h-64 gap-1 sm:gap-2 border-b-2 border-gray-600 pb-2">
        {currentData.map((value, index) => (
          <div
            key={index}
            className="flex-grow bg-blue-500 rounded-t-sm transition-all duration-300 ease-out flex items-end justify-center text-xs font-semibold text-white"
            style={{ height: `${value * 1.5}px`, minWidth: '15px' }} // Scale height, set min width
          >
            {/* You can display value if desired, or hide it for cleaner visualization */}
            <span className="mb-1 hidden sm:block">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        {/* Placeholder for control buttons */}
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 mr-4"
          onClick={() => alert('Start Sorting/Visualization!')}
        >
          Start
        </button>
        <button
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
          onClick={() => alert('Reset Data!')}
        >
          Reset
        </button>
      </div>

      <p className="text-gray-400 text-sm mt-4 text-center">
        *This is a basic visualizer template. Logic for sorting/tree operations would go here.
      </p>
    </div>
  );
};

export default SortingVisualizer;