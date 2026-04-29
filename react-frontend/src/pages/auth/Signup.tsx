// // import { Link, useNavigate } from "react-router-dom";
// // import { useState } from "react";
// // import toast from "react-hot-toast";

// // function Signup() {
// //   const [form, setForm] = useState({
// //     name: "",
// //     contact: "",
// //     email: "",
// //     password: "",
// //     agree: false,
// //   });

// //   const [errors, setErrors] = useState({
// //     name: "",
// //     contact: "",
// //     email: "",
// //     password: "",
// //     agree: "",
// //   });

// //   const [borderError, setBorderError] = useState({
// //     name: false,
// //     contact: false,
// //     email: false,
// //     password: false,
// //   });

// //   const navigate = useNavigate();

// //   const onChangeHandler = (e:any) => {
// //     const { name, value, type, checked } = e.target;

// //     setForm({
// //       ...form,
// //       [name]: type === "checkbox" ? checked : value,
// //     });

// //     setErrors({ ...errors, [name]: "" });
// //     setBorderError({ ...borderError, [name]: false });
// //   };

// //   const handleSignup = () => {
// //     let newErrors = {
// //       name: "",
// //       contact: "",
// //       email: "",
// //       password: "",
// //       agree: "",
// //     };

// //     let borderCopy = {
// //       name: false,
// //       contact: false,
// //       email: false,
// //       password: false,
// //     };

// //     // NAME validation
// //     if (form.name.trim() === "") {
// //       newErrors.name = "Name is required";
// //       borderCopy.name = true;
// //     }

// //     // CONTACT validation
// //     if (form.contact.trim() === "") {
// //       newErrors.contact = "Contact number is required";
// //       borderCopy.contact = true;
// //     } else if (!/^[0-9]{10}$/.test(form.contact)) {
// //       newErrors.contact = "Enter a valid 10-digit contact number";
// //       borderCopy.contact = true;
// //     }

// //     // EMAIL validation
// //     if (form.email.trim() === "") {
// //       newErrors.email = "Email is required";
// //       borderCopy.email = true;
// //     } else {
// //       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //       if (!emailRegex.test(form.email)) {
// //         newErrors.email = "Enter a valid email";
// //         borderCopy.email = true;
// //       }
// //     }

// //     // PASSWORD validation
// //     if (form.password.trim() === "") {
// //       newErrors.password = "Password is required";
// //       borderCopy.password = true;
// //     } else if (form.password.length < 6) {
// //       newErrors.password = "Password must be at least 6 characters";
// //       borderCopy.password = true;
// //     }

// //     // TERMS validation
// //     if (!form.agree) {
// //       newErrors.agree = "You must accept Terms & Conditions";
// //     }

// //     setErrors(newErrors);
// //     setBorderError(borderCopy);

// //     // Stop if any error
// //     if (
// //       newErrors.name ||
// //       newErrors.contact ||
// //       newErrors.email ||
// //       newErrors.password ||
// //       newErrors.agree
// //     )
// //       return;

// //     // ⭐ SAVE USER TO LOCAL STORAGE
// //     const userData = {
// //       name: form.name,
// //       contact: form.contact,
// //       email: form.email,
// //       password: form.password,
// //     };

// //     localStorage.setItem("user", JSON.stringify(userData));

// //     toast.success("Signup Successful!");
// //     navigate("/login");
// //   };

// //   return (
// //     <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

// //       {/* Background Video */}
// //       <video
// //         autoPlay
// //         loop
// //         muted
// //         playsInline
// //         className="absolute top-0 left-0 w-full h-full object-cover"
// //       >
// //         <source src="stoke.mp4" type="video/mp4" />
// //       </video>

// //       {/* Dark overlay */}
// //       <div className="absolute inset-0 opacity-70"></div>

// //       {/* Main Card Split 50/50 */}
// //       <div className="z-10 flex bg-[#12161c]/80 rounded-2xl shadow-xl w-[750px] max-w-full h-[520px] overflow-hidden">

