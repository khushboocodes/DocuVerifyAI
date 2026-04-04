import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your DocuVerify AI assistant. I can help you learn about our document verification platform. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes("what") && message.includes("platform")) {
      return "DocuVerify AI is an advanced document verification platform that uses artificial intelligence to verify documents, check authenticity, and ensure compliance. It supports multiple document types including educational certificates, identity proofs, and experience letters.";
    }

    if (message.includes("how") && message.includes("work")) {
      return "Our platform works by: 1) Uploading documents through our secure interface, 2) AI-powered OCR and analysis, 3) Automated verification against multiple databases, 4) Risk assessment and fraud detection, 5) Generating verification reports with confidence scores.";
    }

    if (message.includes("feature") || message.includes("what can")) {
      return "Key features include: • Multi-language document support • Real-time fraud detection • QR code verification • Comprehensive analytics dashboard • Automated report generation • Secure document storage • API integration capabilities";
    }

    if (message.includes("upload") || message.includes("document")) {
      return "To upload documents: 1) Go to the Upload page, 2) Fill in applicant details, 3) Upload document files (PDF, JPEG, PNG), 4) Our AI will automatically process and verify the documents, 5) Review the verification results.";
    }

    if (message.includes("qr") || message.includes("verify")) {
      return "QR verification allows you to instantly verify documents using QR codes. Simply scan or enter the application ID, and our system will retrieve and display the verification status, confidence score, and all relevant document information.";
    }

    if (message.includes("report") || message.includes("analytics")) {
      return "Our Reports and Analytics sections provide comprehensive insights: • Verification success rates • Document type distribution • System performance metrics • Fraud detection statistics • Processing time analysis • Confidence score trends";
    }

    if (message.includes("security") || message.includes("safe")) {
      return "Security is our top priority: • End-to-end encryption • Secure document storage • GDPR compliance • Regular security audits • AI-powered fraud detection • Access control and authentication";
    }

    if (message.includes("support") || message.includes("help")) {
      return "For technical support, you can: • Check our documentation • Contact our support team • Use this chatbot for quick answers • Review the FAQ section • Submit a support ticket";
    }

    return "I'm here to help you learn about DocuVerify AI! You can ask me about our features, how the platform works, document verification process, security measures, or any other questions about our service.";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all duration-300 hover:scale-110 z-50"
        title="AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-40">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 rounded-t-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold">DocuVerify AI Assistant</h3>
              <p className="text-xs text-indigo-100">Online • Ready to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isBot
                      ? "bg-gray-100 text-gray-800 rounded-bl-md"
                      : "bg-indigo-600 text-white rounded-br-md"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isBot ? "text-gray-500" : "text-indigo-100"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about DocuVerify AI..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;