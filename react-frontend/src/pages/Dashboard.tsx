import { useState, useEffect } from "react";
import toast from "react-hot-toast";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PiChartLineUpBold, PiChartLineDownBold } from "react-icons/pi";
import {
  FaRobot,
  FaPlay,
  FaTelegramPlane,
  FaPause,
  FaBars,
  FaTimes,
  FaUserTie,
  

  // FaGem,
  FaWallet,
  FaChartArea,
} from "react-icons/fa";

/* ================= TYPES ================= */
type Trade = {
  sym: string;
  stkPrc: number;
  optTp: string;
  trnsTp: "B" | "S";
  fldQty: number;
  avgPrc: number;
  flTm: string;
};

function Dashboard() {
  const [open, setOpen] = useState(false); // settings panel
  const [menuOpen, setMenuOpen] = useState(false); // sidebar
  const [trades, setTrades] = useState<Trade[]>([]);
  const [status, setStatus] = useState("Deactive");
  const [isRunning, setIsRunning] = useState(false);
  const [todayProfit, setTodayProfit] = useState<any>(0.0);
  const [isTelegramConnected, setIsTelegramConnected] = useState(false);
  const [notification, setNotification] = useState("");
  // const [totalBuying, setTotalBuying] = useState(0);
  // const [totalSelling, setTotalSelling] = useState(0);
  const navigate = useNavigate();

 

  const loginKotak = async () => {
    const token = localStorage.getItem("token");
    try {
      fetch("http://127.0.0.1:8000/kotak/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          getTrades();
        });
    } catch (e: any) {
      console.error(e.toString());
    }
  };



  const getTrades = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not logged in ❌");
      return;
    }

    fetch("http://127.0.0.1:8000/kotak/trades", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const tradeData = Array.isArray(data) ? data : [];
        setTrades(tradeData);

        if (tradeData.length > 0) {
          const sellingRecords = tradeData.filter(
            (item: any) => item.trnsTp === "S",
          );

          const sellingAmount = sellingRecords.reduce(
            (acc: any, item: any) =>
              parseFloat(acc) +
              parseFloat(item.avgPrc) * parseFloat(item.fldQty),
            0.0,
          );

          const buyingRecords = tradeData.filter(
            (item: any) => item.trnsTp === "B",
          );

          const buyingAmount = buyingRecords.reduce(
            (acc: any, item: any) =>
              parseFloat(acc) +
              parseFloat(item.avgPrc) * parseFloat(item.fldQty),
            0.0,
          );

          setTodayProfit(sellingAmount - buyingAmount);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Kotak login failed ❌");
      });
  }

  const [formData, setFormData] = useState({
    consumerkey: "",
    mobile: "",
    ucc: "",
    mpin: "",
    totp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleSubmit = async () => {
    // ✅ Required validation
    for (const value of Object.values(formData)) {
      if (!value.trim()) {
        toast.error("All fields are required ❌");
        return;
      }
    }

    try {
      // 🔥 Token લો
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("User not logged in ❌");
        return;
      }

      // 🔥 Token માંથી user_id કાઢો
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.user_id;

      const res = await fetch("http://localhost:8000/config/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          user_id: userId, // 🔥 IMPORTANT CHANGE
        }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Configuration saved ✅");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Server error ❌");
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/telegram/status")
      .then((res) => res.json())
      .then((data) => setIsTelegramConnected(data.connected));
  }, []);



 useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/telegram/ws");

    socket.onmessage = (event) => {
      setNotification(event.data);

      setTimeout(() => {
        setNotification("");
      }, 3000);
    };

    return () => socket.close();
  }, []);




  return (
    <>
    <div>
    {notification && (
  <div className="fixed top-5 right-5 bg-slate-800 text-white px-5 py-2 rounded-lg shadow-lg z-50">
    {notification}
  </div>
)}

      </div>
    <div className="min-h-screen text-white flex flex-col items-center bg-linear-to-br from-[#0b0e13] via-[#12161c] to-[#1a1f2e] px-6 py-10 relative">
      {/* ================= HAMBURGER BUTTON ================= */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-5 left-5 z-40 bg-white/10 backdrop-blur-lg
        border border-white/20 p-3 rounded-lg hover:bg-white/20 transition"
      >
        <FaBars />
      </button>

      {/* ================= LEFT GLASS SIDEBAR ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white/10 backdrop-blur-xl
        border-r border-white/20 shadow-2xl z-50
        transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-5 border-b border-white/20">
          <h2 className="text-lg font-semibold">SmartTrade</h2>
          <button onClick={() => setMenuOpen(false)}>
            <FaTimes className="text-xl" />
          </button>
        </div>

        <ul className="p-6 space-y-4 text-sm">
          {/* <li className="group flex items-center gap-4 px-5 py-3 rounded-xl
    bg-linear-to-r from-indigo-500/10 to-transparent
    hover:from-indigo-500/20 hover:to-indigo-400/10
    cursor-pointer transition-all duration-300">
    <FaUserLock className="text-indigo-400 text-lg group-hover:scale-110 transition" />
    <span>User_roles</span>
  </li> */}

          <li
            onClick={() => navigate("/dashboard/users")}
            className="group flex items-center gap-4 px-5 py-3 rounded-xl
    bg-linear-to-r from-emerald-500/10 to-transparent
    hover:from-emerald-500/20 hover:to-emerald-400/10
    cursor-pointer transition-all duration-300"
          >
            <FaUserTie className="text-emerald-400 text-lg group-hover:scale-110 transition" />
            <span>Users</span>
          </li>

          <li
            onClick={() => navigate("/dashboard/account")}
            className="group flex items-center gap-4 px-5 py-3 rounded-xl
  bg-linear-to-r from-cyan-500/10 to-transparent
  hover:from-cyan-500/20 hover:to-cyan-400/10
  cursor-pointer transition-all duration-300"
          >
            <FaWallet className="text-cyan-400 text-lg group-hover:scale-110 transition" />
            <span>Account</span>
          </li>

          <li
            onClick={() => navigate("/dashboard/todaytrades")}
            className="group flex items-center gap-4 px-5 py-3 rounded-xl
    bg-linear-to-r from-pink-500/10 to-transparent
    hover:from-pink-500/20 hover:to-pink-400/10
    cursor-pointer transition-all duration-300"
          >
            <FaChartArea className="text-pink-400 text-lg group-hover:scale-110 transition" />
            <span>Today_trades</span>
          </li>

          {
            //       <li className="group flex items-center gap-4 px-5 py-3 rounded-xl
            // bg-linear-to-r from-yellow-500/10 to-transparent
            // hover:from-yellow-500/25 hover:to-yellow-400/15
            // cursor-pointer transition-all duration-300">
            //         <FaGem className="text-yellow-400 text-lg group-hover:scale-110 transition" />
            //         <span>Subscription</span>
            //       </li>

       
          }
        </ul>
      </div>

      {/* ================= WELCOME ================= */}
      <section className="text-center mb-10 mt-10">
        <h2 className="text-3xl font-semibold mb-2">👋 Welcome, Trader!</h2>
        <p className="text-gray-400">
          Monitor your live trades, track profits, and manage your algo bot.
        </p>
      </section>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="bg-[#313336] p-6 rounded-2xl shadow-md flex flex-col items-center">
          {todayProfit > 0 ? (
            <PiChartLineUpBold className="text-green-600 text-3xl mb-3" />
          ) : (
            <PiChartLineDownBold className="text-red-600 text-3xl mb-3" />
          )}
          <h3 className="text-xl font-semibold">Current P/L</h3>
          <p
            className={
              `text-lg mt-2 ` +
              (todayProfit > 0 ? "text-green-600" : "text-red-600")
            }
          >
            ₹ {todayProfit}
          </p>
        </div>

        <div className="bg-[#313336] p-6 rounded-2xl shadow-md flex flex-col items-center">
          <FaRobot className="text-yellow-400 text-3xl mb-3" />
          <h3 className="text-xl font-semibold">Algo Bot Status</h3>
          {status && (
            <p
              className={`text-lg mt-2 ${status === "Active" ? "text-green-400" : "text-red-400"
                }`}
            >
              {status}
            </p>
          )}
        </div>

        <div className="bg-[#313336] p-6 rounded-2xl shadow-md flex flex-col items-center">
          <FaTelegramPlane className="text-blue-400 text-3xl mb-3" />
          <h3 className="text-xl font-semibold">Telegram Connected</h3>
          <p
            className={`text-lg mt-2 ${isTelegramConnected ? "text-green-400" : "text-red-400"
              }`}
          >
            {isTelegramConnected ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {/* ================= CONTROLS ================= */}



      <div className="flex items-center justify-center gap-6 mt-10 flex-nowrap">
        {/* <button
          onClick={() => {
            const next = !isRunning;
            setIsRunning(next);
            loginKotak();
            setStatus(next ? "Active" : "Deactive");
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          {isRunning ? <FaPause /> : <FaPlay />}
          {isRunning ? "pause Algo" : "Start Algo"}
        </button> */}
        <button
          onClick={async () => {
            const next = !isRunning;
            setIsRunning(next);
            setStatus(next ? "Active" : "Deactive");

            if (next) {
              await loginKotak();   // Start Algo → Login → Fetch Trades
            }
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          {isRunning ? <FaPause /> : <FaPlay />}
          {isRunning ? "Pause Algo" : "Start Algo"}
        </button>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          ⚙️ Settings
        </button>

        <button
          onClick={() => {
            window.open("https://t.me/kotak_neo_ai_bot", "_blank");
          }}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition"
        >
          📩 Telegram Connect
        </button>
      </div>
      {/* ================= TODAY TRADES (UNCHANGED) ================= */}

      <div className="mt-12 bg-[#161b22] w-full max-w-5xl rounded-2xl p-6 shadow-md border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            📊 Today Trades
          </h3>
          <span className="text-xs text-white bg-gray-900/50 px-3 py-1 rounded-full">
            {trades.length} trades
          </span>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-800/50 bg-linear-to-br from-gray-900/30 to-black/30 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-gray-900 to-black border-b border-gray-800/50">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                    Time
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                    Symbol
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                    Strike & Type
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                    Action
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                    Quantity
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                    Price
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                          <span className="text-2xl">📭</span>
                        </div>
                        <p className="text-gray-400 text-lg">
                          No trades available Today
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Start trading to see data here
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  trades.map((trade, index) => (
                    <tr
                      key={index}
                      className="group hover:bg-linear-to-r hover:from-gray-800/30 hover:to-gray-900/30 transition-all duration-300 border-b border-gray-800/30 last:border-0"
                    >
                      {/* TIME COLUMN */}
                      <td className="py-4 px-6 text-gray-300 font-mono">
                        {trade.flTm}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-lg group-hover:text-blue-300 transition-colors">
                          {trade.sym}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white">
                            {trade.stkPrc}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${trade.optTp === "CE"
                              ? "bg-green-900 text-green-300 border border-green-700/30"
                              : "bg-red-900/40 text-red-300 border border-red-700/30"
                              }`}
                          >
                            {trade.optTp}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-4 py-2 rounded-lg font-semibold text-sm ${trade.trnsTp === "B"
                            ? "bg-linear-to-r from-green-900/40 to-green-800/30 text-green-300 border border-green-700/30"
                            : "bg-linear-to-r from-red-900/40 to-red-800/30 text-red-300 border border-red-700/30"
                            }`}
                        >
                          {trade.trnsTp === "B" ? "BUY" : "SELL"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="bg-gray-900/50 rounded-lg px-3 py-2 inline-block">
                          <span className="font-mono font-bold">
                            {trade.fldQty}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-white font-bold">
                          ₹{trade.avgPrc}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="bg-linear-to-r from-blue-900/20 to-purple-900/20 rounded-lg px-4 py-3 border border-gray-700/50">
                          <span className="font-bold text-lg">
                            ₹{trade.fldQty * trade.avgPrc}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {trades.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-800/50 bg-linear-to-r from-gray-900/50 to-black/30">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div>
                  Total Value:{" "}
                  <span className="text-white font-bold ml-2">
                    ₹
                    {trades
                      .reduce(
                        (sum, trade) => sum + trade.fldQty * trade.avgPrc,
                        0,
                      )
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  {/* BUYING */}
                  <span className="flex items-center gap-2  text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Buy: ₹{" "}
                    {trades
                      .filter((t) => t.trnsTp === "B")
                      .reduce(
                        (acc, t) => acc + Number(t.avgPrc) * Number(t.fldQty),
                        0,
                      )
                      .toFixed(2)}
                  </span>

                  {/* SELLING */}
                  <span className="flex items-center gap-2 text-white font-bold ">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Sell: ₹{" "}
                    {trades
                      .filter((t) => t.trnsTp === "S")
                      .reduce(
                        (acc, t) => acc + Number(t.avgPrc) * Number(t.fldQty),
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="mt-10 text-gray-500 text-xs">
        © {new Date().getFullYear()} SmartTrade. All Rights Reserved.
      </footer>

      {/* ================= SETTINGS PANEL ================= */}
      {/* <div
        className={`fixed top-0 right-0 h-full w-[420px]
        bg-white/10 backdrop-blur-xl border-l border-white/20
        shadow-2xl z-50
        transform transition-transform duration-500
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-8">
          <h2 className="text-xl font-semibold mb-6">Consumer Details</h2>

          <div className="space-y-4">
            <input className="w-full bg-white/10 border border-white/20 p-2 rounded text-white" placeholder="CONSUMER KEY" />
            <input className="w-full bg-white/10 border border-white/20 p-2 rounded text-white" placeholder="MOBILE NUMBER" />
            <input className="w-full bg-white/10 border border-white/20 p-2 rounded text-white" placeholder="UCC" />
            <input type="password" className="w-full bg-white/10 border border-white/20 p-2 rounded text-white" placeholder="MPIN" />
            <input className="w-full bg-white/10 border border-white/20 p-2 rounded text-white" placeholder="TOTP SECRET" />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setOpen(false)}
              className="w-1/2 border border-white/30 py-2 rounded"
            >
              Back
            </button>
            <button className="w-1/2 bg-white py-2 rounded text-black">
              Submit
            </button>
          </div>
        </div>
      </div> */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px]
      bg-white/10 backdrop-blur-xl border-l border-white/20
      shadow-2xl z-50
      transform transition-transform duration-500
      ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-8">
          <h2 className="text-xl font-semibold mb-6">Consumer Details</h2>

          <div className="space-y-4">
            <input
              name="consumerkey"
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 p-2 rounded text-white"
              placeholder="CONSUMER KEY"
            />

            <input
              name="mobile"
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 p-2 rounded text-white"
              placeholder="MOBILE NUMBER"
            />

            <input
              name="ucc"
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 p-2 rounded text-white"
              placeholder="UCC"
            />

            <input
              type="password"
              name="mpin"
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 p-2 rounded text-white"
              placeholder="MPIN"
            />

            <input
              name="totp"
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 p-2 rounded text-white"
              placeholder="TOTP SECRET"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setOpen(false)}
              className="w-1/2 border border-white/30 py-2 rounded"
            >
              Back
            </button>

            <button
              onClick={handleSubmit}
              className="w-1/2 bg-white py-2 rounded text-black"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

export default Dashboard;
