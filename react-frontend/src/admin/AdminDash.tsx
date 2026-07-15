import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  contact: string;
  email: string;
  status: boolean;
};

function AdminDash() {
  const [users, setUsers] = useState<User[]>([]);
   const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all")

  const fetchUsers = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/users/`);
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUser = async (user_id: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    await fetch(`${API_BASE_URL}/users/toggle-user/${user_id}`, {
      method: "PUT"
    });

    fetchUsers(); // refresh list
  };
 
 
 const filteredUsers = users
    .filter((user) => {
      const text = search.toLowerCase();
      return (
        user.name?.toLowerCase().includes(text) ||
        user.email?.toLowerCase().includes(text) ||
        user.contact?.includes(text)
      );
    })
    .filter((user) => {
      if (filter === "active") return user.status === true;
      if (filter === "disabled") return user.status === false;
      return true;
    });
 
  
   return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by name, email, contact..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-3 rounded bg-gray-800 text-white outline-none"
      />

      {/* 🎯 FILTER */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded ${
            filter === "active" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setFilter("disabled")}
          className={`px-4 py-2 rounded ${
            filter === "disabled" ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          Disabled
        </button>
      </div>

      {/* USERS LIST */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-gray-800 p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Contact:</b> {user.contact}</p>
            </div>

            {/* TOGGLE */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!user.status}
                onChange={() => toggleUser(user._id)}
                className="sr-only peer"
              />

              <div className="w-14 h-8 bg-gray-600 rounded-full 
                peer-checked:bg-green-500 transition"></div>

              <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full 
                transition-transform peer-checked:translate-x-6"></div>
            </label>
          </div>
        ))}
      </div>

    </div>
  );
}


export default AdminDash;