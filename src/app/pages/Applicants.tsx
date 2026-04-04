import { Search, Filter, ArrowUpDown, Eye, Download, MoreVertical, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useData } from "../context/DataContext";

export default function Applicants() {
  const navigate = useNavigate();
  const { applicants } = useData();
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [sortBy, setSortBy] = useState("Newest First");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAndSortedApplicants = useMemo(() => {
    let filtered = applicants;

    // Filter by status
    if (selectedStatus !== "All Status") {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    let sorted = [...filtered];
    switch (sortBy) {
      case "Oldest First":
        sorted.reverse();
        break;
      case "Highest Confidence":
        sorted.sort((a, b) => b.confidence - a.confidence);
        break;
      case "Lowest Confidence":
        sorted.sort((a, b) => a.confidence - b.confidence);
        break;
      case "Name (A-Z)":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // Newest First
        break;
    }

    return sorted;
  }, [applicants, selectedStatus, searchTerm, sortBy]);

  const exportData = () => {
    const csv = [
      ["Name", "ID", "Status", "Confidence", "Risk", "Documents", "Date", "Email"],
      ...filteredAndSortedApplicants.map(a => [
        a.name,
        a.id,
        a.status,
        `${a.confidence}%`,
        a.risk,
        a.docs,
        a.date,
        a.email
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applicants-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Flagged":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "Pending":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "Flagged":
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case "Rejected":
        return <XCircle className="w-3.5 h-3.5" />;
      case "Pending":
        return <Clock className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const getRiskColor = (risk: string) => {
    const value = parseInt(risk);
    if (value === 0) return "text-green-600 bg-green-50 border-green-200";
    if (value < 10) return "text-green-600 bg-green-50 border-green-200";
    if (value < 30) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const statusCounts = {
    all: applicants.length,
    approved: applicants.filter(a => a.status === "Approved").length,
    flagged: applicants.filter(a => a.status === "Flagged").length,
    rejected: applicants.filter(a => a.status === "Rejected").length,
    pending: applicants.filter(a => a.status === "Pending").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-600 mt-1">Manage and review all verification requests</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportData}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => navigate("/dashboard/upload")}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            + New Applicant
          </button>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 border-2 border-indigo-200 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Total</div>
          <div className="text-3xl font-bold text-gray-900">{statusCounts.all}</div>
          <div className="text-xs text-gray-500 mt-1">All applicants</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Approved
          </div>
          <div className="text-3xl font-bold text-green-600">{statusCounts.approved}</div>
          <div className="text-xs text-gray-500 mt-1">{((statusCounts.approved / statusCounts.all) * 100).toFixed(0)}% of total</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            Flagged
          </div>
          <div className="text-3xl font-bold text-orange-600">{statusCounts.flagged}</div>
          <div className="text-xs text-gray-500 mt-1">Need review</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            Rejected
          </div>
          <div className="text-3xl font-bold text-red-600">{statusCounts.rejected}</div>
          <div className="text-xs text-gray-500 mt-1">Failed verification</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Pending
          </div>
          <div className="text-3xl font-bold text-blue-600">{statusCounts.pending}</div>
          <div className="text-xs text-gray-500 mt-1">In queue</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition cursor-pointer"
          >
            <option>All Status</option>
            <option>Approved</option>
            <option>Flagged</option>
            <option>Rejected</option>
            <option>Pending</option>
          </select>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition cursor-pointer"
          >
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Highest Confidence</option>
            <option>Lowest Confidence</option>
            <option>Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    Applicant
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </div>
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Application ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Confidence</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Risk Score</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Documents</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Language</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedApplicants.map((applicant, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-semibold text-indigo-700">
                        {applicant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{applicant.name}</div>
                        <div className="text-sm text-gray-600">{applicant.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-gray-900">{applicant.id}</div>
                    <div className="text-xs text-gray-500">{applicant.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                        applicant.status
                      )}`}
                    >
                      {getStatusIcon(applicant.status)}
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div
                          className={`h-2 rounded-full ${
                            applicant.confidence >= 90 ? "bg-green-500" :
                            applicant.confidence >= 75 ? "bg-orange-500" :
                            applicant.confidence >= 50 ? "bg-red-500" :
                            "bg-gray-400"
                          }`}
                          style={{ width: `${applicant.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 min-w-[45px]">
                        {applicant.confidence > 0 ? `${applicant.confidence}%` : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getRiskColor(applicant.risk)}`}>
                      {applicant.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{applicant.docs}</div>
                    <div className="text-xs text-gray-500">Verified</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{applicant.language}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/dashboard/applicant/${applicant.id}`)}
                        className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-semibold text-sm px-3 py-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button 
                        onClick={() => navigate(`/dashboard/qr-verify?applicationId=${applicant.id}`)}
                        className="flex items-center gap-1.5 text-green-600 hover:text-green-700 font-semibold text-sm px-3 py-1.5 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verify
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">1-{filteredAndSortedApplicants.length}</span> of <span className="font-semibold">{applicants.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Previous
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}