import { Zap, CheckCircle, XCircle, TrendingUp, Clock, Shield, Users, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useNavigate } from "react-router";
import { useData } from "../context/DataContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { applicants } = useData();

  const weeklyData = [
    { day: "Mon", approved: 45, flagged: 12, rejected: 3 },
    { day: "Tue", approved: 52, flagged: 8, rejected: 5 },
    { day: "Wed", approved: 38, flagged: 15, rejected: 2 },
    { day: "Thu", approved: 61, flagged: 10, rejected: 4 },
    { day: "Fri", approved: 48, flagged: 14, rejected: 6 },
    { day: "Sat", approved: 35, flagged: 9, rejected: 3 },
    { day: "Sun", approved: 42, flagged: 11, rejected: 2 },
  ];

  const processingTrend = [
    { time: "00:00", time_ms: 2100 },
    { time: "04:00", time_ms: 1950 },
    { time: "08:00", time_ms: 2200 },
    { time: "12:00", time_ms: 2099 },
    { time: "16:00", time_ms: 2150 },
    { time: "20:00", time_ms: 2050 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">AI-powered document verification overview</p>
        </div>
        <button 
          onClick={() => navigate("/dashboard/upload")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
        >
          <Zap className="w-5 h-5" />
          New Verification
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{applicants.length}</div>
          <div className="text-sm text-gray-600">Total Applicants</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{applicants.filter(a => a.status === "Approved").length}</div>
          <div className="text-sm text-gray-600 mb-2">Approved</div>
          <div className="text-xs text-gray-500">{((applicants.filter(a => a.status === "Approved").length / applicants.length) * 100).toFixed(0)}% approval rate</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{applicants.filter(a => a.status === "Flagged").length}</div>
          <div className="text-sm text-gray-600">Flagged for Review</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">2099ms</div>
          <div className="text-sm text-gray-600 mb-2">Avg Processing</div>
          <div className="text-xs text-gray-500">Target: &lt;3000ms</div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 mb-4">
          <Shield className="w-6 h-6" />
          <span className="font-semibold uppercase text-sm tracking-wide">The Problem We Solve</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">India's Document Verification Crisis</h2>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          Large-scale recruitment drives process thousands of applications with supporting documents in various formats and languages. Manual verification is time-consuming, error-prone, and creates massive bottlenecks — affecting <span className="font-semibold">500+ recruitment bodies</span> and <span className="font-semibold">10+ million applicants</span> annually.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
            <div className="font-semibold text-gray-900">Recruitment Bodies</div>
            <div className="text-sm text-gray-600">annually in India</div>
          </div>
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="text-4xl font-bold text-purple-600 mb-2">10M+</div>
            <div className="font-semibold text-gray-900">Applicants Affected</div>
            <div className="text-sm text-gray-600">per year</div>
          </div>
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="text-4xl font-bold text-red-600 mb-2">5-7%</div>
            <div className="font-semibold text-gray-900">Error Rate (Manual)</div>
            <div className="text-sm text-gray-600">human errors</div>
          </div>
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="text-4xl font-bold text-green-600 mb-2">99.7%</div>
            <div className="font-semibold text-gray-900">AI Accuracy</div>
            <div className="text-sm text-gray-600">our system</div>
          </div>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-6">
          {/* Without DocuVerify */}
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <div className="flex items-center gap-2 text-red-600 font-semibold mb-4">
              <XCircle className="w-5 h-5" />
              WITHOUT DOCUVERIFY AI
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                <span>500 positions → 50,000 applications → 5-8 docs each</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                <span>30 minutes manual review per application</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5 font-bold">��</span>
                <span>25,000+ human hours required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                <span>20+ personnel needed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                <span>2-3 months delay in results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                <span>5-7% error rate in verification</span>
              </li>
            </ul>
          </div>

          {/* With DocuVerify */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-2 text-green-600 font-semibold mb-4">
              <CheckCircle className="w-5 h-5" />
              WITH DOCUVERIFY AI
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 font-bold">✓</span>
                <span>Same 50,000 applications processed automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 font-bold">✓</span>
                <span>3 seconds per application (600× faster)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 font-bold">✓</span>
                <span>Hindi + 11 regional languages supported</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 font-bold">✓</span>
                <span>Handles blurred, tilted, low-quality scans</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 font-bold">✓</span>
                <span>Name variation detection (राजेश कुमार = Rajesh Kumar)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 font-bold">✓</span>
                <span>99.7% accuracy with AI fraud detection</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Who We Serve */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-6 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Who We Serve
        </h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Verification Officers</h4>
            <p className="text-sm text-gray-600">500+ recruitment boards</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">HR Teams</h4>
            <p className="text-sm text-gray-600">Govt depts, PSUs, institutions</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="w-8 h-8 text-pink-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Admin Personnel</h4>
            <p className="text-sm text-gray-600">Managing workflows</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">10M+ Applicants</h4>
            <p className="text-sm text-gray-600">70% prefer regional languages</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Weekly Verification Trends */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Weekly Verification Trends
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="flagged" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-600">Flagged</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Rejected</span>
            </div>
          </div>
        </div>

        {/* Processing Time Trend */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Processing Time Trend (24h)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={processingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" />
              <YAxis domain={[1800, 2300]} />
              <Tooltip />
              <Line type="monotone" dataKey="time_ms" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Average: 2099ms • Target: &lt;3000ms</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Tanushka Tomar approved</div>
              <div className="text-sm text-gray-600">96% confidence • 2 minutes ago</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Rajesh Kumar Singh approved</div>
              <div className="text-sm text-gray-600">97% confidence • 15 minutes ago</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">अमित शर्मा flagged for review</div>
              <div className="text-sm text-gray-600">78% confidence • 32 minutes ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}