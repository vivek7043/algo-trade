import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaUser,
  FaShieldAlt,
  FaWallet,
  FaGem,
  FaExchangeAlt,
  FaChartLine,



  FaCopy, FaEdit, FaSave, FaTimes
} from "react-icons/fa";

import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";




// Mock data - in real app, this would come from API
const mockData = {
  user: {
    name: "Utsav Trader",
    email: "utsav@trader.com",
    userId: "ALGO-UTSAV-7821",
    status: "active",
    joinDate: "15 Mar 2024",
    lastLogin: "Today, 10:45 AM",
    tier: "pro",
  },
  
  
  subscription: {
    plan: "PRO",
    validTill: "30 Sep 2025",
    price: 2999,
    features: ["Unlimited Strategies", "10 Broker Connections", "Priority Support", "Advanced Analytics"],
    renewal: "auto",
  },
  
  trading: {
    activeStrategies: 4,
    totalTrades: 1287,
    winRate: "30.5%",
    avgProfit: "₹2,450",
    pnl: "+₹1,87,500",
  },
};

type Trade = {
  sym: string;
  stkPrc: number;
  optTp: string;
  trnsTp: "B" | "S";
  fldQty: number;
  avgPrc: number;
  flTm: string;
};
export default function AccountPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  
  const [trades, setTrades] = useState<Trade[]>([]);
  const [todayProfit, setTodayProfit] = useState(0);
  const [funds, setFunds] = useState({
    cash: 0,
    pledge_cash: 0,
    used: 0,
    total: 0
  });


  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:8000/kotak/balance")
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") {
            setFunds(data.data);
          }
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);


  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.user_id;

    fetch(`http://localhost:8000/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });

  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    // 🔐 Backend API call અહીં આવશે
    setIsEditing(false);
  };

  const TabButton = ({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === id
        ? "bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white"
        : "hover:bg-white/5 text-gray-400 hover:text-white"
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  useEffect(() => {
    getTrades();
  }, []);

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


  return (
    <>
      <p
        onClick={() => navigate("/dashboard")}
        className="fixed top-4 left-4 z-50 text-gray-100 cursor-pointer hover:underline "
      >
        <BiArrowBack size={30} />
      </p>
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-black text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Account Dashboard
                </h1>
                <p className="text-gray-400 mt-2">
                  Manage your trading account, strategies, and security settings
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                  
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    {/* <p className="text-xs text-gray-400">{mockData.user.tier.toUpperCase()} Tier</p> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-5xl mx-auto px-1">
              {/* <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Strategies</p>
                  <p className="text-2xl font-bold">{mockData.trading.activeStrategies}</p>
                </div>
                <FaChartLine className="text-blue-400 text-2xl" />
              </div>
            </div> */}
              {/* <div className="bg-linear-to-br from-green-900/30 to-green-900/10 border border-green-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total P&L</p>
                    <p className="text-2xl font-bold text-green-400"> <p
            className={
              `text-lg mt-2 ` +
              (todayProfit > 0 ? "text-green-600" : "text-red-600")
            }
          >
            ₹ {todayProfit}
          </p></p>
                  </div>
                  <FaWallet className="text-green-400 text-2xl" />
                </div>
              </div> */}
              <div className="bg-linear-to-br from-green-900/30 to-green-900/10 border border-green-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total P&L</p>

                    <p
                      className={`text-2xl font-bold mt-1 ${todayProfit > 0 ? "text-green-400" : "text-red-400"
                        }`}
                    >
                      ₹ {todayProfit.toFixed(2)}
                    </p>
                  </div>

                  <FaWallet className="text-green-400 text-2xl" />
                </div>
              </div>
              <div className="bg-linear-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Win Rate</p>
                    <p className="text-2xl font-bold">{mockData.trading.winRate}</p>
                  </div>
                  <FaGem className="text-purple-400 text-2xl" />
                </div>
              </div>
              <div className="bg-linear-to-br from-orange-900/30 to-orange-900/10 border border-orange-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Broker Status</p>
                    <p className="text-2xl font-bold text-green-400">Live</p>
                  </div>
                  <FaShieldAlt className="text-orange-400 text-2xl" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sticky top-6">
                <nav className="space-y-2">
                  <TabButton id="overview" label="Overview" icon={<FaUser />} />
                 
                  <TabButton id="funds" label="Funds & Margin" icon={<FaWallet />} />
                  <TabButton id="subscription" label="Subscription" icon={<FaGem />} />


                </nav>

              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <>
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h2 className="flex items-center gap-2 text-xl font-semibold mb-6">
                      <FaUser className="text-blue-400" />
                      Account Overview
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-gray-400 text-sm">Full Name</label>
                          <p className="font-semibold text-lg">{user?.name}</p>
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm">Email Address</label>
                          <p className="font-semibold">{user?.email}</p>
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm">Member Since</label>
                          <p className="font-semibold"> {user?.created_at
                            ? new Date(user.created_at).toDateString()
                            : "Loading..."}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-gray-400 text-sm">Account Status</label>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="font-semibold text-green-400">Active & Trading</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm">Last Login</label>
                          <p className="font-semibold">  {user?.last_login
                            ? new Date(user.last_login).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                            : "First Login"}</p>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 ml-60">
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                      <h3 className="flex items-center gap-2 font-semibold mb-4">
                        <FaChartLine className="text-green-400" />
                        Trading Performance
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Trades</span>
                          <span className="font-semibold"><p
                          // className={`text-2xl font-bold ${}
                          //   }`}
                          >
                            {trades.length}
                          </p></span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Win Rate</span>
                          <span className="font-semibold text-green-400">{mockData.trading.winRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Avg Profit/Trade</span>
                          <span className="font-semibold">{todayProfit}</span>
                        </div>

                      </div>
                    </div>


                  </div>
                </>
              )}

            
              {/* Funds Tab */}
              {activeTab === "funds" && (
                <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mt-16">
                  <h2 className="flex items-center gap-2 text-xl font-semibold mb-6">
                    <FaWallet className="text-green-400" />
                    Funds & Margin
                  </h2>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-linear-to-br from-green-900/30 to-green-900/10 border border-green-500/20 rounded-2xl p-5">
                      <p className="text-gray-400 text-sm mb-2">Used Margin</p>
                      <p className="text-3xl font-bold">₹{Math.abs(funds.used).toLocaleString()}</p>
                     
                    </div>

                    <div className="bg-linear-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/20 rounded-2xl p-5">
                      <p className="text-gray-400 text-sm mb-2">Available Cash</p>
                      <p className="text-3xl font-bold">₹{funds.cash.toLocaleString()}</p>
                     
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-400 text-sm mb-2">Available Balance</p>
                          <p className={`text-3xl font-bold text-white`}>
                           ₹{Number(funds.total).toFixed(2)}
                            
                          </p>
                        </div>
                        

                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === "subscription" && (
                <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <FaGem className="text-yellow-400" />
                      Subscription Plan
                    </h2>
                    <div className="px-3 py-1 bg-linear-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg">
                      <span className="font-semibold">Current: {mockData.subscription.plan}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="border border-white/10 rounded-2xl p-5">
                      <h3 className="font-semibold mb-2">BASIC</h3>
                      <p className="text-3xl font-bold mb-4">₹999<span className="text-sm text-gray-400">/month</span></p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li>• 5 Active Strategies</li>
                        <li>• 1 Broker Connection</li>
                        <li>• Email Support</li>
                        <li>• Basic Analytics</li>
                      </ul>
                      <button className="w-full mt-6 py-2 rounded-lg border border-white/20 hover:bg-white/10">
                        Downgrade
                      </button>
                    </div>

                    <div className="border-2 border-yellow-500 bg-linear-to-br from-yellow-900/20 to-transparent rounded-2xl p-5 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-3 py-1 bg-linear-to-br from-yellow-500 to-yellow-600 text-black text-xs font-bold rounded-full">
                          RECOMMENDED
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2">PRO</h3>
                      <p className="text-3xl font-bold mb-4">₹2,999<span className="text-sm text-gray-400">/month</span></p>
                      <ul className="space-y-2 text-sm">
                        <li>• Unlimited Strategies</li>
                        <li>• 10 Broker Connections</li>
                        <li>• Priority Support</li>
                        <li>• Advanced Analytics</li>
                        <li>• Webhook Support</li>
                      </ul>
                      <button className="w-full mt-6 py-2 bg-linear-to-br from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700">
                        Current Plan
                      </button>
                    </div>

                    <div className="border border-white/10 rounded-2xl p-5">
                      <h3 className="font-semibold mb-2">ENTERPRISE</h3>
                      <p className="text-3xl font-bold mb-4">Custom</p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li>• Everything in Pro</li>
                        <li>• Custom Solutions</li>
                        <li>• Dedicated Support</li>
                        <li>• White Label</li>
                        <li>• SLA Guarantee</li>
                      </ul>
                      <button className="w-full mt-6 py-2 bg-linear-to-br from-purple-600 to-purple-700 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800">
                        Contact Sales
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-semibold mb-4">Billing Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Next Billing Date</p>
                        <p className="font-semibold">{mockData.subscription.validTill}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Renewal Type</p>
                        <p className="font-semibold">{mockData.subscription.renewal === "auto" ? "Automatic" : "Manual"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}


            </div>
          </div>
        </div>
      </div>
    </>
  );
}