// //         {/* LEFT SIDE IMAGE */}
// //         <div className="w-1/2 hidden sm:block">
// //           <img
// //             src={"signup.jpg"}
// //             alt="signup-side"
// //             className="w-full h-full object-cover"
// //           />
// //         </div>

// //         {/* RIGHT SIDE FORM */}
// //         <div className="w-full sm:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
// // {/* 
// //           <h2 className="text-2xl font-bold mb-2 text-center">Create account</h2> */}
// //           <img src="signupuser.png" className="h-50 w-15 ml-30 mb-3"></img>
// //           <p className="text-gray-200 text-sm mb-6 text-center">
// //             Create your SmartTrade account
// //           </p>

// //           {/* Name */}
// //           <input
// //             type="text"
// //             name="name"
// //             value={form.name}
// //             placeholder="Name"
// //             className={`w-full mb-4  px-4 py-2 rounded-lg bg-[#1c2128] text-gray-200 outline-none border-2 ${
// //               borderError.name ? "border-red-500" : ""
// //             }`}
// //             onChange={onChangeHandler}
// //           />
// //           {errors.name && (
// //             <p className="text-red-500 text-left text-xs mb-3">{errors.name}</p>
// //           )}

// //           {/* Contact */}
// //           <input
// //             type="text"
// //             name="contact"
// //             value={form.contact}
// //             placeholder="Contact Number"
// //             className={`w-full mb-4 px-4 py-2 rounded-lg bg-[#1c2128] text-gray-200 outline-none border-2 ${
// //               borderError.contact ? "border-red-500" : ""
// //             }`}
// //             onChange={onChangeHandler}
// //           />
// //           {errors.contact && (
// //             <p className="text-red-500 text-left text-xs mb-3">
// //               {errors.contact}
// //             </p>
// //           )}

// //           {/* Email */}
// //           <input
// //             type="email"
// //             name="email"
// //             value={form.email}
// //             placeholder="Email"
// //             className={`w-full mb-4 px-4 py-2 rounded-lg bg-[#1c2128] text-gray-200 outline-none border-2 ${
// //               borderError.email ? "border-red-500" : ""
// //             }`}
// //             onChange={onChangeHandler}
// //           />
// //           {errors.email && (
// //             <p className="text-red-500 text-left text-xs mb-3">{errors.email}</p>
// //           )}

// //           {/* Password */}
// //           <input
// //             type="password"
// //             name="password"
// //             value={form.password}
// //             placeholder="Password"
// //             className={`w-full mb-4 px-4 py-2 rounded-lg bg-[#1c2128] text-gray-200 outline-none border-2 ${
// //               borderError.password ? "border-red-500" : ""
// //             }`}
// //             onChange={onChangeHandler}
// //           />
// //           {errors.password && (
// //             <p className="text-red-500 text-left text-xs mb-3">
// //               {errors.password}
// //             </p>
// //           )}

// //           {/* Terms */}
// //           <label className="flex items-center text-gray-300 text-sm mb-4">
// //             <input
// //               type="checkbox"
// //               name="agree"
// //               checked={form.agree}
// //               className="mr-2 w-4 h-4"
// //               onChange={onChangeHandler}
// //             />
// //             I agree to the Terms & Conditions
// //           </label>
// //           {errors.agree && (
// //             <p className="text-red-500 text-left text-xs mb-3">{errors.agree}</p>
// //           )}

// //           {/* Button */}
// //           <button
// //             onClick={handleSignup}
// //             className="w-full bg-blue-800 hover:opacity-60 py-2 rounded-lg font-semibold mb-4"
// //           >
// //             Signup
// //           </button>

// //           <p className="text-gray-400 text-sm mt-1 text-center">
// //             Already have an account?{" "}
// //             <Link to="/login" className="text-blue-800 hover:underline">
// //               Login
// //             </Link>
// //           </p>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Signup;



// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import toast from "react-hot-toast";

// function Signup() {
//   const [form, setForm] = useState({
//     name: "",
//     contact: "",
//     email: "",
//     password: "",
//     agree: false,
//   });

//   const [errors, setErrors] = useState({
//     name: "",
//     contact: "",
//     email: "",
//     password: "",
//     agree: "",
//   });

//   const [borderError, setBorderError] = useState({
//     name: false,
//     contact: false,
//     email: false,
//     password: false,
//   });

//   const navigate = useNavigate();

//   const onChangeHandler = (e: any) => {
//     const { name, value, type, checked } = e.target;

//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });

//     setErrors({ ...errors, [name]: "" });
//     setBorderError({ ...borderError, [name]: false });
//   };

//   const handleSignup = async () => {
//     let newErrors = {
//       name: "",
//       contact: "",
//       email: "",
//       password: "",
//       agree: "",
//     };

//     let borderCopy = {
//       name: false,
//       contact: false,
//       email: false,
//       password: false,
//     };

//     // Name
//     if (form.name.trim() === "") {
//       newErrors.name = "Name is required";
//       borderCopy.name = true;
//     }

//     // Contact
//     if (form.contact.trim() === "") {
//       newErrors.contact = "Contact number is required";
//       borderCopy.contact = true;
//     } else if (!/^[0-9]{10}$/.test(form.contact)) {
//       newErrors.contact = "Enter valid 10-digit contact number";
//       borderCopy.contact = true;
//     }

