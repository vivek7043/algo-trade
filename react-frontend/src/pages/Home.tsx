import { useNavigate,Link } from "react-router-dom";
import toast from "react-hot-toast";

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-6 relative overflow-hidden"
      style={{
        backgroundImage: "url('home.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-5 z-10">
        <h1 className="text-2xl font-bold tracking-wide">📈 SmartTrade</h1>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-gray-200 border border-gray-500 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-blue-800 hover:opacity-60 px-4 py-2 rounded-lg font-semibold text-white transition text-sm"
          >
            Create Account
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="flex flex-col items-center justify-center mt-20 text-center space-y-6 z-10">
        <h2 className="text-3xl sm:text-5xl font-bold max-w-lg drop-shadow-lg">
          Algorithmic Trading for Everyone
        </h2>

        <p className="text-gray-200 text-sm sm:text-base max-w-md leading-relaxed">
          Automate your trading with ease and receive trading signals directly
          via Telegram. No coding required.
        </p>

        <button
          onClick={handleGetStarted}
          className="mt-4 bg-blue-800 hover:opacity-60 px-6 py-3 rounded-lg font-semibold transition text-white shadow-md"
        >
          Get Started
        </button>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-300 text-xs z-10">
        © {new Date().getFullYear()} SmartTrade. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Home;




















 