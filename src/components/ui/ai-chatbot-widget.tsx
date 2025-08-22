"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Package, ShoppingBag, Phone, Clock } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface QuickAction {
  label: string
  icon: React.ReactNode
  message: string
}

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

const quickActions: QuickAction[] = [
  {
    label: "Find pottery",
    icon: <Package className="w-4 h-4" />,
    message: "I'm looking for pottery items"
  },
  {
    label: "Discover textiles",
    icon: <ShoppingBag className="w-4 h-4" />,
    message: "Show me textile products"
  },
  {
    label: "Contact artisan",
    icon: <Phone className="w-4 h-4" />,
    message: "I'd like to contact an artisan"
  },
  {
    label: "Track my order",
    icon: <Clock className="w-4 h-4" />,
    message: "Help me track my order"
  }
]

export default function AiChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm kalabandhu, your cultural craft companion. I'm here to help you discover beautiful handcrafted items, connect with talented artisans, and learn about India's rich artistic heritage. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")

  const handleQuickAction = (action: QuickAction) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: action.message,
      isUser: true,
      timestamp: new Date()
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: `I'd be happy to help you ${action.label.toLowerCase()}! Let me find the best options for you. What specific style or type are you looking for?`,
      isUser: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage, botResponse])
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: "Thank you for your message! I'm processing your request and will help you find exactly what you're looking for. Is there anything specific you'd like to know about our artisan products?",
      isUser: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage, botResponse])
    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 w-80 h-96 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-sm">kalabandhu</h3>
                <p className="text-xs opacity-90">How can I help you today?</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 h-60 overflow-y-auto bg-background">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.isUser
                        ? "bg-primary text-primary-foreground ml-4"
                        : "bg-muted text-muted-foreground mr-4"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-2 p-2 text-xs bg-muted hover:bg-accent rounded-md transition-colors text-left"
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm bg-muted border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Animation */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        )}
      </motion.button>
    </div>
  )
}
