import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

type Trade = {
  sym: string;
  stkPrc: number;
  optTp: string;
  trnsTp: "B" | "S";
  fldQty: number;
  avgPrc: number;
  flTm: string;
};

function Todaytrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://127.0.0.1:8000/kotak/trades")
      .then((res) => res.json())
      .then((data) => {
        const tradeData = Array.isArray(data) ? data : [];
        setTrades(tradeData);
      });
  }, []);

  return (
    /* 🔥 FULL PAGE WRAPPER */
    <>
    <div>
            <p
                onClick={() => navigate("/dashboard")}
              className="fixed top-4 left-4 z-50 text-gray-100 cursor-pointer hover:underline "
              >
               <BiArrowBack size={30} />
              </p>
          </div>
    <div className="min-h-screen w-full bg-[#0a0c10] px-6 py-8">
      {/* 🔥 MAIN CONTENT (NO WIDTH LIMIT) */}
      <div className="w-full max-w-none rounded-3xl p-8 shadow-2xl border border-gray-900/50 backdrop-blur-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Today's Trades</h3>
              <p className="text-sm text-gray-400 mt-1">
                Real-time trading activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-900 to-black border border-gray-800">
              <span className="text-white font-bold">{trades.length}</span>
              <span className="text-gray-400 ml-2">trades</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Live</span>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900/40 to-black/40 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
                  {["Time","Symbol","Strike & Type","Action","Quantity","Price","Total"].map((h) => (
                    <th
                      key={h}
                      className="py-5 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl mb-4">📭</span>
                        <p className="text-gray-300 text-xl font-semibold">
                          No trades available today
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
                      className="group hover:bg-gradient-to-r hover:from-gray-800/40 hover:to-black/20 transition-all border-b border-gray-800/30 last:border-0"
                    >
                      <td className="py-5 px-6 font-mono text-white font-bold">
                        {trade.flTm}
                      </td>

                      <td className="py-5 px-6 font-bold text-xl text-white">
                        {trade.sym}
                      </td>

                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white">
                            {trade.stkPrc}
                          </span>
                          <span
                            className={`px-4 py-2 rounded-lg font-bold text-sm ${
                              trade.optTp === "CE"
                                ? "bg-green-900/40 text-green-300"
                                : "bg-red-900/40 text-red-300"
                            }`}
                          >
                            {trade.optTp}
                          </span>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <span
                          className={`px-5 py-2 rounded-xl font-bold ${
                            trade.trnsTp === "B"
                              ? "bg-green-600/20 text-green-300"
                              : "bg-red-600/20 text-red-300"
                          }`}
                        >
                          {trade.trnsTp === "B" ? "BUY" : "SELL"}
                        </span>
                      </td>

                      <td className="py-5 px-6 font-mono font-bold text-white">
                        {trade.fldQty}
                      </td>

                      <td className="py-5 px-6 font-bold text-white">
                        ₹{trade.avgPrc}
                      </td>

                      <td className="py-5 px-6 font-bold text-white">
                        ₹{(trade.fldQty * trade.avgPrc).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER TOTALS */}
          {trades.length > 0 && (
            <div className="px-8 py-6 border-t border-gray-800 bg-gradient-to-r from-gray-900/60 to-black/40 flex justify-between">
              <span className="text-gray-400">
                Total Value:
                <span className="text-white font-bold ml-2">
                  ₹
                  {trades
                    .reduce(
                      (sum, t) => sum + t.fldQty * t.avgPrc,
                      0
                    )
                    .toLocaleString()}
                </span>
              </span>
 
             <span className="flex items-center gap-2  text-white font-bold ml-190">
                    <span className="w-2 h-2 rounded-full bg-green-500" ></span>
                    Buy: ₹ {
                      trades
                        .filter(t => t.trnsTp === "B")
                        .reduce(
                          (acc, t) => acc + Number(t.avgPrc) * Number(t.fldQty),
                          0
                        )
                        .toFixed(2)
                    }
                  </span>

                  {/* SELLING */}
                  <span className="flex items-center gap-2 text-white font-bold ">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Sell: ₹ {trades.filter(t => t.trnsTp === "S").reduce((acc, t) => acc + Number(t.avgPrc) * Number(t.fldQty),0).toFixed(2)
                    }
                  </span>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Todaytrades;
