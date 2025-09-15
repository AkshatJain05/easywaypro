import { Link } from "react-router-dom";
import { FaSort, FaCodeBranch } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Sorting Algorithms",
      description:
        "Visualize Bubble, Merge, Quick, Insertion, Selection Sort, and more in action.",
      icon: (
        <FaSort className="text-6xl text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
      ),
      link: "/sorting",
    },
    {
      title: "Tree Structures",
      description:
        "Explore AVL, Red-Black, and Binary Search Trees with animations.",
      icon: (
        <FaCodeBranch className="text-6xl text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
      ),
      link: "/trees",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] b bg-gradient-to-br from-gray-950 to-black  text-white flex flex-col items-center justify-center py-12 px-6">
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
      {/* Hero Section */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-blue-400 mb-6 text-center leading-tight animate-fadeIn">
        Explore Algorithms Visually
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-12 text-center max-w-3xl animate-fadeIn delay-200">
        Learn and visualize algorithms and data structures with fun, interactive animations.
      </p>

      {/* Features Grid */}
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl w-full">
        {features.map((feature, idx) => (
          <Link
            key={idx}
            to={feature.link}
            className="bg-gradient-to-br from-gray-950 to-black border-1 border-gray-500 hover:bg-gray-950 transition duration-300 p-8 rounded-2xl shadow-lg flex flex-col items-center text-center group transform hover:-translate-y-2 hover:shadow-2xl"
          >
            {feature.icon}
            <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
            <p className="text-gray-400">{feature.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
