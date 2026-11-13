import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import LiveWatchPreview from '../../components/customizer/LiveWatchPreview';
import StepNavigator from '../../components/customizer/StepNavigator';
import CustomizationPanels from '../../components/customizer/CustomizationPanels';
import DesignSummarySidebar, { calculateCustomWatchPrice } from '../../components/customizer/DesignSummarySidebar';
import SavedDesignsModal from '../../components/customizer/SavedDesignsModal';
import { DEFAULT_CUSTOM_WATCH, WATCH_TYPES } from '../../data/customWatchData';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Bookmark, CheckCircle2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const CustomizeWatchPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(2); // Step 2 (Dial) active by default matching mockup!
  const [customWatch, setCustomWatch] = useState(DEFAULT_CUSTOM_WATCH);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load saved designs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('watchhub_saved_designs');
      if (stored) {
        setSavedDesigns(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Could not read saved designs from localStorage', err);
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Add Custom Watch to Cart
  const handleAddToCart = () => {
    const { total } = calculateCustomWatchPrice(customWatch);
    const watchTypeName = WATCH_TYPES.find((t) => t.id === customWatch.watchType)?.name || 'Custom Watch';

    const customCartProduct = {
      id: `custom-${Date.now()}`,
      name: `${watchTypeName} — Bespoke Edition (${customWatch.dial.size}mm)`,
      brand: 'WatchHub Bespoke',
      category: 'Custom Watch',
      price: total,
      originalPrice: Math.round(total * 1.25),
      discount: 20,
      image: customWatch.dial.color === 'blue'
        ? '/images/products/featured_rolex_submariner.jpg'
        : '/images/products/featured_rolex_daytona.jpg',
      customConfig: customWatch,
      stock: 1,
      isCustom: true,
      description: `Bespoke ${watchTypeName}: ${customWatch.dial.shape} ${customWatch.dial.size}mm dial in ${customWatch.dial.color} (${customWatch.dial.finish}), ${customWatch.case.material} case in ${customWatch.case.color}, ${customWatch.strap.material} strap in ${customWatch.strap.color}. Engraving: "${customWatch.personalization.backEngraving || 'NONE'}".`,
    };

    addToCart(customCartProduct);
    setIsAddedToCart(true);
    showToast(`🛒 Bespoke ${watchTypeName} added to Cart!`);
    setTimeout(() => setIsAddedToCart(false), 2400);
  };

  // Save Design
  const handleSaveDesign = () => {
    const newDesign = {
      ...customWatch,
      id: `design-${Date.now()}`,
      name: `Bespoke ${customWatch.dial.color.toUpperCase()} (${customWatch.dial.size}mm)`,
      savedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    const updated = [newDesign, ...savedDesigns];
    setSavedDesigns(updated);
    try {
      localStorage.setItem('watchhub_saved_designs', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save design to localStorage', err);
    }

    setIsSaved(true);
    showToast(`🔖 Custom watch design saved to your collection!`);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDeleteDesign = (id) => {
    const updated = savedDesigns.filter((d) => d.id !== id);
    setSavedDesigns(updated);
    try {
      localStorage.setItem('watchhub_saved_designs', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not update saved designs in localStorage', err);
    }
    showToast('🗑️ Saved design removed.');
  };

  const handleLoadDesign = (design) => {
    setCustomWatch(design);
    showToast(`✨ Loaded design "${design.name}"!`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('📋 Custom watch configuration link copied to clipboard!');
    } else {
      showToast('📋 Design URL ready to share!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-poppins selection:bg-watch-gold selection:text-black">
      {/* 1. Header with Active Customize Your Watch Link */}
      <CustomerNavbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B121C] text-white border border-watch-gold/40 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs animate-scale-up">
          <Sparkles className="w-4 h-4 text-watch-gold flex-shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          2. LUXURY BANNER STAGE (Exact Match to Mockup UI)
          ════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#060B12] via-[#0B1320] to-[#070D18] text-white py-6 sm:py-8 px-4 sm:px-8 border-b border-white/5 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-watch-gold/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white">
              Design Your <span className="text-watch-gold">Own Watch</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 font-medium">
              Your Style. Your Design. Your Timepiece.
            </p>
          </div>

          {/* 3 Value Propositions on Right */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg p-1.5 rounded-xl bg-white/5 border border-white/10">⚙️</span>
              <div>
                <p className="font-bold text-white">Personalize</p>
                <p className="text-[10px] text-gray-400">Every Detail</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg p-1.5 rounded-xl bg-white/5 border border-white/10">💎</span>
              <div>
                <p className="font-bold text-white">Premium</p>
                <p className="text-[10px] text-gray-400">Materials</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg p-1.5 rounded-xl bg-white/5 border border-white/10">👑</span>
              <div>
                <p className="font-bold text-white">A Watch</p>
                <p className="text-[10px] text-gray-400">Uniquely Yours</p>
              </div>
            </div>

            {/* View Saved Designs Button */}
            <button
              type="button"
              onClick={() => setIsSavedModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 border border-watch-gold/40 text-watch-gold font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ml-auto lg:ml-0"
            >
              <Bookmark className="w-3.5 h-3.5 text-watch-gold" />
              <span>Saved Designs ({savedDesigns.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          3. MAIN CUSTOMIZATION STUDIO WORKSPACE (3-Column Layout)
          ════════════════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Step Navigator (2.5 cols on desktop) */}
          <div className="lg:col-span-3 order-1">
            <StepNavigator
              currentStep={currentStep}
              onSelectStep={(step) => setCurrentStep(step)}
              completedSteps={[1, 2, 3, 4, 5, 6, 7].filter((s) => s < currentStep)}
            />
          </div>

          {/* Column 2: Live Watch Preview (4.5 cols on desktop) */}
          <div className="lg:col-span-5 order-2">
            <LiveWatchPreview
              customWatch={customWatch}
              onSelectAngle={(angle) => {
                if (angle === 'back') {
                  showToast('🔍 Viewing exhibition sapphire case-back & engraving');
                }
              }}
            />
          </div>

          {/* Column 3: Active Customization Controls (4 cols on desktop) */}
          <div className="lg:col-span-4 order-3">
            <CustomizationPanels
              currentStep={currentStep}
              customWatch={customWatch}
              onChange={(updated) => setCustomWatch(updated)}
              onNext={() => setCurrentStep((prev) => Math.min(prev + 1, 8))}
              onPrev={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            SUMMARY SIDEBAR ROW & PRICING CARD (Directly below workspace)
            ════════════════════════════════════════════════════════════════ */}
        <div className="mt-8">
          <DesignSummarySidebar
            customWatch={customWatch}
            onAddToCart={handleAddToCart}
            onSaveDesign={handleSaveDesign}
            onShare={handleShare}
            isAddedToCart={isAddedToCart}
            isSaved={isSaved}
          />
        </div>

        {/* ════════════════════════════════════════════════════════════════
            4. BOTTOM TRUST & CRAFTSMANSHIP STRIP (Matching Reference UI)
            ════════════════════════════════════════════════════════════════ */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-6 border-t border-gray-200">
          <div className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center gap-3 shadow-xs">
            <span className="p-2 rounded-xl bg-amber-50 text-watch-gold text-lg">⚙️</span>
            <div>
              <h5 className="text-xs font-bold text-gray-900">Full Customization</h5>
              <p className="text-[10px] text-gray-500">Dial, Case, Strap & More</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center gap-3 shadow-xs">
            <span className="p-2 rounded-xl bg-amber-50 text-watch-gold text-lg">👁️</span>
            <div>
              <h5 className="text-xs font-bold text-gray-900">Live 360° Preview</h5>
              <p className="text-[10px] text-gray-500">See Your Watch in Real Time</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center gap-3 shadow-xs">
            <span className="p-2 rounded-xl bg-amber-50 text-watch-gold text-lg">₹</span>
            <div>
              <h5 className="text-xs font-bold text-gray-900">Transparent Pricing</h5>
              <p className="text-[10px] text-gray-500">Know the Cost Instantly</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center gap-3 shadow-xs">
            <span className="p-2 rounded-xl bg-amber-50 text-watch-gold text-lg">💾</span>
            <div>
              <h5 className="text-xs font-bold text-gray-900">Save &amp; Revisit</h5>
              <p className="text-[10px] text-gray-500">Keep Your Designs Anytime</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center gap-3 shadow-xs col-span-2 sm:col-span-1">
            <span className="p-2 rounded-xl bg-amber-50 text-watch-gold text-lg">🚚</span>
            <div>
              <h5 className="text-xs font-bold text-gray-900">Made for You</h5>
              <p className="text-[10px] text-gray-500">Custom Built &amp; Delivered</p>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Saved Designs Modal */}
      <SavedDesignsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedDesigns={savedDesigns}
        onLoadDesign={handleLoadDesign}
        onDeleteDesign={handleDeleteDesign}
      />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
};

export default CustomizeWatchPage;

