import { useParams, useNavigate } from "react-router";
import { CheckCircle, XCircle, AlertCircle, Clock, FileText, Download, Share2 } from "lucide-react";
import { useData } from "../context/DataContext";

export default function ApplicantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getApplicantById } = useData();
  
  const applicant = getApplicantById(id || "");

  const downloadReport = () => {
    if (!applicant) return;

    const reportContent = `
VERIFICATION REPORT - ${applicant.name}

Application Details:
- Application ID: ${applicant.id}
- Name: ${applicant.name}
- Position: ${applicant.position}
- Status: ${applicant.status}
- Email: ${applicant.email}
- Phone: ${applicant.phone}
- Date: ${applicant.date}
- Time: ${applicant.time}

Verification Scores:
- Overall Confidence: ${applicant.overallConfidence || 0}%
- Match Score: ${applicant.matchScore || 0}%
- OCR Confidence: ${applicant.ocrConfidence || 0}%
- Safety Score: ${applicant.safetyScore || 0}%

Risk Assessment:
- Risk Level: ${applicant.risk}
- Documents Verified: ${applicant.docs}

Processing Information:
- Processing Time: ${applicant.processingTime}
- Verified By: ${applicant.verifiedBy}
- Language: ${applicant.language}

${applicant.extractedData ? `
AI Extracted Data:
- Name: ${applicant.extractedData.name}
- Document Number: ${applicant.extractedData.documentNumber}
- Institution: ${applicant.extractedData.institution}
` : ''}

${applicant.documents ? `
Documents Processed:
${applicant.documents.map(doc => `- ${doc.name}: ${doc.status} (${doc.ocr})`).join('\n')}
` : ''}

Generated on: ${new Date().toLocaleString()}
DocuVerify AI - Verification Platform
    `.trim();

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `verification-report-${applicant.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const shareReport = async () => {
    if (!applicant) return;

    const shareData = {
      title: `Verification Report - ${applicant.name}`,
      text: `Check out the verification report for ${applicant.name} (ID: ${applicant.id}). Status: ${applicant.status}, Confidence: ${applicant.overallConfidence || 0}%`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        alert("Report details copied to clipboard!");
      }
    } catch (error) {
      // Fallback: copy to clipboard
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Report details copied to clipboard!");
      } catch (clipboardError) {
        alert("Unable to share. Please copy the URL manually.");
      }
    }
  };

  if (!applicant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Applicant Not Found</h2>
        <button 
          onClick={() => navigate("/dashboard/applicants")}
          className="text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          ← Back to Applicants
        </button>
      </div>
    );
  }

  const hasDetailedData = applicant.overallConfidence !== undefined;

  if (!hasDetailedData) {
    // Simple view for applicants without detailed data
    return (
      <div>
        <button 
          onClick={() => navigate("/dashboard/applicants")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to Applicants
        </button>
        
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{applicant.name}</h1>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Application ID</div>
              <div className="font-medium text-gray-900">{applicant.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Position</div>
              <div className="font-medium text-gray-900">{applicant.position}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="font-medium text-gray-900">{applicant.status}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-medium text-gray-900">{applicant.email}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detailed view with all metrics
  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/applicants")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        ← Back to Applicants
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{applicant.name}</h1>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${applicant.status === "Approved" ? "bg-green-100 text-green-700" : applicant.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
              {applicant.status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={downloadReport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button 
              onClick={shareReport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
        <p className="text-gray-600">{applicant.id} • {applicant.position}</p>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
          <div className="relative w-32 h-32 mx-auto mb-3">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className={applicant.overallConfidence >= 70 ? "text-green-500" : "text-red-500"}
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * (applicant.overallConfidence || 0)) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{applicant.overallConfidence || 0}%</span>
            </div>
          </div>
          <div className="font-medium text-gray-900">Overall Confidence</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
          <div className="relative w-32 h-32 mx-auto mb-3">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className={applicant.matchScore! >= 70 ? "text-green-500" : "text-red-500"}
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * (applicant.matchScore || 0)) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{applicant.matchScore || 0}%</span>
            </div>
          </div>
          <div className="font-medium text-gray-900">Match Score</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
          <div className="relative w-32 h-32 mx-auto mb-3">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className="text-green-500"
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * (applicant.ocrConfidence || 0)) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{applicant.ocrConfidence || 0}%</span>
            </div>
          </div>
          <div className="font-medium text-gray-900">OCR Confidence</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
          <div className="relative w-32 h-32 mx-auto mb-3">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className="text-green-500"
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * (applicant.safetyScore || 0)) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{applicant.safetyScore || 0}%</span>
            </div>
          </div>
          <div className="font-medium text-gray-900">Safety Score</div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* AI Extracted Data */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Extracted Data</h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">NAME</div>
              <div className="font-medium text-gray-900">{applicant.extractedData?.name || applicant.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">DOCUMENT NUMBER</div>
              <div className="font-medium text-gray-900">{applicant.extractedData?.documentNumber || applicant.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">INSTITUTION</div>
              <div className="font-medium text-gray-900">{applicant.extractedData?.institution || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Application Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Info</h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-medium text-gray-900">{applicant.applicationInfo?.email || applicant.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Phone</div>
              <div className="font-medium text-gray-900">{applicant.applicationInfo?.phone || applicant.phone}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Language</div>
              <div className="font-medium text-gray-900 flex items-center gap-2">
                <span className="inline-block w-4 h-4">🇬🇧</span>
                {applicant.applicationInfo?.language || applicant.language}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Processing</div>
              <div className="font-medium text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {applicant.applicationInfo?.processing || applicant.processingTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      {applicant.documents && applicant.documents.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents ({applicant.documents.length})</h3>
          <div className="space-y-2">
            {applicant.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-gray-900">{doc.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-sm flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {doc.status}
                  </span>
                  <span className="text-gray-600 text-sm">{doc.ocr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Officer Decision */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Officer Decision</h3>
        <textarea
          placeholder="Add verification notes..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none mb-4"
          rows={3}
        />
        <div className="flex gap-3">
          <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Approve
          </button>
          <button className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Flag
          </button>
          <button className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
            <XCircle className="w-5 h-5" />
            Reject
          </button>
        </div>
      </div>

      {/* Audit Log */}
      {applicant.auditLog && applicant.auditLog.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Log</h3>
          <div className="space-y-2">
            {applicant.auditLog.map((log, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-900">{log.action}</span>
                <span className="text-gray-600 text-sm">{log.date}</span>
                {log.by && <span className="text-gray-600 text-sm">by {log.by}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}