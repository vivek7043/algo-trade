import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import LoginProvider from "./provider/Loginprovider";
import Configration from "./pages/Configration";
import { Toaster } from "react-hot-toast";
import Account from "./pages/navbar/Account";
import Navuser from "./pages/navbar/Navuser";
import Todaytrades from "./pages/navbar/Todaytrades";

import AdminAuth from "./admin/AdminAuth";
import AdminDash from "./admin/AdminDash";

function App() {
  return (
    
    <LoginProvider>
      <Toaster position="top-center" />
      <Routes>
         
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/configration" element={<Configration/>}/>
        <Route path="/dashboard/account" element={<Account/>}/>
        <Route path="/dashboard/users" element={<Navuser/>}/>
         <Route path="/dashboard/todaytrades" element={<Todaytrades/>}/>
         
          <Route path="/admin" element={<AdminAuth/>}/>
          <Route path="/admindash" element={<AdminDash/>}/>

      </Routes>
    </LoginProvider>
  );
}

export default App;
