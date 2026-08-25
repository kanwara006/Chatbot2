import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PanelLeftOpen, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import ChatSidebar from '@/components/chatbot/ChatSidebar'
import ChatWindow from '@/components/chatbot/ChatWindow'
import { useChat } from '@/hooks/useChat'

/**
 * ChatPage — หน้า AI Chatbot ปรับปรุงตามแบบภาพตัวอย่าง
 */
export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    messagesEndRef,
    createNewConversation,
    openConversation,
    removeConversation,
    sendMessage,
    submitFeedback,
  } = useChat()

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
      {/* ── 1. Top Navbar: PSU Branding Header (Matched with Reference Image) ── */}
      <header className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-2.5 flex items-center justify-between z-30 flex-shrink-0">
        <Link to="/" className="flex items-center gap-3 group" aria-label="กลับหน้าแรก">
          <div className="w-10 h-10 flex-shrink-0">
            <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="8" fill="#0B2E5E"/>
              <text
                x="22" y="28"
                textAnchor="middle"
                fill="white"
                fontSize="16"
                fontWeight="700"
                fontFamily="IBM Plex Sans Thai, sans-serif"
                letterSpacing="-0.5"
              >
                PSU
              </text>
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-[#0B2E5E] tracking-tight">
              มหาวิทยาลัยสงขลานครินทร์
            </p>
            <p className="text-xs text-[#64748B]">
              วิทยาเขตสุราษฎร์ธานี
            </p>
          </div>
        </Link>
      </header>

      {/* ── 2. Main Chat Layout (Sidebar + Chat Area) ────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Desktop Sidebar */}
        {sidebarOpen ? (
          <div className="hidden md:flex flex-shrink-0 h-full">
            <ChatSidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              onNew={createNewConversation}
              onOpen={openConversation}
              onDelete={removeConversation}
              onCollapse={() => setSidebarOpen(false)}
            />
          </div>
        ) : (
          /* Expand Sidebar Button */
          <div className="hidden md:flex items-start p-2 bg-[#062E66] h-full z-20">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="ขยายแถบข้าง"
              aria-label="ขยายแถบข้าง"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 md:hidden bg-[#062E66]/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div
                className="fixed top-0 left-0 z-50 h-full md:hidden"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.25 }}
              >
                <ChatSidebar
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onNew={() => { createNewConversation(); setMobileSidebarOpen(false) }}
                  onOpen={(id) => { openConversation(id); setMobileSidebarOpen(false) }}
                  onDelete={removeConversation}
                  onCollapse={() => setMobileSidebarOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 relative">
          {/* Mobile open button */}
          <button
            id="mobile-sidebar-toggle"
            className="md:hidden absolute top-3.5 left-4 z-20 p-2 rounded-lg bg-white border border-[#E2E8F0] shadow-sm text-[#062E66]"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="เปิดประวัติการสนทนา"
          >
            <PanelLeftOpen size={16} />
          </button>

          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
            onSend={sendMessage}
            onFeedback={submitFeedback}
            onReset={createNewConversation}
          />
        </div>

      </div>
    </div>
  )
}
