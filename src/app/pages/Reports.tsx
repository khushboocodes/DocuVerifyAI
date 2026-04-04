import { Search, Eye, Download, CheckCircle, XCircle, AlertTriangle, FileText, TrendingUp } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useData } from "../context/DataContext";

export default function Reports() {
  const navigate = useNavigate();
  const { applicants } = useData();
  const [filterStatus, setFilterStatus] = useState("All");
  const [dateRange, setDateRange] = useState("All Time");
  const [searchTerm, setSearchTerm] = useState("");

  const parseDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const getRangeStart = (range: string) => {
    const now = new Date();
    switch (range) {
      case "Last 7 Days":
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      case "Last 30 Days":
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      case "Last 90 Days":
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
      default:
        return new Date(0);
    }
  };

  const filteredReports = useMemo(() => {
    const rangeStart = getRangeStart(dateRange);

    let filtered = applicants.filter((applicant) => {
      if (dateRange !== "All Time") {
        const applicantDate = parseDate(applicant.date);
        if (applicantDate < rangeStart) {
          return false;
        }
      }
      return true;
    });

    if (filterStatus !== "All") {
      filtered = filtered.filter(a => a.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [applicants, filterStatus, searchTerm, dateRange]);

  const exportAllReports = () => {
    const csv = [
      ["Name", "ID", "Position", "Status", "Confidence", "Risk", "Documents", "Date", "Time", "Processing Time", "Verified By"],
      ...filteredReports.map(r => [
        r.name,
        r.id,
        r.position,
        r.status,
        `${r.confidence}%`,
        r.risk,
        r.docs,
        r.date,
        r.time,
        r.processingTime,
        r.verifiedBy
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const downloadPDF = (report: any) => {
    // Simulate PDF download
    const content = `
      VERIFICATION REPORT
      
      Applicant: ${report.name}
      Application ID: ${report.id}
      Position: ${report.position}
      Status: ${report.status}
      Confidence: ${report.confidence}%
      Risk Score: ${report.risk}
      Documents: ${report.docs}
      Date: ${report.date} at ${report.time}
      Processing Time: ${report.processingTime}
      Verified By: ${report.verifiedBy}
    `;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${report.id}.txt`;
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
        return <CheckCircle className="w-4 h-4" />;
      case "Flagged":
        return <AlertTriangle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const stats = {
    total: applicants.length,
    approved: applicants.filter(r => r.status === "Approved").length,
    flagged: applicants.filter(r => r.status === "Flagged").length,
    rejected: applicants.filter(r => r.status === "Rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verification Reports</h1>
          <p className="text-gray-600 mt-1">Complete audit trail of all verification decisions</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportAllReports}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600 ml-auto" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Reports</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-1">{stats.flagged}</div>
          <div className="text-sm text-gray-600">Flagged</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by name, ID, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
          >
            <option>All</option>
            <option>Approved</option>
            <option>Flagged</option>
            <option>Rejected</option>
            <option>Pending</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
          >
            <option>All Time</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-6">
              {/* Icon */}
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-indigo-600" />
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{report.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                      {report.confidence > 0 && (
                        <span className="text-sm text-gray-600">
                          Score: <span className="font-semibold text-gray-900">{report.confidence}%</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="font-mono font-medium text-gray-900">{report.id}</span>
                      <span>•</span>
                      <span>{report.position}</span>
                      <span>•</span>
                      <span>{report.date} at {report.time}</span>
                    </div>
                  </div>
                </div>

                {/* Report Details */}
                <div className="grid grid-cols-4 gap-6 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Documents</div>
                    <div className="font-semibold text-gray-900">{report.docs}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Risk Score</div>
                    <div className="font-semibold text-gray-900">{report.risk}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Processing Time</div>
                    <div className="font-semibold text-gray-900">{report.processingTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Verified By</div>
                    <div className="font-semibold text-gray-900 text-xs">{report.verifiedBy}</div>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mb-4">
                  {report.status === "Approved" && (
                    <>Automated verification complete. {report.docs} documents verified successfully. Overall confidence: {report.confidence}%. No discrepancies found.</>
                  )}
                  {report.status === "Flagged" && (
                    <>Verification flagged for manual review. {report.docs} documents processed. Confidence: {report.confidence}%. Requires human verification.</>
                  )}
                  {report.status === "Rejected" && (
                    <>Verification failed. {report.docs} documents submitted but critical issues found. Confidence: {report.confidence}%. Multiple discrepancies detected.</>
                  )}
                  {report.status === "Pending" && (
                    <>Verification pending. Documents are being uploaded. Processing will begin once all required documents are submitted.</>
                  )}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate(`/dashboard/applicant/${report.id}`)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm px-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Report
                  </button>
                  <button 
                    onClick={() => downloadPDF(report)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium text-sm px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  {report.status === "Flagged" && (
                    <button 
                      onClick={() => navigate(`/dashboard/applicant/${report.id}`)}
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm px-4 py-2 hover:bg-orange-50 rounded-lg transition-colors ml-auto"
                    >
                      Review Now →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-6 py-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">1-{filteredReports.length}</span> of <span className="font-semibold">{applicants.length}</span> reports
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
  );
}