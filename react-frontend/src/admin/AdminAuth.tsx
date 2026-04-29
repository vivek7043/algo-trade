
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);

  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:8000/admin/login"
      : "http://localhost:8000/admin/register";

    const body = isLogin
      ? { contact, password }
      : { contact, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        setMsg(isLogin ? "✅ Login Success" : "✅ Registered Successfully");
        navigate("/admindash");

        if (isLogin) {
          localStorage.setItem("admin", JSON.stringify(data));
          navigate("/admin");
        }

        setContact("");
        setEmail("");
        setPassword("");
      } else {
        setMsg(data.detail || "❌ Error");
      }
    } catch {
      setMsg("❌ Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-black">
      
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-[380px]">
        
        {/* Toggle */}
        <div className="flex mb-6 bg-gray-800 rounded-full p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 rounded-full ${
              isLogin ? "bg-blue-600 text-white" : "text-gray-400"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 rounded-full ${
              !isLogin ? "bg-purple-600 text-white" : "text-gray-400"
            }`}
          >
            Signup
          </button>
        </div>

        <h2 className="text-white text-2xl font-bold text-center mb-6">
          {isLogin ? "Admin Login" : "Admin Signup"}
        </h2>

        <form onSubmit={handleSubmit}>
          
          {/* Contact */}
          <input
            type="text"
            placeholder="Contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white outline-none"
            required
          />

          {/* Email only in signup */}
          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white outline-none"
              required
            />
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded-lg bg-gray-800 text-white outline-none"
            required
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* Message */}
        {msg && (
          <p className="text-center text-gray-300 mt-4 text-sm">{msg}</p>
        )}

        {/* Switch */}
        <p className="text-center text-gray-400 mt-5 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 ml-1 cursor-pointer"
          >
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default AdminAuth;