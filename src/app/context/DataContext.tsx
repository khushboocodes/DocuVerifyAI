import { createContext, useContext, useState, ReactNode } from "react";

export interface ApplicantData {
  name: string;
  role: string;
  id: string;
  status: "Approved" | "Flagged" | "Rejected" | "Pending";
  confidence: number;
  risk: string;
  docs: string;
  language: string;
  date: string;
  email: string;
  phone: string;
  time: string;
  processingTime: string;
  verifiedBy: string;
  position: string;
  overallConfidence?: number;
  matchScore?: number;
  ocrConfidence?: number;
  safetyScore?: number;
  extractedData?: {
    name: string;
    documentNumber: string;
    institution: string;
  };
  applicationInfo?: {
    email: string;
    phone: string;
    language: string;
    processing: string;
  };
  documents?: Array<{
    name: string;
    status: string;
    ocr: string;
  }>;
  auditLog?: Array<{
    action: string;
    date: string;
    by: string;
  }>;
}

interface DataContextType {
  applicants: ApplicantData[];
  addApplicant: (applicant: ApplicantData) => void;
  updateApplicant: (id: string, data: Partial<ApplicantData>) => void;
  deleteApplicant: (id: string) => void;
  getApplicantById: (id: string) => ApplicantData | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [applicants, setApplicants] = useState<ApplicantData[]>([
    {
      name: "Tanushka Tomar",
      role: "Data analyst",
      id: "2024-1101",
      status: "Approved",
      confidence: 96,
      risk: "0%",
      docs: "1/1",
      language: "English",
      date: "2024-04-02",
      email: "tanushka@example.com",
      phone: "+91 98765 43210",
      time: "14:32",
      processingTime: "2.1s",
      verifiedBy: "AI Engine v2.4",
      position: "Data analyst",
      overallConfidence: 96,
      matchScore: 0,
      ocrConfidence: 92,
      safetyScore: 100,
      extractedData: {
        name: "Tanushka Tomar",
        documentNumber: "APP-2024-0021",
        institution: "Indian Institute of Technology Jodhpur",
      },
      applicationInfo: {
        email: "tanushka2005@gmail.com",
        phone: "+919389626420",
        language: "English",
        processing: "28.38ms",
      },
      documents: [
        { name: "3.jpeg", status: "Verified", ocr: "OCR: 92%" },
      ],
      auditLog: [
        { action: "Rejected", date: "04/2/2026", by: "" },
      ],
    },
    {
      name: "Rajesh Kumar Singh",
      role: "Senior Data Analyst",
      id: "APP-2024-00142",
      status: "Approved",
      confidence: 97,
      risk: "5%",
      docs: "6/6",
      language: "English, Hindi",
      date: "2024-04-01",
      email: "rajesh.k@example.com",
      phone: "+91 98765 43211",
      time: "11:15",
      processingTime: "3.2s",
      verifiedBy: "AI Engine v2.4",
      position: "Senior Data Analyst",
    },
    {
      name: "Priya Sharma",
      role: "ML Engineer",
      id: "APP-2024-00143",
      status: "Approved",
      confidence: 94,
      risk: "8%",
      docs: "5/5",
      language: "English",
      date: "2024-03-31",
      email: "priya.s@example.com",
      phone: "+91 98765 43212",
      time: "16:20",
      processingTime: "2.8s",
      verifiedBy: "AI Engine v2.4",
      position: "ML Engineer",
    },
    {
      name: "अमित शर्मा",
      role: "Software Developer",
      id: "APP-2024-00144",
      status: "Flagged",
      confidence: 78,
      risk: "35%",
      docs: "4/7",
      language: "Hindi, English",
      date: "2024-03-30",
      email: "amit.sharma@example.com",
      phone: "+91 98765 43213",
      time: "09:45",
      processingTime: "2.5s",
      verifiedBy: "AI Engine v2.4",
      position: "Software Developer",
    },
    {
      name: "Sneha Patel",
      role: "Data Scientist",
      id: "APP-2024-00145",
      status: "Approved",
      confidence: 97,
      risk: "3%",
      docs: "6/6",
      language: "English, Gujarati",
      date: "2024-03-29",
      email: "sneha.p@example.com",
      phone: "+91 98765 43214",
      time: "13:55",
      processingTime: "2.3s",
      verifiedBy: "AI Engine v2.4",
      position: "Data Scientist",
    },
    {
      name: "Mohammed Irfan",
      role: "Backend Engineer",
      id: "APP-2024-00146",
      status: "Rejected",
      confidence: 42,
      risk: "72%",
      docs: "1/5",
      language: "English, Urdu",
      date: "2024-03-28",
      email: "mohammed.i@example.com",
      phone: "+91 98765 43215",
      time: "10:30",
      processingTime: "1.9s",
      verifiedBy: "AI Engine v2.4",
      position: "Backend Engineer",
    },
    {
      name: "Kavitha Ramanathan",
      role: "Research Analyst",
      id: "APP-2024-00147",
      status: "Pending",
      confidence: 0,
      risk: "0%",
      docs: "0/8",
      language: "Tamil, English",
      date: "2024-03-27",
      email: "kavitha.r@example.com",
      phone: "+91 98765 43216",
      time: "15:10",
      processingTime: "—",
      verifiedBy: "—",
      position: "Research Analyst",
    },
    {
      name: "Vikram Choudhary",
      role: "AI/ML Lead",
      id: "APP-2024-00148",
      status: "Flagged",
      confidence: 83,
      risk: "25%",
      docs: "4/6",
      language: "English, Hindi",
      date: "2024-03-26",
      email: "vikram.c@example.com",
      phone: "+91 98765 43217",
      time: "12:40",
      processingTime: "2.7s",
      verifiedBy: "AI Engine v2.4",
      position: "AI/ML Lead",
    },
    {
      name: "Ananya Desai",
      role: "Product Analyst",
      id: "APP-2024-00149",
      status: "Approved",
      confidence: 95,
      risk: "6%",
      docs: "5/5",
      language: "English",
      date: "2024-03-25",
      email: "ananya.d@example.com",
      phone: "+91 98765 43218",
      time: "14:05",
      processingTime: "2.4s",
      verifiedBy: "AI Engine v2.4",
      position: "Product Analyst",
    },
  ]);

  const addApplicant = (applicant: ApplicantData) => {
    setApplicants((prev) => [applicant, ...prev]);
  };

  const updateApplicant = (id: string, data: Partial<ApplicantData>) => {
    setApplicants((prev) =>
      prev.map((applicant) =>
        applicant.id === id ? { ...applicant, ...data } : applicant
      )
    );
  };

  const deleteApplicant = (id: string) => {
    setApplicants((prev) => prev.filter((applicant) => applicant.id !== id));
  };

  const getApplicantById = (id: string) => {
    return applicants.find((applicant) => applicant.id === id);
  };

  return (
    <DataContext.Provider
      value={{
        applicants,
        addApplicant,
        updateApplicant,
        deleteApplicant,
        getApplicantById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
