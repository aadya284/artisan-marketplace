"use client";

import { useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Package,
  ShoppingBag,
  Phone,
  Clock,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuickAction {
  label: string;
  message: string;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const quickActions: QuickAction[] = [
  { label: "Find pottery", message: "I'm looking for pottery items" },
  { label: "Discover textiles", message: "Show me textile products" },
  { label: "Contact artisan", message: "I'd like to contact an artisan" },
  { label: "Track my order", message: "Help me track my order" }
];

export default function AiChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm Kalabandhu, your cultural craft companion. I can help you discover handcrafted items, connect with artisans, and explore India's rich heritage.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const getServerUrl = () => {
    // Use environment variable if available, otherwise fallback to localhost
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  };

  const sendToGemini = async (userMessage: string) => {
    try {
      const serverUrl = getServerUrl();
      console.log('Connecting to server:', serverUrl);
      
      // First, check if server is reachable
      try {
        await fetch(`${serverUrl}`);
      } catch (e) {
        throw new Error("Cannot connect to chat server. Please check if the server is running.");
      }
      
      const res = await fetch(`${serverUrl}/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });
      
      let responseData;
      const contentType = res.headers.get("content-type");
      
      // Handle different response types
      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = await res.json();
        } catch (e) {
          console.error("Failed to parse JSON response:", e);
          throw new Error("Invalid response from server");
        }
      } else {
        // If not JSON, try to get text content for better error message
        const textContent = await res.text();
        console.error("Non-JSON response:", textContent);
        throw new Error("Server returned invalid response format");
      }

      if (!res.ok) {
        throw new Error(responseData.error || `Server error: ${res.status}`);
      }
      
      if (!responseData.reply) {
        console.error("Invalid response structure:", responseData);
        throw new Error("Invalid response format from server");
      }
      
      return responseData.reply;
    } catch (error: any) {
      console.error("Chatbot Error:", error);
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        return "⚠️ Cannot connect to the chat server. Please check your internet connection and try again.";
      }
      return "⚠️ " + (error.message || "Something went wrong. Please try again later.");
    }
  };

  const handleQuickAction = async (action: QuickAction) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      content: action.message,
      isUser: true,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const botReply = await sendToGemini(action.message);
    setLoading(false);
    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), content: botReply, isUser: false, timestamp: new Date() }
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);
    const botReply = await sendToGemini(userMsg.content);
    setLoading(false);
    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), content: botReply, isUser: false, timestamp: new Date() }
    ]);
  };

  const handleClearChat = async () => {
    try {
      const serverUrl = getServerUrl();
      await fetch(`${serverUrl}/clear-cache`, { 
        method: "POST",
        credentials: 'include'
      });
      setMessages([
        {
          id: "welcome",
          content: "Chat cleared. How can I assist you now?",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error("Failed to clear chat cache:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-80 h-96 bg-white border rounded-xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Kalabandhu</h3>
                <p className="text-xs opacity-80">Your artisan companion</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleClearChat} title="Clear chat">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-b bg-gray-50">
                <select
                  className="w-full text-xs p-2 border rounded"
                  defaultValue=""
                  onChange={(e) => {
                    const act = quickActions.find((q) => q.label === e.target.value);
                    if (act) handleQuickAction(act);
                  }}
                >
                  <option value="" disabled>
                    Choose a quick action...
                  </option>
                  {quickActions.map((action) => (
                    <option key={action.label} value={action.label}>
                      {action.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 text-sm rounded-lg ${
                      msg.isUser ? "bg-orange-600 text-white" : "bg-white border"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-xs text-gray-400 text-center">Thinking...</div>
              )}
            </div>

            {/* Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t flex items-center gap-2 bg-white"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center"
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
