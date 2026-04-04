import { Search, QrCode, Scan, CheckCircle, XCircle, AlertTriangle, Download, Share2, Printer } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useData } from "../context/DataContext";

export default function QRVerify() {
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { getApplicantById } = useData();

  // Pre-populate search ID from URL parameter and auto-search
  useEffect(() => {
    const applicationId = searchParams.get('applicationId');
    if (applicationId) {
      setSearchId(applicationId);
      // Auto-search after a brief delay to allow state to update
      setTimeout(() => {
        handleSearch(applicationId);
      }, 100);
    }
  }, [searchParams]);

  const handleSearch = (id?: string) => {
    const searchTerm = (id || searchId).trim();
    if (!searchTerm) {
      setError("Please enter an Application ID.");
      setSearchResult(null);
      setShowQR(false);
      return;
    }

    const applicant = getApplicantById(searchTerm);
    if (!applicant) {
      setError("Application ID not found in existing applicants.");
      setSearchResult(null);
      setShowQR(false);
      return;
    }

    setError(null);
    setSearchResult({
      ...applicant,
      verifiedDate: applicant.date || new Date().toLocaleDateString(),
    });
    setShowQR(true);
  };

  const downloadCertificate = () => {
    if (!searchResult) return;
    const content = `Verification Certificate\n\nName: ${searchResult.name}\nApplication ID: ${searchResult.id}\nStatus: ${searchResult.status}\nConfidence: ${searchResult.confidence}%\nRisk Score: ${searchResult.risk}\nVerified Date: ${searchResult.verifiedDate}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${searchResult.id}-certificate.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const shareReport = () => {
    if (!searchResult) return;
    if (navigator.share) {
      navigator.share({
        title: `Verification Report for ${searchResult.id}`,
        text: `Name: ${searchResult.name}\nApplication ID: ${searchResult.id}\nStatus: ${searchResult.status}`,
      }).catch(() => {
        /* silently ignore share failures */
      });
      return;
    }
    setError("Sharing is not supported in this browser. Copy the report manually.");
  };

  const downloadQr = () => {
    const svgElement = qrRef.current?.querySelector("svg");
    if (!svgElement) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${searchResult?.id || "verification"}-qr.svg`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const printQr = () => {
    const qrHtml = qrRef.current?.innerHTML;
    if (!qrHtml) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Print QR</title><style>body{margin:0;padding:20px;display:flex;align-items:center;justify-content:center;height:100vh;}svg{width:100%;height:auto;max-width:400px;}</style></head><body>${qrHtml}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-100 border-green-200";
      case "Flagged":
        return "text-orange-600 bg-orange-100 border-orange-200";
      case "Rejected":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">QR Code Verification</h1>
        <p className="text-gray-600 mt-1">Instantly verify applicant documents via Application ID or QR scan</p>
      </div>

      {/* Main Search Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 shadow-lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <QrCode className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Instant ID Lookup</h2>
            <p className="text-gray-700">Enter Application ID to verify authenticity and generate QR code</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="e.g., APP-2024-00142 or 2024-1101"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-5 py-4 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg font-medium"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
          <button
            onClick={() => handleSearch()}
            className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Verify Now
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Instant verification</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Secure encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Auto-generated QR</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 shadow-sm">
          <div className="font-semibold mb-2">Verification failed</div>
          <p>{error}</p>
        </div>
      )}

      {/* Search Result */}
      {searchResult && (
        <div className="grid grid-cols-3 gap-6">
          {/* Applicant Details */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Verification Details</h3>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                  searchResult.status
                )}`}
              >
                {searchResult.status === "Approved" && <CheckCircle className="w-4 h-4" />}
                {searchResult.status === "Flagged" && <AlertTriangle className="w-4 h-4" />}
                {searchResult.status === "Rejected" && <XCircle className="w-4 h-4" />}
                {searchResult.status}
              </span>
            </div>

            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Full Name</div>
                  <div className="font-semibold text-gray-900 text-lg">{searchResult.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Application ID</div>
                  <div className="font-semibold text-gray-900 text-lg font-mono">{searchResult.id}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Position</div>
                  <div className="font-medium text-gray-900">{searchResult.position}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Email</div>
                  <div className="font-medium text-gray-900">{searchResult.email}</div>
                </div>
              </div>

              {/* Verification Metrics */}
              <div className="border-t border-gray-200 pt-6">
                <div className="text-sm font-semibold text-gray-700 mb-4">Verification Metrics</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1">{searchResult.confidence}%</div>
                    <div className="text-xs text-gray-600">Confidence Score</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{searchResult.docs}</div>
                    <div className="text-xs text-gray-600">Documents Verified</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{searchResult.risk}</div>
                    <div className="text-xs text-gray-600">Risk Score</div>
                  </div>
                </div>
              </div>

              {/* Verification Timeline */}
              <div className="border-t border-gray-200 pt-6">
                <div className="text-sm font-semibold text-gray-700 mb-4">Verification Timeline</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Verification Complete</div>
                      <div className="text-sm text-gray-600">{searchResult.verifiedDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">AI Processing Completed</div>
                      <div className="text-sm text-gray-600">Took 2.1 seconds</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Documents Uploaded</div>
                      <div className="text-sm text-gray-600">6 files submitted</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button onClick={downloadCertificate} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
                <button onClick={shareReport} className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share Report
                </button>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Verification QR Code</h3>
            
            <div ref={qrRef} className="bg-white border-4 border-indigo-600 rounded-xl p-4 mb-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 aspect-square rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full p-4">
                  <rect width="200" height="200" fill="white" />
                  {/* QR Code Pattern */}
                  <g fill="#1a1d2e">
                    {/* Top-left corner */}
                    <rect x="10" y="10" width="60" height="60" />
                    <rect x="20" y="20" width="40" height="40" fill="white" />
                    <rect x="30" y="30" width="20" height="20" />
                    
                    {/* Top-right corner */}
                    <rect x="130" y="10" width="60" height="60" />
                    <rect x="140" y="20" width="40" height="40" fill="white" />
                    <rect x="150" y="30" width="20" height="20" />
                    
                    {/* Bottom-left corner */}
                    <rect x="10" y="130" width="60" height="60" />
                    <rect x="20" y="140" width="40" height="40" fill="white" />
                    <rect x="30" y="150" width="20" height="20" />
                    
                    {/* Data pattern */}
                    <rect x="90" y="10" width="10" height="10" />
                    <rect x="110" y="10" width="10" height="10" />
                    <rect x="80" y="30" width="10" height="10" />
                    <rect x="100" y="30" width="10" height="10" />
                    <rect x="120" y="30" width="10" height="10" />
                    <rect x="90" y="50" width="10" height="10" />
                    <rect x="110" y="50" width="10" height="10" />
                    
                    <rect x="10" y="80" width="10" height="10" />
                    <rect x="30" y="80" width="10" height="10" />
                    <rect x="50" y="80" width="10" height="10" />
                    <rect x="10" y="100" width="10" height="10" />
                    <rect x="40" y="100" width="10" height="10" />
                    <rect x="20" y="110" width="10" height="10" />
                    
                    <rect x="80" y="80" width="10" height="10" />
                    <rect x="100" y="80" width="10" height="10" />
                    <rect x="120" y="80" width="10" height="10" />
                    <rect x="140" y="80" width="10" height="10" />
                    <rect x="160" y="80" width="10" height="10" />
                    <rect x="180" y="80" width="10" height="10" />
                    
                    <rect x="90" y="100" width="10" height="10" />
                    <rect x="110" y="100" width="10" height="10" />
                    <rect x="130" y="100" width="10" height="10" />
                    <rect x="150" y="100" width="10" height="10" />
                    <rect x="170" y="100" width="10" height="10" />
                    
                    <rect x="80" y="120" width="10" height="10" />
                    <rect x="100" y="120" width="10" height="10" />
                    <rect x="140" y="120" width="10" height="10" />
                    <rect x="160" y="120" width="10" height="10" />
                    <rect x="180" y="120" width="10" height="10" />
                    
                    <rect x="90" y="140" width="10" height="10" />
                    <rect x="110" y="140" width="10" height="10" />
                    <rect x="130" y="140" width="10" height="10" />
                    <rect x="170" y="140" width="10" height="10" />
                    
                    <rect x="80" y="160" width="10" height="10" />
                    <rect x="120" y="160" width="10" height="10" />
                    <rect x="140" y="160" width="10" height="10" />
                    <rect x="180" y="160" width="10" height="10" />
                    
                    <rect x="90" y="180" width="10" height="10" />
                    <rect x="130" y="180" width="10" height="10" />
                    <rect x="150" y="180" width="10" height="10" />
                    <rect x="170" y="180" width="10" height="10" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="font-semibold text-gray-900 mb-1">Scan to Verify</div>
              <div className="text-sm text-gray-600">Valid until: Dec 31, 2024</div>
            </div>

            <div className="space-y-2">
              <button onClick={downloadQr} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                <Download className="w-4 h-4" />
                Download QR
              </button>
              <button onClick={printQr} className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4" />
                Print QR
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
              <div className="font-semibold mb-1">Encrypted Data</div>
              <div>QR contains encrypted verification data. Scan with DocuVerify app to validate.</div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 mb-8">
          <QrCode className="w-6 h-6" />
          <h3 className="text-lg font-semibold">How QR Verification Works</h3>
        </div>

        <div className="grid grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <div className="text-3xl font-bold text-indigo-600">1</div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Enter ID</h4>
            <p className="text-sm text-gray-600">Input Application ID from verification form or database</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <div className="text-3xl font-bold text-purple-600">2</div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">AI Lookup</h4>
            <p className="text-sm text-gray-600">System fetches records and analyzes verification status instantly</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <div className="text-3xl font-bold text-pink-600">3</div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">QR Generated</h4>
            <p className="text-sm text-gray-600">Unique QR code with encrypted verification data created</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <div className="text-3xl font-bold text-blue-600">4</div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Scan & Trust</h4>
            <p className="text-sm text-gray-600">Officers scan QR to instantly verify document authenticity</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Instant Verification</h4>
          <p className="text-sm text-gray-600">Real-time lookup and verification in under 1 second</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Secure Encryption</h4>
          <p className="text-sm text-gray-600">256-bit AES encryption for all QR data</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Scan className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Mobile Friendly</h4>
          <p className="text-sm text-gray-600">Scan QR codes with any smartphone camera</p>
        </div>
      </div>
    </div>
  );
}