//     // Email
//     if (form.email.trim() === "") {
//       newErrors.email = "Email is required";
//       borderCopy.email = true;
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(form.email)) {
//         newErrors.email = "Enter valid email";
//         borderCopy.email = true;
//       }
//     }

//     // Password
//     if (form.password.trim() === "") {
//       newErrors.password = "Password is required";
//       borderCopy.password = true;
//     } else if (form.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//       borderCopy.password = true;
//     }

//     // Terms
//     if (!form.agree) {
//       newErrors.agree = "You must accept Terms & Conditions";
//     }

//     setErrors(newErrors);
//     setBorderError(borderCopy);

//     if (
//       newErrors.name ||
//       newErrors.contact ||
//       newErrors.email ||
//       newErrors.password ||
//       newErrors.agree
//     ) {
//       return;
//     }

//     // 🔥 SEND DATA TO FASTAPI
//     try {
//       const res = await fetch("http://127.0.0.1:8000/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: form.name,
//           contact: form.contact,
//           email: form.email,
//           password: form.password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         toast.error(data.detail || "Signup failed");
//         return;
//       }

//       toast.success("Signup successful!");
//       navigate("/login");

//     } catch (error) {
//       toast.error("Server not reachable");
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

//       {/* Background Video */}
//       <video autoPlay loop muted playsInline className="absolute w-full h-full object-cover">
//         <source src="stoke.mp4" type="video/mp4" />
//       </video>

//       <div className="absolute inset-0 opacity-70"></div>

//       <div className="z-10 flex bg-[#12161c]/80 rounded-2xl shadow-xl w-[750px] h-[520px] overflow-hidden">

//         {/* Left Image */}
//         <div className="w-1/2 hidden sm:block">
//           <img src="signup.jpg" className="w-full h-full object-cover" />
//         </div>

//         {/* Right Form */}
//         <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
//           <img src="signupuser.png" className="h-16 mx-auto mb-3" />

//           <p className="text-sm mb-6 text-center">
//             Create your SmartTrade account
//           </p>

//           <input name="name" value={form.name} placeholder="Name"
//             onChange={onChangeHandler}
//             className={`w-full mb-3 px-4 py-2 rounded-lg bg-[#1c2128] border-2 ${borderError.name ? "border-red-500" : ""}`}
//           />
//           {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

//           <input name="contact" value={form.contact} placeholder="Contact"
//             onChange={onChangeHandler}
//             className={`w-full mb-3 px-4 py-2 rounded-lg bg-[#1c2128] border-2 ${borderError.contact ? "border-red-500" : ""}`}
//           />
//           {errors.contact && <p className="text-red-500 text-xs">{errors.contact}</p>}

//           <input name="email" value={form.email} placeholder="Email"
//             onChange={onChangeHandler}
//             className={`w-full mb-3 px-4 py-2 rounded-lg bg-[#1c2128] border-2 ${borderError.email ? "border-red-500" : ""}`}
//           />
//           {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

//           <input type="password" name="password" value={form.password} placeholder="Password"
//             onChange={onChangeHandler}
//             className={`w-full mb-3 px-4 py-2 rounded-lg bg-[#1c2128] border-2 ${borderError.password ? "border-red-500" : ""}`}
//           />
//           {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

//           <label className="flex items-center text-sm mb-3">
//             <input type="checkbox" name="agree" checked={form.agree}
//               onChange={onChangeHandler} className="mr-2" />
//             I agree to Terms & Conditions
//           </label>
//           {errors.agree && <p className="text-red-500 text-xs">{errors.agree}</p>}

//           <button onClick={handleSignup}
//             className="w-full bg-blue-800 hover:opacity-80 py-2 rounded-lg font-semibold">
//             Signup
//           </button>

//           <p className="text-sm mt-4 text-center">
//             Already have an account?{" "}
//             <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signup;


import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    agree: false,
  });

  const navigate = useNavigate();

  const onChangeHandler = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSignup = async () => {
    if (form.name.trim() === "") {
      toast.error("Name is required");
      return;
    }

    if (form.contact.trim() === "") {
      toast.error("Contact number is required");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.contact)) {
      toast.error("Enter valid 10-digit contact number");
      return;
    }

    if (form.email.trim() === "") {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Enter valid email address");
      return;
    }

    if (form.password.trim() === "") {
      toast.error("Password is required");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!form.agree) {
      toast.error("You must accept Terms & Conditions");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          contact: form.contact,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Signup failed");
        return;
      }

      toast.success("Signup successful!");
      navigate("/login");
    } catch {
      toast.error("Server not reachable");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="stoke.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 opacity-70"></div>

      <div className="z-10 flex bg-[#12161c]/80 rounded-2xl shadow-xl w-[750px] h-[520px] overflow-hidden">
        {/* Left Image */}
        <div className="w-1/2 hidden sm:block">
          <img src="signup.jpg" className="w-full h-full object-cover" />
        </div>

        {/* Right Form */}
        <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
          <img src="signupuser.png" className="h-16 mx-auto mb-3" />

          <p className="text-sm mb-6 text-center">
            Create your SmartTrade account
          </p>

          <input
            name="name"
            value={form.name}
            placeholder="Name"
            onChange={onChangeHandler}
            className="w-full mb-3 px-4 py-2 rounded-lg bg-[#1c2128] outline-none border-2"
          />

          <input
            name="contact"
            value={form.contact}
            placeholder="Contact Number"
            onChange={onChangeHandler}
            className="w-full mb-3 px-4 py-2 rounded-lg bg-[#1c2128] outline-none border-2"
          />

          <input
            name="email"
            value={form.email}
            placeholder="Email"
            onChange={onChangeHandler}
            className="w-full mb-3 px-4 py-2 rounded-lg bg-[#1c2128] outline-none border-2"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="Password"
            onChange={onChangeHandler}
            className="w-full mb-3 px-4 py-2 rounded-lg bg-[#1c2128] outline-none border-2"
          />

          <label className="flex items-center text-sm mb-4">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={onChangeHandler}
              className="mr-2"
            />
            I agree to Terms & Conditions
          </label>

          <button
            onClick={handleSignup}
            className="w-full bg-blue-800 hover:opacity-80 py-2 rounded-lg font-semibold"
          >
            Signup
          </button>

          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
