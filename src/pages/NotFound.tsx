import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-screen bg-[#111111] text-white">
      {/* Navigation */}
      <nav className="h-16 bg-[#111111]/80 backdrop-blur-md">
        <div className="mx-auto h-full w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-full items-center">
            <Link to="/" className="flex items-center">
              Incident
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content - fills remaining height */}
      <main className="flex h-[calc(100vh-4rem-3rem)] flex-col items-center justify-center px-4">
        <div className="relative">
          {/* Large 404 Background Text */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-[120px] font-bold text-[#1A1A1A] sm:text-[160px]">
            404
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
              Page Not Found
            </h1>
            <p className="mb-6 text-gray-400">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>

            <div>
              <Link
                to="/"
                className="rounded-full bg-[#9FE870] px-6 py-2.5 text-black transition-opacity hover:opacity-90"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-12 w-12 rounded-lg bg-[#1A1A1A] opacity-20"
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 text-center text-sm text-gray-400">
        <p>&copy; 2025 Incident. All rights reserved.</p>
      </footer>
    </div>
  );
}
