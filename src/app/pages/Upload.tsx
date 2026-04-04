import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Upload as UploadIcon, FileText, Image, CheckCircle, X, AlertCircle, Shield, Eye, Zap } from "lucide-react";
import { useData } from "../context/DataContext";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DocumentValidation {
  isValid: boolean;
  type: string;
  confidence: number;
  extractedText?: string;
  issues?: string[];
}

interface ProcessingResult {
  ocrConfidence: number;
  textQuality: number;
  documentAuthenticity: number;
  dataExtraction: number;
  fraudDetection: number;
  overallScore: number;
}

export default function Upload() {
  const navigate = useNavigate();
  const { addApplicant } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    applicationId: "",
    email: "",
    phone: "",
    position: "",
    dateOfBirth: "",
    address: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    file: File;
    name: string;
    size: string;
    type: string;
    validation?: DocumentValidation;
    preview?: string;
  }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [resultData, setResultData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Document type validation
  const validateDocument = async (file: File): Promise<DocumentValidation> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;
        let validation: DocumentValidation = {
          isValid: false,
          type: "Unknown",
          confidence: 0,
          issues: []
        };

        // Check file type
        if (file.type === 'application/pdf') {
          validation.type = 'PDF Document';
          validation.isValid = true;
          validation.confidence = 95;
          resolve(validation);
        } else if (file.type.startsWith('image/')) {
          validation.type = 'Image Document';

          const img = new Image();
          img.onload = () => {
            // Basic heuristics for document detection
            const aspectRatio = img.width / img.height;
            const isDocumentRatio = aspectRatio > 0.3 && aspectRatio < 5; // More lenient aspect ratio

            // Check file size (documents are usually smaller than photos)
            const isReasonableSize = file.size < 10 * 1024 * 1024; // 10MB

            // Check filename for document keywords (more lenient)
            const hasDocumentKeywords = /\b(id|card|certificate|license|passport|aadhar|pan|resume|cv|diploma|photo|image|doc|document|proof)\b/i.test(file.name) || file.name.toLowerCase().includes('doc') || file.name.toLowerCase().includes('img');

            validation.isValid = isDocumentRatio && isReasonableSize && (hasDocumentKeywords || file.size < 2 * 1024 * 1024); // Allow smaller images even without keywords
            validation.confidence = validation.isValid ? 85 : Math.max(50, 85 - (hasDocumentKeywords ? 0 : 20) - (isDocumentRatio ? 0 : 15));

            if (!validation.isValid) {
              validation.issues = [];
              if (!isDocumentRatio) validation.issues.push("Image aspect ratio may not be optimal for document scanning");
              if (!isReasonableSize) validation.issues.push("File size is too large");
              if (!hasDocumentKeywords && file.size >= 2 * 1024 * 1024) validation.issues.push("Filename doesn't indicate a document type - please rename if it's a valid document");
            }

            resolve(validation);
          };

          img.onerror = () => {
            validation.issues = ["Invalid or corrupted image file"];
            resolve(validation);
          };

          img.src = result;
        } else {
          validation.issues = ["Unsupported file type - only PDF and image files are accepted"];
          resolve(validation);
        }
      };

      reader.onerror = () => {
        resolve({
          isValid: false,
          type: "Unknown",
          confidence: 0,
          issues: ["Failed to read file"]
        });
      };

      reader.readAsDataURL(file);
    });
  };

  // AI Processing Simulation (in real app, this would call actual AI APIs)
  const processDocumentAI = async (file: File, validation: DocumentValidation): Promise<ProcessingResult> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simulate realistic AI processing results
    const baseConfidence = validation.confidence;
    const ocrConfidence = Math.max(70, Math.min(98, baseConfidence + (Math.random() * 20 - 10)));
    const textQuality = Math.max(65, Math.min(95, ocrConfidence - (Math.random() * 15)));
    const documentAuthenticity = Math.max(60, Math.min(100, baseConfidence + (Math.random() * 25 - 5)));
    const dataExtraction = Math.max(70, Math.min(95, ocrConfidence * 0.9 + Math.random() * 10));
    const fraudDetection = Math.max(75, Math.min(100, documentAuthenticity + (Math.random() * 15 - 5)));

    const overallScore = Math.round((ocrConfidence + textQuality + documentAuthenticity + dataExtraction + fraudDetection) / 5);

    return {
      ocrConfidence: Math.round(ocrConfidence),
      textQuality: Math.round(textQuality),
      documentAuthenticity: Math.round(documentAuthenticity),
      dataExtraction: Math.round(dataExtraction),
      fraudDetection: Math.round(fraudDetection),
      overallScore
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    const errors: string[] = [];
    const validFiles: typeof uploadedFiles = [];

    for (const file of files) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: File size exceeds 10MB limit`);
        continue;
      }

      // Check file type
      if (!['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only PDF, JPG, PNG allowed`);
        continue;
      }

      // Validate document
      const validation = await validateDocument(file);

      if (!validation.isValid) {
        errors.push(`${file.name}: ${validation.issues?.join(', ') || 'Invalid document'}`);
        continue;
      }

      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      validFiles.push({
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        type: validation.type,
        validation,
        preview
      });
    }

    setValidationErrors(errors);
    setUploadedFiles(prev => [...prev, ...validFiles]);

    // Clear errors after 5 seconds
    if (errors.length > 0) {
      setTimeout(() => setValidationErrors([]), 5000);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return newFiles;
    });
  };

  const startProcessing = async () => {
    if (uploadedFiles.length === 0) return;

    setStep(3);
    setProcessing(true);
    setProgress(0);

    const processingStages = [
      "Initializing AI Engine...",
      "Validating Document Authenticity...",
      "Performing OCR Analysis...",
      "Extracting Document Data...",
      "Cross-verifying Information...",
      "Running Fraud Detection...",
      "Generating Verification Report..."
    ];

    let stageIndex = 0;
    const results: ProcessingResult[] = [];

    // Process each document
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      setCurrentStage(`Processing ${file.name}...`);

      // Process document with AI
      const result = await processDocumentAI(file.file, file.validation!);
      results.push(result);

      // Update progress
      const fileProgress = ((i + 1) / uploadedFiles.length) * 100;
      setProgress(fileProgress);
    }

    // Calculate overall results
    const avgResults = {
      ocrConfidence: Math.round(results.reduce((sum, r) => sum + r.ocrConfidence, 0) / results.length),
      textQuality: Math.round(results.reduce((sum, r) => sum + r.textQuality, 0) / results.length),
      documentAuthenticity: Math.round(results.reduce((sum, r) => sum + r.documentAuthenticity, 0) / results.length),
      dataExtraction: Math.round(results.reduce((sum, r) => sum + r.dataExtraction, 0) / results.length),
      fraudDetection: Math.round(results.reduce((sum, r) => sum + r.fraudDetection, 0) / results.length),
      overallScore: Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length)
    };

    // Determine status based on scores
    let status: "Approved" | "Flagged" | "Rejected" = "Approved";
    if (avgResults.overallScore < 70) {
      status = "Rejected";
    } else if (avgResults.overallScore < 85) {
      status = "Flagged";
    }

    setCurrentStage("Finalizing Results...");
    setProgress(100);

    setTimeout(() => {
      setProcessing(false);

      // Generate comprehensive result data
      const result = {
        name: formData.fullName,
        id: formData.applicationId,
        position: formData.position,
        status: status,
        overallConfidence: avgResults.overallScore,
        matchScore: avgResults.dataExtraction,
        ocrConfidence: avgResults.ocrConfidence,
        safetyScore: avgResults.fraudDetection,
        extractedData: {
          name: formData.fullName,
          documentNumber: formData.applicationId,
          institution: "Verified Institution",
        },
        applicationInfo: {
          email: formData.email,
          phone: formData.phone,
          language: "English",
          processing: `${(uploadedFiles.length * 2.1).toFixed(1)}s`,
        },
        documents: uploadedFiles.map((file, idx) => ({
          name: file.name,
          status: avgResults.documentAuthenticity > 80 ? "Verified" : "Flagged",
          ocr: `OCR: ${avgResults.ocrConfidence}%`,
          confidence: avgResults.ocrConfidence
        })),
        auditLog: [
          { action: status, date: new Date().toLocaleDateString(), by: "AI Engine v2.4" }
        ],
        // Enhanced data for detailed analysis
        processingMetrics: {
          ocrConfidence: avgResults.ocrConfidence,
          textQuality: avgResults.textQuality,
          documentAuthenticity: avgResults.documentAuthenticity,
          dataExtraction: avgResults.dataExtraction,
          fraudDetection: avgResults.fraudDetection,
          overallScore: avgResults.overallScore
        },
        timelineData: [
          { stage: "Upload", confidence: 0, time: "0s" },
          { stage: "Validation", confidence: 25, time: "0.5s" },
          { stage: "OCR", confidence: 50, time: "1.2s" },
          { stage: "Analysis", confidence: 75, time: "1.8s" },
          { stage: "Complete", confidence: avgResults.overallScore, time: `${(uploadedFiles.length * 2.1).toFixed(1)}s` }
        ],
        documentTypeData: uploadedFiles.map((file, idx) => ({
          name: file.name.split('.')[0],
          value: avgResults.documentAuthenticity,
          confidence: avgResults.ocrConfidence
        })),
        riskAnalysis: [
          { category: "Document Authenticity", score: avgResults.documentAuthenticity },
          { category: "OCR Quality", score: avgResults.ocrConfidence },
          { category: "Data Extraction", score: avgResults.dataExtraction },
          { category: "Fraud Detection", score: avgResults.fraudDetection },
          { category: "Text Quality", score: avgResults.textQuality },
        ],
        verificationMetrics: [
          { metric: "Identity Verification", score: avgResults.dataExtraction },
          { metric: "Document Authenticity", score: avgResults.documentAuthenticity },
          { metric: "Data Consistency", score: avgResults.dataExtraction },
          { metric: "OCR Accuracy", score: avgResults.ocrConfidence },
          { metric: "Risk Assessment", score: avgResults.fraudDetection },
        ]
      };

      setResultData(result);

      // Add to database
      const newApplicant = {
        name: formData.fullName,
        role: formData.position,
        id: formData.applicationId,
        status: result.status as any,
        confidence: result.overallConfidence,
        risk: `${100 - result.safetyScore}%`,
        docs: `${uploadedFiles.length}/${uploadedFiles.length}`,
        language: "English",
        date: new Date().toISOString().split('T')[0],
        email: formData.email,
        phone: formData.phone,
        time: new Date().toLocaleTimeString(),
        processingTime: result.applicationInfo.processing,
        verifiedBy: "AI Engine v2.4",
        position: formData.position,
        ...result
      };

      addApplicant(newApplicant);
      setStep(4);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Verification Request</h1>
        <p className="text-gray-600 mt-1">Upload applicant documents for AI-powered verification</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 1 ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-200 text-gray-600"
              }`}
            >
              {step > 1 ? <CheckCircle className="w-6 h-6" /> : "1"}
            </div>
            <span className={`ml-3 font-medium ${step >= 1 ? "text-gray-900" : "text-gray-500"}`}>
              Applicant Info
            </span>
          </div>
          <div className={`w-20 h-1 rounded-full transition-all ${step >= 2 ? "bg-indigo-600" : "bg-gray-300"}`}></div>
          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 2 ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-200 text-gray-600"
              }`}
            >
              {step > 2 ? <CheckCircle className="w-6 h-6" /> : "2"}
            </div>
            <span className={`ml-3 font-medium ${step >= 2 ? "text-gray-900" : "text-gray-500"}`}>
              Upload Documents
            </span>
          </div>
          <div className={`w-20 h-1 rounded-full transition-all ${step >= 3 ? "bg-indigo-600" : "bg-gray-300"}`}></div>
          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 3 ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-200 text-gray-600"
              }`}
            >
              {step > 3 ? <CheckCircle className="w-6 h-6" /> : "3"}
            </div>
            <span className={`ml-3 font-medium ${step >= 3 ? "text-gray-900" : "text-gray-500"}`}>
              AI Processing
            </span>
          </div>
          <div className={`w-20 h-1 rounded-full transition-all ${step >= 4 ? "bg-indigo-600" : "bg-gray-300"}`}></div>
          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 4 ? "bg-green-600 text-white shadow-lg" : "bg-gray-200 text-gray-600"
              }`}
            >
              {step >= 4 ? <CheckCircle className="w-6 h-6" /> : "4"}
            </div>
            <span className={`ml-3 font-medium ${step >= 4 ? "text-gray-900" : "text-gray-500"}`}>
              Results
            </span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        {step === 1 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Applicant Information</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Rajesh Kumar Singh"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., APP-2024-00001"
                    value={formData.applicationId}
                    onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position Applied For <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Senior Data Analyst"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <div className="font-semibold mb-1">Information Required</div>
                  <div>All marked fields (*) are mandatory for document verification. Please ensure accuracy.</div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.fullName || !formData.applicationId || !formData.email || !formData.phone || !formData.position}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Documents →
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <UploadIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Upload Documents</h2>
            </div>

            <div className="space-y-6">
              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileSelect}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                }`}
              >
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UploadIcon className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop valid documents here</h3>
                <p className="text-gray-600 mb-4">or click to browse from your computer</p>
                <button
                  type="button"
                  className="bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileSelect();
                  }}
                >
                  Select Documents
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  <strong>Accepted:</strong> PDF documents, ID cards, certificates, address proofs<br />
                  <strong>Max size:</strong> 10MB per file • <strong>AI-validated</strong> for authenticity
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Required Documents List */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Required Documents (AI-Verified)
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-amber-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    Government ID (Aadhaar/PAN/Passport)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    Address Proof (Utility Bill/Bank Statement)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    Educational Certificates
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    Experience Letters (if applicable)
                  </div>
                </div>
                <div className="mt-3 text-xs text-amber-700">
                  <strong>Note:</strong> Only authentic documents will pass AI validation. Photos of documents may be rejected.
                </div>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-900">
                      <div className="font-semibold mb-2">Document Validation Failed</div>
                      <ul className="list-disc list-inside space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Validated Documents ({uploadedFiles.length})
                  </div>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          {file.type === "PDF Document" ? (
                            <FileText className="w-5 h-5 text-green-600" />
                          ) : (
                            <Image className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {file.name}
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Validated
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {file.size} • {file.type} • {file.validation?.confidence}% confidence
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {file.preview && (
                          <button
                            onClick={() => window.open(file.preview, '_blank')}
                            className="text-indigo-600 hover:text-indigo-700 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Preview Document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={startProcessing}
                  disabled={uploadedFiles.length === 0}
                  className="flex-1 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Start AI Verification →
                </button>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900">
                    <div className="font-semibold mb-1">Secure & Private</div>
                    <div>All documents are processed using bank-grade encryption. Files are automatically deleted after verification. Your data privacy is our top priority.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-12 h-12 text-indigo-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Processing in Progress...</h2>
            <p className="text-gray-600 mb-4">Our advanced AI engine is analyzing your documents</p>
            {currentStage && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-6 inline-block">
                <p className="text-indigo-900 font-medium">{currentStage}</p>
              </div>
            )}

            <div className="max-w-md mx-auto mb-6">
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-sm font-semibold text-gray-900 mt-2">{Math.round(progress)}% Complete</div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto text-sm">
              <div className={`flex items-center gap-2 p-2 rounded-lg ${progress >= 20 ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                <Shield className="w-4 h-4" />
                <span>Document Validation</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-lg ${progress >= 40 ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                <Eye className="w-4 h-4" />
                <span>OCR Analysis</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-lg ${progress >= 60 ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                <FileText className="w-4 h-4" />
                <span>Data Extraction</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-lg ${progress >= 80 ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                <CheckCircle className="w-4 h-4" />
                <span>Fraud Detection</span>
              </div>
            </div>

            <div className="mt-8 text-xs text-gray-500">
              Processing time may vary based on document complexity and quality
            </div>
          </div>
        )}

        {step === 4 && resultData && (
          <div className="space-y-8">
            {/* Back Button */}
            <button 
              onClick={() => navigate("/dashboard/applicants")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              ← Back to Applicants
            </button>

            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{resultData.name}</h1>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${resultData.status === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {resultData.status}
                  </span>
                </div>
                <p className="text-gray-600">{resultData.id} • {resultData.position}</p>
              </div>
            </div>

            {/* Circular Progress Scores */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Verification Scores</h2>
              <div className="grid grid-cols-4 gap-8">
                <div className="text-center">
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
                        className={resultData.overallConfidence >= 70 ? "text-green-500" : "text-red-500"}
                        strokeWidth="8"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * resultData.overallConfidence) / 100}
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
                      <span className="text-2xl font-bold text-gray-900">{resultData.overallConfidence}%</span>
                    </div>
                  </div>
                  <div className="font-medium text-gray-900">Overall Confidence</div>
                </div>

                <div className="text-center">
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
                        className={resultData.matchScore >= 70 ? "text-green-500" : "text-red-500"}
                        strokeWidth="8"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * resultData.matchScore) / 100}
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
                      <span className="text-2xl font-bold text-gray-900">{resultData.matchScore}%</span>
                    </div>
                  </div>
                  <div className="font-medium text-gray-900">Match Score</div>
                </div>

                <div className="text-center">
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
                        strokeDashoffset={264 - (264 * resultData.ocrConfidence) / 100}
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
                      <span className="text-2xl font-bold text-gray-900">{resultData.ocrConfidence}%</span>
                    </div>
                  </div>
                  <div className="font-medium text-gray-900">OCR Confidence</div>
                </div>

                <div className="text-center">
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
                        strokeDashoffset={264 - (264 * resultData.safetyScore) / 100}
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
                      <span className="text-2xl font-bold text-gray-900">{resultData.safetyScore}%</span>
                    </div>
                  </div>
                  <div className="font-medium text-gray-900">Safety Score</div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Verification Metrics Bar Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Verification Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resultData.verificationMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="metric" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Processing Timeline Line Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Processing Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={resultData.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="confidence" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Analysis Radar Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Risk Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={resultData.riskAnalysis}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Document Confidence Area Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Document Confidence Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={resultData.documentTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="confidence" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Document Status Pie Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Document Type Analysis</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={resultData.documentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {resultData.documentTypeData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Extracted Data Section */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Extracted Data</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Full Name</div>
                    <div className="font-medium text-gray-900">{resultData.extractedData.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Document Number</div>
                    <div className="font-medium text-gray-900">{resultData.extractedData.documentNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Institution</div>
                    <div className="font-medium text-gray-900">{resultData.extractedData.institution}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Application Info</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-900">{resultData.applicationInfo.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium text-gray-900">{resultData.applicationInfo.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                    <div className="font-medium text-gray-900">{resultData.applicationInfo.processing}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Verified Documents</h3>
              <div className="space-y-3">
                {resultData.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{doc.name}</div>
                        <div className="text-sm text-gray-600">{doc.status} • Confidence: {doc.confidence}%</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-600">{doc.ocr}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep(1);
                  setFormData({
                    fullName: "",
                    applicationId: "",
                    email: "",
                    phone: "",
                    position: "",
                    dateOfBirth: "",
                    address: "",
                  });
                  setUploadedFiles([]);
                  setResultData(null);
                }}
                className="flex-1 border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                New Verification
              </button>
              <button
                onClick={() => navigate("/dashboard/applicants")}
                className="flex-1 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
              >
                View All Applicants
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}