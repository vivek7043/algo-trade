import { useState } from "react";
import { LoginContext } from "../context/LoginContext";

export default function LoginProvider(props: any) {

    const [user, setUser] = useState(null);

    const login = (user: any) => {
        localStorage.setItem("user", user);
        console.log(user);
        setUser(user)
    }

    const logout = () => {
        setUser(null)
        localStorage.clear();
    }

  return (
    <LoginContext.Provider value={{ user, login, logout }}>
        { props?.children }
    </LoginContext.Provider>
  )
}

// Props drilling