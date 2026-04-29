

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export default function Login() {
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  // 🔐 Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const onChangeHanler = (e: any) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  // ---------------- LOGIN ----------------
  // const formSubmit = async () => {
  //   if (!loginForm.email || !loginForm.password) {
  //     toast.error("Email and Password required");
  //     return;
  //   }

  //   try {
  //     const res = await fetch("http://localhost:8000/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(loginForm)
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       toast.error(data.detail || "Invalid Email or Password");
  //       return;
  //     }

  //     localStorage.setItem("token", data.access_token);
  //     toast.success("Login Successful!");
  //     setTimeout(() => navigate("/configration"), 1200);

  //   } catch {
  //     toast.error("Server not responding");
  //   }
  // };

  const formSubmit = async () => {
  if (!loginForm.email || !loginForm.password) {
    toast.error("Email and Password required");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm)
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.detail || "Invalid Email or Password");
      return;
    }

    localStorage.setItem("token", data.access_token);
    toast.success("Login Successful!");

    setTimeout(() => {
      if (data.hasConfiguration) {
        navigate("/");
      } else {
        navigate("/configration");
      }
    }, 1200);

  } catch {
    toast.error("Server not responding");
  }
};

  // ---------------- SEND OTP ----------------
  const sendOtp = async () => {
    if (!fpEmail) {
      toast.error("Email required");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail || "Failed to send OTP");
        return;
      }

      toast.success("OTP sent to email");
      setStep("otp");

    } catch {
      toast.error("Server error");
    }
  };

  // ---------------- RESET PASSWORD ----------------
  const resetPassword = async () => {
    if (!otp || !newPassword) {
      toast.error("OTP & new password required");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fpEmail,
          otp,
          new_password: newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail || "Invalid OTP");
        return;
      }

      toast.success("Password reset successful");
      setShowForgot(false);
      setStep("email");

    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

      <video autoPlay loop muted playsInline
        className="absolute top-0 left-0 w-full h-full object-cover">
        <source src="stoke.mp4" type="video/mp4" />
      </video>

      <div className="z-10 flex bg-[#12161c]/80 rounded-2xl shadow-xl w-[750px] h-[430px] overflow-hidden">

        <div className="w-1/2">
          <img src="login.jpg" className="w-full h-full object-cover" />
        </div>

        <div className="w-1/2 p-10 flex flex-col justify-center relative">

          <img src="user_6542954.png" className="h-20 w-20 mx-auto mb-3" />

          <p className="text-gray-200 text-sm mb-8 text-center">
            Login to your SmartTrade account
          </p>

          {/* LOGIN FORM */}
          {!showForgot && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full mb-5 px-4 py-2 rounded-lg bg-[#1c2128] border-2"
                onChange={onChangeHanler}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mb-2 px-4 py-2 rounded-lg bg-[#1c2128] border-2"
                onChange={onChangeHanler}
              />

              <p
                className="text-sm text-blue-400 cursor-pointer text-right mb-4  hover:text-blue-600 transition-colors duration-200"
                onClick={() => setShowForgot(true)}
              >
                Forgot password?
              </p>

              <button
                onClick={formSubmit}
                 className="w-full bg-blue-800 py-2 rounded-lg mb-4 
           hover:bg-blue-700 hover:scale-[1.02] 
           hover:shadow-lg transition-all duration-200"
              >
                Login
              </button>

              <p className="text-gray-200 text-sm text-center">
                Don’t have an account?{" "}
                <Link to="/signup" className="hover:underline">
                  Sign Up
                </Link>
              </p>
            </>
          )}

          {/* FORGOT PASSWORD */}
          {showForgot && (
            <>
              {step === "email" && (
                <>
                  <input
                    type="email"
                    placeholder="Enter registered email"
                    className="w-full mb-4 px-4 py-2 rounded-lg bg-[#1c2128] border-2"
                    onChange={(e) => setFpEmail(e.target.value)}
                  />

                  <button
                    onClick={sendOtp}
                    // className="w-full bg-blue-800 py-2 rounded-lg mb-4 hover:*"
                    className="w-full bg-blue-800 py-2 rounded-lg mb-4 
           hover:bg-blue-700 hover:scale-[1.02] 
           hover:shadow-lg transition-all duration-200"
                  >
                    Send OTP
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  <input
                    placeholder="Enter OTP"
                    className="w-full mb-3 px-4 py-2 rounded-lg bg-[#1c2128] border-2"
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full mb-4 px-4 py-2 rounded-lg bg-[#1c2128] border-2"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <button
                    onClick={resetPassword}
                     className="w-full bg-blue-800 py-2 rounded-lg mb-1 
           hover:bg-blue-700 hover:scale-[1.02] 
           hover:shadow-lg transition-all duration-200"
                  >
                    Reset Password
                  </button>
                </>
              )}

              <p
                className="text-sm text-gray-400 cursor-pointer text-center mt-4  hover:text-white transition-colors duration-200"
                onClick={() => setShowForgot(false)}
              >
                Back to Login
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
