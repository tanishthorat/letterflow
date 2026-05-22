export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Letterflow</h1>
        <p className="text-xl text-gray-600 mb-8">
          Simple, powerful email template management
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-md font-medium hover:bg-blue-50 transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
