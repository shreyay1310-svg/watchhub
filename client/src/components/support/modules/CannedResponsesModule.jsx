import React, { useState } from 'react';
import {
  Bookmark,
  PlusCircle,
  Copy,
  Check,
  Search,
  Edit,
  Trash2,
  X,
  FileText,
  Tag,
} from 'lucide-react';

export const CannedResponsesModule = ({
  cannedResponses = [],
  setCannedResponses,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    title: '',
    category: 'Shipping & Delivery',
    content: '',
    shortcut: '/delay',
  });

  const categories = [
    'All',
    'Shipping & Delivery',
    'Returns & Exchanges',
    'Refunds & Payments',
    'Authenticity & Warranty',
    'General Concierge',
  ];

  const filteredTemplates = cannedResponses.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title?.toLowerCase().includes(q) ||
      item.content?.toLowerCase().includes(q) ||
      item.shortcut?.toLowerCase().includes(q);

    const matchesCategory =
      categoryFilter === 'All' || item.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedTemplate) {
      // Edit
      const updated = cannedResponses.map((item) =>
        item.id === selectedTemplate.id ? { ...item, ...templateForm } : item
      );
      setCannedResponses(updated);
    } else {
      // New
      const newItem = {
        id: `can_${Date.now()}`,
        ...templateForm,
        usageCount: 0,
      };
      setCannedResponses([newItem, ...cannedResponses]);
    }
    setModalOpen(false);
    setSelectedTemplate(null);
    setTemplateForm({
      title: '',
      category: 'Shipping & Delivery',
      content: '',
      shortcut: '',
    });
  };

  const handleDelete = (id) => {
    setCannedResponses(cannedResponses.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Canned Responses & Templates
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00D9E8]/15 text-[#00D9E8] border border-[#00D9E8]/30 font-semibold">
              {filteredTemplates.length} Ready Templates
            </span>
          </h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Standardize luxury client communication with dynamic placeholders and 1-click clipboard macros
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedTemplate(null);
            setTemplateForm({
              title: '',
              category: 'Shipping & Delivery',
              content:
                'Dear {customer_name},\n\nThank you for reaching out to WatchHub Luxury Concierge regarding your order #{order_id}.\n\nWarm regards,\nWatchHub Concierge Lead',
              shortcut: '/greet',
            });
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] font-bold text-xs hover:shadow-[0_0_20px_rgba(0,217,232,0.4)] transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Macro Template</span>
        </button>
      </div>

      {/* Placeholders Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#111729] via-[#091426] to-[#111729] border border-[#252D42] text-xs">
        <span className="font-bold text-white block mb-1">Supported Dynamic Placeholders:</span>
        <div className="flex flex-wrap gap-2 text-[11px] text-[#A7B1C2]">
          <code className="px-2 py-0.5 rounded bg-[#070918] text-[#00D9E8] border border-[#252D42]">
            {'{customer_name}'}
          </code>
          <code className="px-2 py-0.5 rounded bg-[#070918] text-[#00D9E8] border border-[#252D42]">
            {'{order_id}'}
          </code>
          <code className="px-2 py-0.5 rounded bg-[#070918] text-[#00D9E8] border border-[#252D42]">
            {'{tracking_id}'}
          </code>
          <code className="px-2 py-0.5 rounded bg-[#070918] text-[#00D9E8] border border-[#252D42]">
            {'{watch_model}'}
          </code>
          <code className="px-2 py-0.5 rounded bg-[#070918] text-[#00D9E8] border border-[#252D42]">
            {'{refund_amount}'}
          </code>
          <code className="px-2 py-0.5 rounded bg-[#070918] text-[#00D9E8] border border-[#252D42]">
            {'{estimated_delivery}'}
          </code>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar border-b border-[#252D42]">
        {categories.map((cat) => {
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-[#00D9E8] text-[#00D9E8] bg-[#111729]'
                  : 'border-transparent text-[#A7B1C2] hover:text-white hover:bg-[#111729]/50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search canned templates by title, macro shortcut (e.g. /delay), or keyword..."
          className="w-full bg-[#111729] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-[#64748B]">
            No canned response templates found.
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="p-5 rounded-2xl bg-[#111729] border border-[#252D42] hover:border-[#00D9E8]/40 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00D9E8]/10 text-[#00D9E8] border border-[#00D9E8]/20">
                    {template.category}
                  </span>
                  {template.shortcut && (
                    <span className="font-mono text-[10px] text-[#E7B43F] bg-[#E7B43F]/10 px-2 py-0.5 rounded border border-[#E7B43F]/20">
                      {template.shortcut}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{template.title}</h3>

                <div className="p-3 rounded-xl bg-[#070918] border border-[#252D42] text-xs text-[#A7B1C2] font-mono leading-relaxed line-clamp-4 whitespace-pre-wrap select-all">
                  {template.content}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#252D42] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#64748B]">
                  Used {template.usageCount || 42} times
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(template.id, template.content)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#00D9E8]/10 hover:bg-[#00D9E8] text-[#00D9E8] hover:text-[#070918] font-bold text-xs transition-colors border border-[#00D9E8]/30 cursor-pointer"
                  >
                    {copiedId === template.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-[#10B981]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setTemplateForm({
                        title: template.title,
                        category: template.category,
                        content: template.content,
                        shortcut: template.shortcut || '',
                      });
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[#A7B1C2] hover:text-white hover:bg-[#070918]"
                    title="Edit Template"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1.5 rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10"
                    title="Delete Template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
              <h3 className="text-base font-bold text-white">
                {selectedTemplate ? 'Edit Response Template' : 'New Response Template'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#64748B] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  value={templateForm.title}
                  onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                  placeholder="e.g. Courier Armored Delay Explanation"
                  className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">Category</label>
                  <select
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                    className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                  >
                    <option value="Shipping & Delivery">Shipping & Delivery</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Refunds & Payments">Refunds & Payments</option>
                    <option value="Authenticity & Warranty">Authenticity & Warranty</option>
                    <option value="General Concierge">General Concierge</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                    Shortcut Macro
                  </label>
                  <input
                    type="text"
                    value={templateForm.shortcut}
                    onChange={(e) => setTemplateForm({ ...templateForm, shortcut: e.target.value })}
                    placeholder="/delay"
                    className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Macro Message Content (with Placeholders) *
                </label>
                <textarea
                  rows="5"
                  required
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                  placeholder="Dear {customer_name}, your timepiece is scheduled for..."
                  className="w-full bg-[#111729] text-white text-xs p-3 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] resize-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#A7B1C2] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918]"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CannedResponsesModule;
