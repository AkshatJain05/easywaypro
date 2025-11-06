import  { useState, useRef } from "react";
import TreeVisualizer from "./TreeVisualizer";
import { BST, AVLTree, RBTree } from "./algorithms";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TreePage = () => {
  const [algorithm, setAlgorithm] = useState("BST");
  const [tree, setTree] = useState(new BST());
  const [highlight, setHighlight] = useState(null);
  const [message, setMessage] = useState(
    "Select an algorithm and start building your tree!"
  );
  const navigate = useNavigate();

  const valueInputRef = useRef(null);

  // Create new tree based on selected algorithm
  const createNewTree = (algo) => {
    switch (algo) {
      case "AVL":
        return new AVLTree();
      case "RB":
        return new RBTree();
      default:
        return new BST();
    }
  };

  // Handle algorithm change
  const handleAlgorithmChange = (e) => {
    const algo = e.target.value;
    setAlgorithm(algo);
    setTree(createNewTree(algo));
    setHighlight(null);
    setMessage(`Switched to ${algo} Tree`);
  };

  // Perform add/search/delete action
  const performAction = (action) => {
    const valueStr = valueInputRef.current.value.trim();
    if (!valueStr) {
      setMessage("Please enter a value.");
      return;
    }

    // Convert to number if numeric, otherwise keep string
    const value = isNaN(valueStr) ? valueStr : Number(valueStr);

    action(value);
    valueInputRef.current.value = "";
    valueInputRef.current.focus();
  };

  // Add node
  const handleAdd = () =>
    performAction((value) => {
      const addedNode = tree.add(value);
      if (addedNode) {
        setTree(
          Object.assign(Object.create(Object.getPrototypeOf(tree)), tree)
        );
        setHighlight({ value: addedNode.value });
        setMessage(
          tree.root.count > 1 && algorithm === "BST"
            ? `Node ${value} count increased to ${addedNode.count}`
            : `Added node ${value}`
        );
      } else {
        setMessage(`Value ${value} already exists in this tree type.`);
      }
    });

  // Delete node
  const handleDelete = () =>
    performAction((value) => {
      const node = tree.search(value);
      if (node) {
        tree.remove(value);
        setTree(
          Object.assign(Object.create(Object.getPrototypeOf(tree)), tree)
        );
        setHighlight(null);
        setMessage(
          algorithm === "BST" && node.count > 1
            ? `Decreased count of node ${value}`
            : `Deleted node ${value}`
        );
      } else {
        setMessage(`Value ${value} not found`);
      }
    });

  // Search node
  const handleSearch = () =>
    performAction((value) => {
      const node = tree.search(value);
      if (node) {
        setHighlight({ value: node.value });
        setMessage(
          algorithm === "BST" && node.count > 1
            ? `Found node ${value} (Count: ${node.count})`
            : `Found node ${value}`
        );
      } else {
        setHighlight(null);
        setMessage(`Node ${value} not found`);
      }
    });

  // Reset tree
  const handleReset = () => {
    setTree(createNewTree(algorithm));
    setHighlight(null);
    setMessage("Tree has been reset.");
    if (valueInputRef.current) valueInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-950 to-black text-white font-sans">
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-2 mx-2 mb-4
                                        bg-gray-800 hover:bg-gray-700 text-gray-200 
                                        rounded-lg text-sm shadow-md transition-transform transform hover:-translate-y-0.5"
        >
          <FaArrowLeft className="text-sm" />
          <span>Back</span>
        </button>
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 text-transparent bg-clip-text tracking-tight">
            Tree Structure Visualizer
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Watch BST, AVL, and Red-Black trees in action.
          </p>
        </header>

        {/* Controls Panel */}
        <div className="bg-gray-950 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Algorithm Selection */}
            <div className="flex flex-col">
              <label
                htmlFor="algo-select"
                className="text-sm font-medium text-gray-400 mb-1"
              >
                Algorithm
              </label>
              <select
                id="algo-select"
                value={algorithm}
                onChange={handleAlgorithmChange}
                className="bg-gray-900 text-white p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              >
                <option value="BST">Binary Search Tree</option>
                <option value="AVL">AVL Tree</option>
                <option value="RB">Red-Black Tree</option>
              </select>
            </div>

            {/* Value Input */}
            <div className="flex flex-col">
              <label
                htmlFor="value-input"
                className="text-sm font-medium text-gray-400 mb-1"
              >
                Node Value
              </label>
              <input
                id="value-input"
                type="text"
                ref={valueInputRef}
                placeholder="e.g., 42 or A"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="bg-gray-900 text-white p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 sm:pt-0">
              <button
                onClick={handleAdd}
                className="bg-green-600 hover:bg-green-700 px-4 py-2.5 rounded-md font-semibold transition duration-300 w-full"
              >
                Add
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-md font-semibold transition duration-300 w-full"
              >
                Delete
              </button>
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-md font-semibold transition duration-300 w-full"
              >
                Search
              </button>
              <button
                onClick={handleReset}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2.5 rounded-md font-semibold transition duration-300 w-full"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Message Bar */}
        {message && (
          <div className="text-center text-lg text-green-300 mb-6 p-3 bg-green-800 rounded-lg">
            {message}
          </div>
        )}

        {/* Tree Visualization Area */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-950 min-h-[50vh]">
          <div className="w-full h-full overflow-auto touch-pan-x touch-pan-y">
            <div className="min-w-[600px] md:min-w-[900px] lg:min-w-[1200px] flex justify-center">
              <TreeVisualizer
                tree={tree}
                highlight={highlight}
                algorithm={algorithm}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TreePage;
