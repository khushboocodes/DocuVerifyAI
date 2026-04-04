import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { LayoutGrid, Users, Upload, QrCode, FileText, BarChart3, Sparkles, User } from "lucide-react";
import Chatbot from "./Chatbot";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutGrid, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Applicants", path: "/dashboard/applicants" },
    { icon: Upload, label: "Upload", path: "/dashboard/upload" },
    { icon: QrCode, label: "QR Verify", path: "/dashboard/qr-verify" },
    { icon: FileText, label: "Reports", path: "/dashboard/reports" },
    { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1d2e] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold">DocuVerify AI</div>
            <div className="text-xs text-gray-400">VERIFICATION PLATFORM</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive(item.path) && (
                <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* AI Engine Status */}
        <div className="px-6 py-4 border-t border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium">AI Engine Active</span>
          </div>
          <div className="text-xs text-gray-400">v2.4 • 99.7% accuracy</div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="flex items-center gap-3 w-full hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">Tanushka Tomar</div>
              <div className="text-xs text-gray-400">Admin</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">System Online</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
}