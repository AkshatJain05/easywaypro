import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-9xl font-extrabold text-red-600 mb-4">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-2">Oops! Page not found</h2>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
