import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  PlusCircle,
  ThumbsUp,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  Tag,
  ExternalLink,
} from 'lucide-react';

export const KnowledgeBaseModule = ({
  articles = [],
  setArticles,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Shipping & Logistics',
    summary: '',
    content: '',
    status: 'Published',
    tags: 'shipping, delivery, bluedart',
  });

  const categories = [
    'All',
    'Shipping & Logistics',
    'Returns & Exchanges',
    'Refunds & Payments',
    'Warranty & Authenticity',
    'Custom Timepieces',
  ];

  const filteredArticles = articles.filter((art) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      art.title?.toLowerCase().includes(q) ||
      art.summary?.toLowerCase().includes(q) ||
      art.content?.toLowerCase().includes(q);

    const matchesCategory =
      categoryFilter === 'All' || art.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleSaveArticle = (e) => {
    e.preventDefault();
    if (selectedArticle) {
      // Edit
      const updated = articles.map((a) =>
        a.id === selectedArticle.id
          ? {
              ...a,
              title: articleForm.title,
              category: articleForm.category,
              summary: articleForm.summary,
              content: articleForm.content,
              status: articleForm.status,
              tags: articleForm.tags.split(',').map((t) => t.trim()),
            }
          : a
      );
      setArticles(updated);
    } else {
      // Create
      const newArt = {
        id: `art_${Date.now()}`,
        title: articleForm.title,
        category: articleForm.category,
        summary: articleForm.summary,
        content: articleForm.content,
        views: 0,
        helpfulCount: 0,
        helpfulPercentage: 100,
        status: articleForm.status,
        lastUpdated: 'Just now',
        tags: articleForm.tags.split(',').map((t) => t.trim()),
      };
      setArticles([newArt, ...articles]);
    }

    setModalOpen(false);
    setSelectedArticle(null);
    setArticleForm({
      title: '',
      category: 'Shipping & Logistics',
      summary: '',
      content: '',
      status: 'Published',
      tags: '',
    });
  };

  const handleDelete = (artId) => {
    setArticles(articles.filter((a) => a.id !== artId));
    if (selectedArticle?.id === artId) setSelectedArticle(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Knowledge Base & Collector FAQs
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00D9E8]/15 text-[#00D9E8] border border-[#00D9E8]/30 font-semibold">
              {filteredArticles.length} Published Guides
            </span>
          </h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Maintain public and internal documentation on watch warranties, return procedures & logistics
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedArticle(null);
            setArticleForm({
              title: '',
              category: 'Shipping & Logistics',
              summary: '',
              content: '',
              status: 'Published',
              tags: 'luxury, timepiece, care',
            });
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] font-bold text-xs hover:shadow-[0_0_20px_rgba(0,217,232,0.4)] transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Category Pills & Search */}
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

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by title, guidelines, policy rules..."
          className="w-full bg-[#111729] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
        />
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-[#64748B]">
            No knowledge base articles found.
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-5 rounded-2xl bg-[#111729] border border-[#252D42] hover:border-[#00D9E8]/50 transition-all flex flex-col justify-between cursor-pointer group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00D9E8]/10 text-[#00D9E8] border border-[#00D9E8]/20">
                    {art.category}
                  </span>
                  <span className="text-[10px] text-[#64748B]">
                    Updated {art.lastUpdated || 'recently'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#00D9E8] transition-colors line-clamp-2">
                  {art.title}
                </h3>
                <p className="text-xs text-[#A7B1C2] mt-2 line-clamp-3 leading-relaxed">
                  {art.summary || art.content}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#252D42] flex items-center justify-between text-xs text-[#64748B]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{art.views || 450}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[#10B981]">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{art.helpfulPercentage || 98}%</span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArticle(art);
                      setArticleForm({
                        title: art.title,
                        category: art.category,
                        summary: art.summary,
                        content: art.content,
                        status: art.status || 'Published',
                        tags: (art.tags || []).join(', '),
                      });
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[#A7B1C2] hover:text-white hover:bg-[#070918]"
                    title="Edit article"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(art.id);
                    }}
                    className="p-1.5 rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10"
                    title="Delete article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Article Detail View Modal */}
      {selectedArticle && !modalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#00D9E8]/15 text-[#00D9E8] border border-[#00D9E8]/30">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-[#64748B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar mt-3">
              <h2 className="text-xl font-bold text-white">{selectedArticle.title}</h2>
              <div className="p-3.5 rounded-xl bg-[#111729] border border-[#252D42] text-xs text-[#00D9E8] font-medium">
                Summary: {selectedArticle.summary}
              </div>
              <div className="text-xs text-[#A7B1C2] leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
              <h3 className="text-base font-bold text-white">
                {selectedArticle ? 'Edit Knowledge Base Article' : 'New Knowledge Base Article'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#64748B] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="e.g. Tamper-Proof Lug Seal Verification Guidelines"
                  className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">Category</label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                  >
                    <option value="Shipping & Logistics">Shipping & Logistics</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Refunds & Payments">Refunds & Payments</option>
                    <option value="Warranty & Authenticity">Warranty & Authenticity</option>
                    <option value="Custom Timepieces">Custom Timepieces</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">Status</label>
                  <select
                    value={articleForm.status}
                    onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })}
                    className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Internal Staff Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Short Summary *
                </label>
                <input
                  type="text"
                  required
                  value={articleForm.summary}
                  onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                  placeholder="Key takeaway in one concise sentence"
                  className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Article Body & Policy Details *
                </label>
                <textarea
                  rows="5"
                  required
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Enter detailed documentation, step-by-step instructions, or collector guidelines..."
                  className="w-full bg-[#111729] text-white text-xs p-3 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] resize-none"
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
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseModule;
