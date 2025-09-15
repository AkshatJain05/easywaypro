import  { useState, useEffect, useRef } from "react";
import BarVisualizer from "./BarVisualizer";
import { getInsertionSortSteps } from "./sortingAlgorithms/insertionSort";
import { getBubbleSortSteps } from "./sortingAlgorithms/bubbleSort";
import { getMergeSortSteps } from "./sortingAlgorithms/mergeSort";
import { getQuickSortSteps } from "./sortingAlgorithms/quickSort";
import { getSelectionSortSteps } from "./sortingAlgorithms/selectionSort";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPlay, FaPause, FaStepForward, FaUndo, FaStop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SortingPage = () => {
  const [array, setArray] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
  const [algorithm, setAlgorithm] = useState("Bubble Sort");
  const [visualizationSteps, setVisualizationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300); // milliseconds
  const arrayInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    generateNewArray();
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStepIndex < visualizationSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, speed);
    } else if (currentStepIndex === visualizationSteps.length - 1 && visualizationSteps.length > 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, visualizationSteps, speed]);

  useEffect(() => {
    if (array.length > 0) {
      resetVisualization(array);
    }
  }, [array, algorithm]);

  const generateNewArray = () => {
    const newArr = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 90) + 10
    );
    setArray(newArr);
    setOriginalArray(newArr);
    setVisualizationSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleManualArrayInput = () => {
    const input = arrayInputRef.current.value;
    if (!input) {
        toast.error("Please enter an array first.");
        return;
    }
    const newArr = input
      .split(",")
      .map((num) => parseInt(num.trim(), 10))
      .filter((num) => !isNaN(num) && num >= 0 && num <= 100);
    if (newArr.length > 0) {
      setArray(newArr);
      setOriginalArray(newArr);
      setVisualizationSteps([]);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    } else {
      toast.error("Please enter valid, comma-separated numbers (0-100).");
    }
  };

  const resetVisualization = (arrToVisualize = array) => {
    setIsPlaying(false);
    let steps;
    const arrCopy = [...arrToVisualize];
    switch (algorithm) {
      case "Bubble Sort":
        steps = getBubbleSortSteps(arrCopy);
        break;
      case "Selection Sort":
        steps = getSelectionSortSteps(arrCopy);
        break;
      case "Insertion Sort":
        steps = getInsertionSortSteps(arrCopy);
        break;
      case "Merge Sort":
        steps = getMergeSortSteps(arrCopy);
        break;
      case "Quick Sort":
        steps = getQuickSortSteps(arrCopy);
        break;
      default:
        steps = [{ array: arrCopy, activeIndices: [] }];
    }
    setVisualizationSteps(steps);
    setCurrentStepIndex(0);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setArray([...originalArray]);
    resetVisualization(originalArray);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setArray([...originalArray]);
  };

  const handleStep = () => {
    if (currentStepIndex < visualizationSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setIsPlaying(false);
    }
  };

  const isAtEnd = currentStepIndex >= visualizationSteps.length - 1;
  const isAtStart = currentStepIndex === 0;

  const currentVisualization =
    visualizationSteps[currentStepIndex] || { array: array, sortedIndices: [] };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-950 to-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 mb-6 bg-gray-900 hover:bg-gray-700 text-gray-300 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-blue-300 mb-6 text-center tracking-wider">
          Sorting Algorithm Visualizer
        </h1>

        {/* Control Panel */}
        <div className="bg-gray-950 rounded-xl shadow-lg p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
            {/* Algorithm & Speed */}
            <div className="flex flex-col gap-4">
              <label htmlFor="algorithm-select" className="font-semibold text-gray-300">Algorithm</label>
              <select
                id="algorithm-select"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                disabled={isPlaying}
                className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option>Bubble Sort</option>
                <option>Selection Sort</option>
                <option>Insertion Sort</option>
                <option>Merge Sort</option>
                <option>Quick Sort</option>
              </select>
            </div>

            {/* Array Input */}
            <div className="flex flex-col gap-4">
                <label htmlFor="array-input" className="font-semibold text-gray-300">Custom Array (e.g., 10,5,30)</label>
                <div className="flex gap-2">
                    <input
                        id="array-input"
                        type="text"
                        ref={arrayInputRef}
                        placeholder="Comma-separated numbers"
                        disabled={isPlaying}
                        className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <button onClick={handleManualArrayInput} disabled={isPlaying} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-blue-800 disabled:cursor-not-allowed">
                        Set
                    </button>
                </div>
            </div>

            {/* Generate & Speed */}
            <div className="flex flex-col gap-4">
                <label htmlFor="speed-slider" className="font-semibold text-gray-300">Speed: {speed}ms</label>
                <input
                    id="speed-slider"
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <button onClick={generateNewArray} disabled={isPlaying} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-purple-800 disabled:cursor-not-allowed">
                    Generate New Random Array
                </button>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="w-full overflow-x-auto mb-8 p-4 bg-gray-950 rounded-xl shadow-inner">
          <BarVisualizer
            array={currentVisualization.array}
            comparisons={currentVisualization.comparisons || []}
            swaps={currentVisualization.swaps || []}
            activeIndices={currentVisualization.activeIndices || []}
            sortedIndices={currentVisualization.sortedIndices || []}
            pivot={currentVisualization.pivot || null}
          />
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
          <button onClick={handlePlay} disabled={isPlaying || isAtEnd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-green-800 disabled:cursor-not-allowed">
            <FaPlay /> Start
          </button>
          <button onClick={handlePause} disabled={!isPlaying} className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-yellow-800 disabled:cursor-not-allowed">
            <FaPause /> Pause
          </button>
          <button onClick={handleStep} disabled={isPlaying || isAtEnd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-blue-800 disabled:cursor-not-allowed">
            <FaStepForward /> Step
          </button>
          <button onClick={handleReset} disabled={isPlaying || isAtStart} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-700 disabled:cursor-not-allowed">
            <FaUndo /> Reset
          </button>
          <button onClick={handleStop} disabled={isAtStart && !isPlaying} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-red-800 disabled:cursor-not-allowed">
            <FaStop /> Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortingPage;