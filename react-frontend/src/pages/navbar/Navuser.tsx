import {
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  // FaLock,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

<BiArrowBack />
type User = {
  name: string;
  contact: string;
  email: string;
  created_at: string;
};

export default function Navuser() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // 🔹 FETCH USER DATA FROM BACKEND
  // useEffect(() =>  {
  //   fetch(`http://localhost:8000/users/`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("API Response:", data);
  //       // ✅ API returns array → take first user
  //       setUser(data[0]);
  //     });
      
  // }, []);

  useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) return;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = payload.user_id;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  fetch(`${API_BASE_URL}/users/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      setUser(data);
    });

}, []);

  const handleLogout = () => {
     localStorage.clear();

  toast.success("Logged out successfully");

  setTimeout(() => {
    navigate("/");
  }, 1200);
    // 🔐 Later: clear token + redirect
  };

  if (!user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading user data...
      </div>
    );
  }

  return (
    <>
      <div>
        <p
            onClick={() => navigate("/dashboard")}
          className="fixed top-4 left-4 z-50 text-gray-100 cursor-pointer hover:underline "
          >
           <BiArrowBack size={30} />
          </p>
      </div>
    <div className="w-screen h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white p-4">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl p-8">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <FaUserCircle className="text-7xl text-blue-400" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* DETAILS */}
        <div className="space-y-5">
          {/* CONTACT */}
          <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <FaPhoneAlt className="text-green-400 text-lg" />
              </div>
              <div>
                <span className="block font-medium">Contact</span>
                <span className="text-sm text-gray-400">Phone number</span>
              </div>
            </div>
            <span className="font-semibold text-lg">{user.contact}</span>
          </div>

          {/* EMAIL */}
          <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <FaEnvelope className="text-blue-400 text-lg" />
              </div>
              <div>
                <span className="block font-medium">Email</span>
                <span className="text-sm text-gray-400">Primary email address</span>
              </div>
            </div>
            <span className="font-semibold text-lg">{user.email}</span>
          </div>

          {/* PASSWORD */}
          
            <div className="flex items-center gap-3">
            </div>
          </div>

          {/* CREATED DATE */}
          <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <FaCalendarAlt className="text-yellow-400 text-lg" />
              </div>
              <div>
                <span className="block font-medium">Created Date</span>
                <span className="text-sm text-gray-400">
                  Account creation date
                </span>
              </div>
            </div>
            <span className="font-semibold text-lg">
              {new Date(user.created_at).toDateString()}
            </span>
          </div>
        </div>
      </div>
   </>
  );
}


