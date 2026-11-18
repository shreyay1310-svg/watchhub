import React, { useState } from 'react';
import {
  Search,
  Send,
  User,
  Paperclip,
  Smile,
  Clock,
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  PlusCircle,
  FileText,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

export const LiveChatModule = ({
  chats = [],
  setChats,
  cannedResponses = [],
  onConvertToTicket,
}) => {
  const [activeChatId, setActiveChatId] = useState(chats[0]?.id || 'chat_1');
  const [filterType, setFilterType] = useState('active'); // active | waiting | resolved
  const [chatSearch, setChatSearch] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showCanned, setShowCanned] = useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'agent',
      senderName: 'Pooja Sharma',
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = chats.map((c) => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [...(c.messages || []), newMsg],
          lastMessage: messageInput.trim(),
          lastMessageTime: 'Just now',
          unreadCount: 0,
        };
      }
      return c;
    });

    setChats(updated);
    setMessageInput('');
  };

  const filteredChats = chats.filter((c) => {
    const matchesSearch =
      !chatSearch ||
      c.customerName?.toLowerCase().includes(chatSearch.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(chatSearch.toLowerCase());

    if (filterType === 'active') return matchesSearch && c.status === 'active';
    if (filterType === 'waiting') return matchesSearch && c.status === 'waiting';
    if (filterType === 'resolved') return matchesSearch && c.status === 'resolved';
    return matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-140px)] rounded-2xl bg-[#111729] border border-[#252D42] overflow-hidden flex flex-col shadow-2xl animate-in fade-in duration-200">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Conversation List */}
        <div className="w-80 lg:w-96 border-r border-[#252D42] flex flex-col bg-[#091426]/70">
          {/* Header & Search */}
          <div className="p-4 border-b border-[#252D42] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Live Chat</span>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              </h3>
              <span className="text-[11px] font-semibold text-[#00D9E8] bg-[#00D9E8]/10 px-2.5 py-0.5 rounded-full border border-[#00D9E8]/30">
                {chats.filter((c) => c.status === 'active').length} Active
              </span>
            </div>

            {/* Filter buttons */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#070918] rounded-xl border border-[#252D42]">
              <button
                onClick={() => setFilterType('active')}
                className={`py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterType === 'active'
                    ? 'bg-[#111729] text-[#00D9E8] shadow'
                    : 'text-[#A7B1C2] hover:text-white'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterType('waiting')}
                className={`py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterType === 'waiting'
                    ? 'bg-[#111729] text-[#E7B43F] shadow'
                    : 'text-[#A7B1C2] hover:text-white'
                }`}
              >
                Waiting
              </button>
              <button
                onClick={() => setFilterType('resolved')}
                className={`py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterType === 'resolved'
                    ? 'bg-[#111729] text-[#10B981] shadow'
                    : 'text-[#A7B1C2] hover:text-white'
                }`}
              >
                Closed
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-[#111729] text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#252D42]/60 custom-scrollbar">
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748B]">
                No conversations found in this queue.
              </div>
            ) : (
              filteredChats.map((chat) => {
                const isSelected = chat.id === activeChat?.id;
                return (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#111729] border-l-4 border-l-[#00D9E8]'
                        : 'hover:bg-[#111729]/50'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00D9E8]/20 to-[#E7B43F]/20 border border-[#00D9E8]/40 flex items-center justify-center font-bold text-xs text-white">
                        {chat.customerName ? chat.customerName[0] : 'U'}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#091426] ${
                          chat.isOnline ? 'bg-[#10B981]' : 'bg-[#64748B]'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white truncate">
                          {chat.customerName}
                        </span>
                        <span className="text-[10px] text-[#64748B] flex-shrink-0">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-xs text-[#A7B1C2] truncate">{chat.lastMessage}</p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-medium text-[#E7B43F] bg-[#E7B43F]/10 px-1.5 py-0.2 rounded border border-[#E7B43F]/20">
                          {chat.watchModel || 'Rolex Client'}
                        </span>
                        {chat.unreadCount > 0 && (
                          <span className="ml-auto w-4 h-4 rounded-full bg-[#00D9E8] text-[#070918] font-bold text-[9px] flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Middle Panel: Active Chat Viewport */}
        {activeChat ? (
          <div className="flex-1 flex flex-col bg-[#070918]/80 min-w-0">
            {/* Chat Viewport Header */}
            <div className="h-16 px-6 bg-[#091426] border-b border-[#252D42] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#00D9E8]/20 text-[#00D9E8] flex items-center justify-center font-bold text-sm border border-[#00D9E8]/40">
                  {activeChat.customerName ? activeChat.customerName[0] : 'C'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {activeChat.customerName}
                    </h4>
                    <span className="px-2 py-0.2 text-[9px] font-bold rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A7B1C2] truncate">
                    Interested in: {activeChat.watchModel} • Order #{activeChat.orderId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onConvertToTicket) onConvertToTicket(activeChat);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111729] hover:bg-[#161F38] text-xs font-semibold text-[#00D9E8] border border-[#252D42] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Convert to Ticket</span>
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
              <div className="flex items-center justify-center">
                <span className="px-3 py-1 rounded-full bg-[#111729] border border-[#252D42] text-[10px] text-[#64748B]">
                  Encrypted End-to-End Concierge Channel
                </span>
              </div>

              {(activeChat.messages || []).map((msg) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-md ${
                        isAgent
                          ? 'bg-gradient-to-r from-[#00D9E8]/20 to-[#00B4D8]/20 border border-[#00D9E8]/30 text-white rounded-tr-none'
                          : 'bg-[#111729] border border-[#252D42] text-white rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] text-[#A7B1C2]">
                        <span className="font-semibold text-white">
                          {isAgent ? 'Pooja (Support Lead)' : activeChat.customerName}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Canned responses popover */}
            {showCanned && (
              <div className="p-3 bg-[#091426] border-t border-[#252D42] max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-[#252D42]">
                  <span className="font-bold text-white">Select Fast Reply Template</span>
                  <button onClick={() => setShowCanned(false)} className="text-[#64748B] hover:text-white">
                    Close
                  </button>
                </div>
                {(cannedResponses.length > 0 ? cannedResponses : [
                  {
                    id: 'c1',
                    title: 'Live Tracking Confirmation',
                    content: 'Hello! Your luxury timepiece has been verified by our horology team and is currently scheduled for secured armored delivery.',
                  },
                  {
                    id: 'c2',
                    title: 'Return Guidelines & Security Tag',
                    content: 'Please ensure the tamper-evident security seal on the watch lugs remains unbroken for an instant refund.',
                  },
                ]).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setMessageInput(c.content);
                      setShowCanned(false);
                    }}
                    className="p-2 rounded-lg bg-[#111729] hover:border-[#00D9E8] border border-[#252D42] text-xs cursor-pointer"
                  >
                    <p className="font-semibold text-[#00D9E8]">{c.title}</p>
                    <p className="text-[#A7B1C2] text-[11px] truncate">{c.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Message Input Bottom Bar */}
            <div className="p-4 bg-[#091426] border-t border-[#252D42]">
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setShowCanned(!showCanned)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#00D9E8] hover:underline"
                >
                  <Bookmark className="w-3 h-3" />
                  <span>Insert Canned Response</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    placeholder={`Reply to ${activeChat.customerName}...`}
                    className="w-full bg-[#111729] text-white text-xs px-4 py-3 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] placeholder:text-[#64748B]"
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] font-bold text-xs hover:shadow-[0_0_15px_rgba(0,217,232,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8 text-[#64748B]">
            Select a live chat from the left panel to begin.
          </div>
        )}

        {/* Right Panel: Customer Quick Dossier */}
        {activeChat && (
          <div className="w-72 lg:w-80 border-l border-[#252D42] bg-[#091426]/90 p-5 space-y-5 overflow-y-auto custom-scrollbar hidden xl:block">
            <div>
              <h4 className="text-[11px] uppercase font-bold text-[#64748B] tracking-wider mb-3">
                Client Verification
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#00D9E8]/10 text-[#00D9E8] border border-[#00D9E8]/30 flex items-center justify-center font-bold text-lg">
                  {activeChat.customerName ? activeChat.customerName[0] : 'C'}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{activeChat.customerName}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#E7B43F]/15 text-[#E7B43F] border border-[#E7B43F]/30">
                    VIP Platinum Tier
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#252D42]/60">
                  <span className="text-[#A7B1C2]">Email:</span>
                  <span className="text-white font-medium truncate max-w-[140px]">
                    {activeChat.customerEmail || 'vip@client.com'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#252D42]/60">
                  <span className="text-[#A7B1C2]">Phone:</span>
                  <span className="text-white font-medium">{activeChat.customerPhone || '+91 98200 12345'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#252D42]/60">
                  <span className="text-[#A7B1C2]">Location:</span>
                  <span className="text-white font-medium">Bandra West, Mumbai</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#252D42]">
              <h4 className="text-[11px] uppercase font-bold text-[#64748B] tracking-wider mb-2">
                Order Under Discussion
              </h4>
              <div className="p-3.5 rounded-xl bg-[#111729] border border-[#252D42] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Order ID:</span>
                  <span className="font-mono text-[#00D9E8] font-bold">
                    #{activeChat.orderId || 'WH-ORD-9024'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Product:</span>
                  <span className="text-white font-medium truncate max-w-[130px]">
                    {activeChat.watchModel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Total Value:</span>
                  <span className="text-[#E7B43F] font-bold">₹1,25,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Logistics:</span>
                  <span className="text-[#10B981] font-semibold">Out for Delivery</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#252D42] space-y-2">
              <button
                onClick={() => {
                  if (onConvertToTicket) onConvertToTicket(activeChat);
                }}
                className="w-full py-2.5 rounded-xl bg-[#00D9E8]/10 hover:bg-[#00D9E8] text-[#00D9E8] hover:text-[#070918] border border-[#00D9E8]/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Log Formal Ticket</span>
              </button>

              <button
                onClick={() => {
                  const updated = chats.map((c) =>
                    c.id === activeChat.id ? { ...c, status: 'resolved' } : c
                  );
                  setChats(updated);
                }}
                className="w-full py-2 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Close Conversation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatModule;
