import React, { useState } from 'react';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import {
  Headphones,
  MessageSquare,
  HelpCircle,
  FileText,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';

export const CustomerSupportPage = () => {
  const [activeFaq, setActiveFaq] = useState(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('orders');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Bonjour and welcome to WatchHub VIP Concierge. How may I assist your horological collection today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const faqs = [
    {
      q: 'How does WatchHub verify 100% authenticity of luxury mechanical timepieces?',
      a: 'Every timepiece undergoes multi-point inspection by certified master horologists in Lucerne and Geneva. Watches are validated for serial number match, manufacture calibre authenticity, amplitude, and chronometric beat rate before issuing certified provenance documents.'
    },
    {
      q: 'What is included with the Chronoswiss Open Gear Flying Tourbillon acquisition?',
      a: 'Your acquisition arrives in a handcrafted Swiss lacquered wooden presentation casket with the official 5-year manufacture warranty card, certificate of origin signed by the master watchmaker, operating instruction manual, and certified chronometer rate sheet.'
    },
    {
      q: 'How does the Armoured Satellite Courier delivery work?',
      a: 'High-value timepieces are delivered via specialized armoured vehicles equipped with real-time satellite GPS tracking, dual-custody security, and temperature-controlled vaults. Deliveries require identity verification and a one-time cryptographic authorization code upon arrival.'
    },
    {
      q: 'Can I customize strap lengths and custom engravings before dispatch?',
      a: 'Yes. Our 3D Watch Customization Studio allows you to select custom strap materials, caseback laser engravings, and dial guilloché nuances prior to shipment.'
    },
    {
      q: 'What is the 7-day complimentary return policy?',
      a: 'You have 7 days to inspect the watch at your leisure. As long as all factory seals and stickers remain undisturbed and the watch is unworn, we provide complimentary armoured pickup and full refund.'
    }
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setTicketSubmitted(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `Thank you for your message regarding "${userText}". A dedicated Swiss Horology Concierge has been alerted to your inquiry.`
        }
      ]);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#020813] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#F4B942] selection:text-black">
      <CustomerNavbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 w-full flex-1">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#F4B942] tracking-widest uppercase block">
            CONCIERGE & CLIENT CARE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
            WatchHub Customer Support & Concierge
          </h1>
          <p className="text-xs text-[#A6B1C8] mt-2">
            Available 24 hours a day, 7 days a week for acquisition assistance, provenance queries, and master watchmaker consultations.
          </p>

          {/* Quick Contact Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs">
            <a
              href="tel:+919876543210"
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-white font-semibold"
            >
              <Phone className="w-4 h-4 text-[#00CFFF]" />
              <span>+91 98765 43210</span>
            </a>
            <a
              href="mailto:concierge@watchhub.com"
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-white font-semibold"
            >
              <Mail className="w-4 h-4 text-[#F4B942]" />
              <span>concierge@watchhub.com</span>
            </a>
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00CFFF] to-[#00A3FF] text-[#020813] font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,207,255,0.3)] cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start Live VIP Concierge Chat</span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            2-COLUMN: FAQS ACCORDION + RAISE TICKET FORM
            ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left FAQs (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#00CFFF]" /> Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-[#040C1A] border border-white/10 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-[#00CFFF]' : ''}`} />
                  </button>
                  {activeFaq === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#A6B1C8] leading-relaxed border-t border-white/5 bg-[#020813]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Raise Support Ticket (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-[#040C1A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 text-xs">
            <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#F4B942]" /> Raise a Concierge Support Ticket
            </h3>

            {ticketSubmitted ? (
              <div className="text-center py-6 space-y-3 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-[#39F5A5] mx-auto" />
                <h4 className="text-base font-bold text-white">Ticket #TKT-8910 Logged</h4>
                <p className="text-[#A6B1C8]">
                  Our lead client liaison officer has been assigned. You will receive an update in your customer account portal within 15 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setTicketSubmitted(false)}
                  className="py-2 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
                >
                  Create Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Subject / Inquiry Type</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Inquiring regarding Tourbillon serial allocation"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white outline-none focus:border-[#00CFFF]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Department</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white outline-none cursor-pointer"
                  >
                    <option value="orders">Orders & Delivery Tracking</option>
                    <option value="provenance">Authenticity & Provenance Certification</option>
                    <option value="customization">Customizer Studio & Engraving Inquiry</option>
                    <option value="warranty">5-Year Warranty & Service Request</option>
                    <option value="returns">Returns & Exchange Concierge</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Message</label>
                  <textarea
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Describe your inquiry with detail..."
                    className="w-full p-3 rounded-xl bg-[#020813] border border-white/10 text-white outline-none focus:border-[#00CFFF]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold rounded-xl shadow-md cursor-pointer hover:brightness-110"
                >
                  Submit Support Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* ════════════════════════════════════════════════════════════════
          LIVE CHAT CONCIERGE DRAWER
          ════════════════════════════════════════════════════════════════ */}
      {chatOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-96 max-w-[90vw] bg-[#040C1A] border border-[#00CFFF]/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[480px] animate-scale-up font-sans">
          {/* Header */}
          <div className="p-4 bg-[#061224] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00CFFF]/20 border border-[#00CFFF] flex items-center justify-center text-xs text-[#00CFFF]">
                👑
              </div>
              <div>
                <p className="text-xs font-bold text-white">WatchHub VIP Concierge</p>
                <p className="text-[10px] text-emerald-400">● Live Master Watchmaker Available</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-gray-400 hover:text-white p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#020813]">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-[#00CFFF] text-black font-semibold'
                    : 'bg-[#061224] text-gray-200 border border-white/10'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#061224] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about tourbillons, delivery, materials..."
              className="flex-1 h-9 px-3 bg-[#020813] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#00CFFF]"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CustomerSupportPage;
