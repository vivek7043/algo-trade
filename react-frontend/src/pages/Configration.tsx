
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function Configration() {

//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     consumerkey: "",
//     mobile: "",
//     ucc: "",
//     mpin: "",
//     totp: "",
//     telegramapikey: ""
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async () => {
//     // 🔴 Required field validation
//     for (const [key, value] of Object.entries(formData)) {
//       if (!value.trim()) {
//         toast.error(`❌ ${key} is required`);
//         return;
//       }
//     }

//     try {
//       const res = await fetch("http://localhost:8000/config/save", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData)
//       });

//       if (!res.ok) {
//         throw new Error("Failed");
//       }

//       toast.success("✅ Configuration saved successfully");

//       // ✅ redirect after success
//       setTimeout(() => {
//         navigate("/");   // home page path
//       }, 1500);

//     } catch (error) {
//       console.error(error);
//       toast.error("❌ Server error");
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

//       <video autoPlay loop muted playsInline
//         className="absolute top-0 left-0 w-full h-full object-cover">
//         <source src="stoke.mp4" type="video/mp4" />
//       </video>

//       <div className="absolute inset-0 opacity-70"></div>

//       <div className="z-10 flex bg-[#12161c]/80 rounded-2xl shadow-xl w-[800px] h-[530px] overflow-hidden">

//         <div className="w-1/2">
//           <img src={"api.png"} alt="lock" className="w-full h-full object-cover" />
//         </div>

//         <div className="w-1/2 h-10 mt-56 p-10 flex flex-col justify-center">

//           <h2 className="text-2xl font-bold mb-2 text-center">Configration</h2>

//           <h2 className="mt-3 ml-3">Kotak Api</h2>

//           <input name="consumerkey" placeholder="Consumer Key"
//             onChange={handleChange}
//             className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border" />

//           <input name="mobile" placeholder="Mobile Number"
//             onChange={handleChange}
//             className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border" />

//           <input name="ucc" placeholder="UCC"
//             onChange={handleChange}
//             className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border" />

//           <input name="mpin" placeholder="MPIN"
//             onChange={handleChange}
//             className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border" />

//           <input name="totp" placeholder="TOTPSECRET"
//             onChange={handleChange}
//             className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border" />

//           <h2 className="mt-3 ml-3">Telegram Api</h2>

//           <input name="telegramapikey" placeholder="Api Key"
//             onChange={handleChange}
//             className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border-2" />

//           <button
//             onClick={handleSubmit}
//             className="w-full bg-blue-800 hover:opacity-60 py-2 rounded-lg font-semibold mt-4">
//             Submit
//           </button>

//           {/* 🔙 Back to Home */}
//           <p
//             onClick={() => navigate("/")}
//             className="text-center mt-2 text-sm text-gray-400 cursor-pointer hover:underline"
//           >
//             ← Back
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Configration() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    consumerkey: "",
    mobile: "",
    ucc: "",
    mpin: "",
    totp: "",
    telegramapikey: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {

    // ✅ Required validation
    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) {
        toast.error(`❌ ${key} is required`);
        return;
      }
    }

    try {

      // 🔥 token માંથી user_id કાઢવું
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("User not logged in");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.user_id;

      const res = await fetch("http://localhost:8000/config/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          user_id: userId   // 🔥 IMPORTANT
        })
      });

      if (!res.ok) {
        throw new Error("Failed");
      }

      toast.success("✅ Configuration saved successfully");

      // ✅ redirect to home
      setTimeout(() => {
        navigate("/");   
      }, 1500);

    } catch (error) {
      console.error(error);
      toast.error("❌ Server error");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

      <video autoPlay loop muted playsInline
        className="absolute top-0 left-0 w-full h-full object-cover">
        <source src="stoke.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 opacity-70"></div>

      <div className="z-10 flex bg-[#12161c]/80 rounded-2xl shadow-xl w-[800px] h-[530px] overflow-hidden">

        <div className="w-1/2">
          <img src={"api.png"} alt="lock" className="w-full h-full object-cover" />
        </div>

        <div className="w-1/2 h-10 mt-56 p-10 flex flex-col justify-center">

          <h2 className="text-2xl font-bold mb-2 text-center">Configration</h2>

          <h2 className="mt-3 ml-3">Kotak Api</h2>

          <input name="consumerkey" placeholder="Consumer Key"
            onChange={handleChange}
            className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border" />

          <input name="mobile" placeholder="Mobile Number"
            onChange={handleChange}
            className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border" />

          <input name="ucc" placeholder="UCC"
            onChange={handleChange}
            className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border" />

          <input name="mpin" placeholder="MPIN"
            onChange={handleChange}
            className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border" />

          <input name="totp" placeholder="TOTPSECRET"
            onChange={handleChange}
            className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border" />

          <h2 className="mt-3 ml-3">Telegram Api</h2>

          <input name="telegramapikey" placeholder="Api Key"
            onChange={handleChange}
            className="w-full mt-3 px-4 py-2 rounded-lg bg-[#1c2128] border-2" />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-800 hover:opacity-60 py-2 rounded-lg font-semibold mt-4">
            Submit
          </button>

          <p
            onClick={() => navigate("/")}
            className="text-center mt-2 text-sm text-gray-400 cursor-pointer hover:underline"
          >
            ← Back
          </p>

        </div>
      </div>
    </div>
  );
}