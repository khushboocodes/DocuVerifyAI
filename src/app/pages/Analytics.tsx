import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Activity, Zap, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Analytics() {
  const [dateRange, setDateRange] = useState("Last 7 Days");

  const analyticsDataByRange = {
    "Last 7 Days": {
      decisionData: [
        { name: "Approved", value: 5, fill: "#10b981" },
        { name: "Flagged", value: 2, fill: "#f59e0b" },
        { name: "Rejected", value: 1, fill: "#ef4444" },
        { name: "Pending", value: 1, fill: "#3b82f6" },
      ],
      documentTypes: [
        { name: "Educational Certificates", value: 35, fill: "#6366f1" },
        { name: "Identity Proofs", value: 28, fill: "#8b5cf6" },
        { name: "Address Documents", value: 20, fill: "#ec4899" },
        { name: "Experience Letters", value: 12, fill: "#14b8a6" },
        { name: "Other", value: 5, fill: "#f59e0b" },
      ],
      systemPerformance: [
        { subject: "OCR Accuracy", value: 90, fullMark: 100 },
        { subject: "Name Match", value: 76, fullMark: 100 },
        { subject: "Doc Quality", value: 85, fullMark: 100 },
        { subject: "Fraud Detection", value: 82, fullMark: 100 },
        { subject: "Speed", value: 88, fullMark: 100 },
        { subject: "Language Support", value: 92, fullMark: 100 },
      ],
      dailyTrend: [
        { day: "Mon", verifications: 65, avgTime: 2.1 },
        { day: "Tue", verifications: 72, avgTime: 2.0 },
        { day: "Wed", verifications: 58, avgTime: 2.3 },
        { day: "Thu", verifications: 81, avgTime: 1.9 },
        { day: "Fri", verifications: 69, avgTime: 2.2 },
        { day: "Sat", verifications: 45, avgTime: 2.4 },
        { day: "Sun", verifications: 52, avgTime: 2.1 },
      ],
      monthlyAccuracy: [
        { month: "Oct", accuracy: 88 },
        { month: "Nov", accuracy: 90 },
        { month: "Dec", accuracy: 92 },
        { month: "Jan", accuracy: 91 },
        { month: "Feb", accuracy: 93 },
        { month: "Mar", accuracy: 94 },
      ],
      confidenceDistribution: [
        { range: "90-100%", count: 5 },
        { range: "80-89%", count: 1 },
        { range: "70-79%", count: 1 },
        { range: "60-69%", count: 0 },
        { range: "50-59%", count: 1 },
        { range: "0-49%", count: 1 },
      ],
    },
    "Last 30 Days": {
      decisionData: [
        { name: "Approved", value: 18, fill: "#10b981" },
        { name: "Flagged", value: 6, fill: "#f59e0b" },
        { name: "Rejected", value: 4, fill: "#ef4444" },
        { name: "Pending", value: 3, fill: "#3b82f6" },
      ],
      documentTypes: [
        { name: "Educational Certificates", value: 120, fill: "#6366f1" },
        { name: "Identity Proofs", value: 92, fill: "#8b5cf6" },
        { name: "Address Documents", value: 68, fill: "#ec4899" },
        { name: "Experience Letters", value: 42, fill: "#14b8a6" },
        { name: "Other", value: 24, fill: "#f59e0b" },
      ],
      systemPerformance: [
        { subject: "OCR Accuracy", value: 91, fullMark: 100 },
        { subject: "Name Match", value: 79, fullMark: 100 },
        { subject: "Doc Quality", value: 86, fullMark: 100 },
        { subject: "Fraud Detection", value: 83, fullMark: 100 },
        { subject: "Speed", value: 89, fullMark: 100 },
        { subject: "Language Support", value: 93, fullMark: 100 },
      ],
      dailyTrend: [
        { day: "Mon", verifications: 82, avgTime: 2.0 },
        { day: "Tue", verifications: 95, avgTime: 1.9 },
        { day: "Wed", verifications: 78, avgTime: 2.1 },
        { day: "Thu", verifications: 92, avgTime: 1.8 },
        { day: "Fri", verifications: 85, avgTime: 2.0 },
        { day: "Sat", verifications: 62, avgTime: 2.3 },
        { day: "Sun", verifications: 71, avgTime: 2.1 },
      ],
      monthlyAccuracy: [
        { month: "Dec", accuracy: 91 },
        { month: "Jan", accuracy: 90 },
        { month: "Feb", accuracy: 92 },
        { month: "Mar", accuracy: 94 },
        { month: "Apr", accuracy: 93 },
        { month: "May", accuracy: 95 },
      ],
      confidenceDistribution: [
        { range: "90-100%", count: 12 },
        { range: "80-89%", count: 5 },
        { range: "70-79%", count: 3 },
        { range: "60-69%", count: 1 },
        { range: "50-59%", count: 2 },
        { range: "0-49%", count: 1 },
      ],
    },
    "Last 90 Days": {
      decisionData: [
        { name: "Approved", value: 50, fill: "#10b981" },
        { name: "Flagged", value: 14, fill: "#f59e0b" },
        { name: "Rejected", value: 8, fill: "#ef4444" },
        { name: "Pending", value: 7, fill: "#3b82f6" },
      ],
      documentTypes: [
        { name: "Educational Certificates", value: 320, fill: "#6366f1" },
        { name: "Identity Proofs", value: 256, fill: "#8b5cf6" },
        { name: "Address Documents", value: 168, fill: "#ec4899" },
        { name: "Experience Letters", value: 92, fill: "#14b8a6" },
        { name: "Other", value: 48, fill: "#f59e0b" },
      ],
      systemPerformance: [
        { subject: "OCR Accuracy", value: 89, fullMark: 100 },
        { subject: "Name Match", value: 78, fullMark: 100 },
        { subject: "Doc Quality", value: 84, fullMark: 100 },
        { subject: "Fraud Detection", value: 81, fullMark: 100 },
        { subject: "Speed", value: 88, fullMark: 100 },
        { subject: "Language Support", value: 91, fullMark: 100 },
      ],
      dailyTrend: [
        { day: "Mon", verifications: 78, avgTime: 2.1 },
        { day: "Tue", verifications: 88, avgTime: 2.0 },
        { day: "Wed", verifications: 64, avgTime: 2.3 },
        { day: "Thu", verifications: 91, avgTime: 2.0 },
        { day: "Fri", verifications: 86, avgTime: 2.2 },
        { day: "Sat", verifications: 69, avgTime: 2.4 },
        { day: "Sun", verifications: 77, avgTime: 2.1 },
      ],
      monthlyAccuracy: [
        { month: "Jan", accuracy: 89 },
        { month: "Feb", accuracy: 90 },
        { month: "Mar", accuracy: 91 },
        { month: "Apr", accuracy: 92 },
        { month: "May", accuracy: 93 },
        { month: "Jun", accuracy: 94 },
      ],
      confidenceDistribution: [
        { range: "90-100%", count: 28 },
        { range: "80-89%", count: 10 },
        { range: "70-79%", count: 6 },
        { range: "60-69%", count: 3 },
        { range: "50-59%", count: 2 },
        { range: "0-49%", count: 3 },
      ],
    },
    "All Time": {
      decisionData: [
        { name: "Approved", value: 110, fill: "#10b981" },
        { name: "Flagged", value: 35, fill: "#f59e0b" },
        { name: "Rejected", value: 20, fill: "#ef4444" },
        { name: "Pending", value: 12, fill: "#3b82f6" },
      ],
      documentTypes: [
        { name: "Educational Certificates", value: 720, fill: "#6366f1" },
        { name: "Identity Proofs", value: 520, fill: "#8b5cf6" },
        { name: "Address Documents", value: 310, fill: "#ec4899" },
        { name: "Experience Letters", value: 175, fill: "#14b8a6" },
        { name: "Other", value: 85, fill: "#f59e0b" },
      ],
      systemPerformance: [
        { subject: "OCR Accuracy", value: 92, fullMark: 100 },
        { subject: "Name Match", value: 80, fullMark: 100 },
        { subject: "Doc Quality", value: 86, fullMark: 100 },
        { subject: "Fraud Detection", value: 84, fullMark: 100 },
        { subject: "Speed", value: 90, fullMark: 100 },
        { subject: "Language Support", value: 93, fullMark: 100 },
      ],
      dailyTrend: [
        { day: "Mon", verifications: 90, avgTime: 2.0 },
        { day: "Tue", verifications: 98, avgTime: 1.9 },
        { day: "Wed", verifications: 85, avgTime: 2.0 },
        { day: "Thu", verifications: 95, avgTime: 1.8 },
        { day: "Fri", verifications: 89, avgTime: 1.9 },
        { day: "Sat", verifications: 72, avgTime: 2.1 },
        { day: "Sun", verifications: 81, avgTime: 2.0 },
      ],
      monthlyAccuracy: [
        { month: "Oct", accuracy: 88 },
        { month: "Nov", accuracy: 90 },
        { month: "Dec", accuracy: 92 },
        { month: "Jan", accuracy: 91 },
        { month: "Feb", accuracy: 93 },
        { month: "Mar", accuracy: 94 },
      ],
      confidenceDistribution: [
        { range: "90-100%", count: 45 },
        { range: "80-89%", count: 18 },
        { range: "70-79%", count: 12 },
        { range: "60-69%", count: 6 },
        { range: "50-59%", count: 4 },
        { range: "0-49%", count: 5 },
      ],
    },
  };

  const {
    decisionData,
    documentTypes,
    systemPerformance,
    dailyTrend,
    monthlyAccuracy,
    confidenceDistribution,
  } = analyticsDataByRange[dateRange] || analyticsDataByRange["Last 7 Days"];

  const languageData = [
    { lang: "English", value: 54, fill: "#6366f1" },
    { lang: "Spanish", value: 18, fill: "#8b5cf6" },
    { lang: "French", value: 9, fill: "#ec4899" },
    { lang: "Arabic", value: 11, fill: "#14b8a6" },
    { lang: "Other", value: 8, fill: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">ML pipeline performance metrics and system insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600 ml-auto" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">90%</div>
          <div className="text-sm text-gray-600 mb-2">OCR Accuracy</div>
          <div className="text-xs text-gray-500">Character Recognition Rate</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600 ml-auto" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">76%</div>
          <div className="text-sm text-gray-600 mb-2">Match Accuracy</div>
          <div className="text-xs text-gray-500">Precision/Recall Score</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
          <div className="text-sm text-gray-600 mb-2">Fraud Detected</div>
          <div className="text-xs text-gray-500">Out of 9 documents</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">2099ms</div>
          <div className="text-sm text-gray-600 mb-2">Avg Processing</div>
          <div className="text-xs text-gray-500">Target: &lt;3000ms</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Decision Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Decision Distribution
            </h3>
            <span className="text-sm text-gray-600">9 Total</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={decisionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
                key="decision-pie"
              >
                {decisionData.map((entry, index) => (
                  <Cell key={`decision-cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Document Types */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Document Types Processed
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={documentTypes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} key="doctype-bar">
                {documentTypes.map((entry, index) => (
                  <Cell key={`doctype-cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* System Performance Radar */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            System Performance Metrics
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={systemPerformance}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Radar name="Performance" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} strokeWidth={2} key="performance-radar" />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Language Detection */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Language Distribution
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={languageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="lang" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} key="language-bar">
                {languageData.map((entry, index) => (
                  <Cell key={`language-cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Daily Verification Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6">Daily Verification Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="verifications" stroke="#6366f1" strokeWidth={3} name="Verifications" key="verifications-line" />
              <Line yAxisId="right" type="monotone" dataKey="avgTime" stroke="#10b981" strokeWidth={3} name="Avg Time (s)" key="avgtime-line" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Confidence Score Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6">Confidence Score Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={confidenceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} key="confidence-bar" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accuracy Trend */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-6">Monthly Accuracy Improvement</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={monthlyAccuracy}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis domain={[85, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} key="accuracy-line" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Evaluation Metrics */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">AI Model Evaluation Metrics</h3>
          <span className="text-sm text-gray-600">Target: 99.7% Overall Accuracy</span>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">OCR ACCURACY (CHAR)</span>
              <span className="text-sm font-bold text-gray-900">90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
              <div className="bg-orange-500 h-3 rounded-full relative" style={{ width: "90%" }}>
                <span className="absolute right-0 top-0 h-full w-1 bg-orange-700"></span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Target: 98%</span>
              <span className="text-orange-600 font-medium">-8%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">NER F1-SCORE</span>
              <span className="text-sm font-bold text-gray-900">81%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
              <div className="bg-orange-500 h-3 rounded-full relative" style={{ width: "81%" }}>
                <span className="absolute right-0 top-0 h-full w-1 bg-orange-700"></span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Target: 90%</span>
              <span className="text-orange-600 font-medium">-9%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">MATCHING PRECISION</span>
              <span className="text-sm font-bold text-gray-900">76%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
              <div className="bg-orange-500 h-3 rounded-full relative" style={{ width: "76%" }}>
                <span className="absolute right-0 top-0 h-full w-1 bg-orange-700"></span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Target: 87%</span>
              <span className="text-orange-600 font-medium">-11%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">FRAUD RECALL (AP)</span>
              <span className="text-sm font-bold text-gray-900">95%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
              <div className="bg-green-500 h-3 rounded-full relative" style={{ width: "95%" }}>
                <span className="absolute right-0 top-0 h-full w-1 bg-green-700"></span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Target: 95%</span>
              <span className="text-green-600 font-medium">✓ Met</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <div className="font-semibold mb-1">Performance Improvement Needed</div>
            <div>OCR, NER, and Matching metrics are below target thresholds. Consider retraining models with additional data or adjusting confidence thresholds.</div>
          </div>
        </div>
      </div>
    </div>
  );
}