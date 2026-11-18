import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import DiyBraceletCanvas from '../../components/customizer/DiyBraceletCanvas';
import DiyWristSettings from '../../components/customizer/DiyWristSettings';
import DiyDesignSummary, { calculateDiyPrice } from '../../components/customizer/DiyDesignSummary';
import DiyCataloguePanel from '../../components/customizer/DiyCataloguePanel';
import DiyStepNavigator from '../../components/customizer/DiyStepNavigator';
import DiySizeGuideModal from '../../components/customizer/DiySizeGuideModal';
import DiyFinishPreviewModal from '../../components/customizer/DiyFinishPreviewModal';
import { INITIAL_DIY_CONFIG } from '../../data/diyCustomizerData';
import { useCart } from '../../context/CartContext';
import { Gem, Box, Settings, Sparkles, ChevronRight, Home, CheckCircle2 } from 'lucide-react';

export const CustomizeWatchPage = () => {
  const { addToCart } = useCart();

  const [config, setConfig] = useState(INITIAL_DIY_CONFIG);
  const [currentStep, setCurrentStep] = useState(3); // Step 3 (Choose Beads) active matching Gemloo reference
  const [activeSlide, setActiveSlide] = useState(2); // Center dot active matching reference
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Step click handler
  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
    if (stepId === 6) {
      setIsPreviewModalOpen(true);
    }
  };

  // Add Custom Watch to Cart
  const handleAddToCart = () => {
    const { grandTotal } = calculateDiyPrice(config);

    const bespokeCartProduct = {
      id: `bespoke-diy-${Date.now()}`,
      name: `${config.watchBase.name} — Atelier Gemstone Beaded Edition (${config.wristSizeCm}cm)`,
      brand: 'WatchHub Bespoke Horology',
      category: 'Custom Watch',
      price: grandTotal,
      originalPrice: Math.round(grandTotal * 1.25),
      discount: 20,
      image: '/images/products/rolex-submariner.png',
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      customSpecs: {
        watchBase: config.watchBase.name,
        wristSizeCm: config.wristSizeCm,
        bandMode: config.bandMode,
        band1Bead: config.band1.primaryBead?.name,
        band1BeadSize: config.band1.beadSize,
        band1Count: config.band1.beadsCount,
        band1Accessories: config.band1.accessories,
        band2Bead: config.bandMode === 'double' ? config.band2.primaryBead?.name : null,
        band2Count: config.bandMode === 'double' ? config.band2.beadsCount : null,
      },
    };

    addToCart(bespokeCartProduct, 1);
    setIsAddedToCart(true);
    showToast('✨ Bespoke Beaded Watch successfully added to your shopping cart!');
    setTimeout(() => setIsAddedToCart(false), 3500);
  };

  // Save current design to localStorage
  const handleSaveDesign = () => {
    try {
      const stored = localStorage.getItem('watchhub_diy_saved_designs');
      const list = stored ? JSON.parse(stored) : [];
      const newEntry = {
        id: `design-${Date.now()}`,
        savedAt: new Date().toISOString(),
        config,
      };
      list.unshift(newEntry);
      localStorage.setItem('watchhub_diy_saved_designs', JSON.stringify(list.slice(0, 15)));
      setIsSaved(true);
      showToast('💾 Your custom watch design has been saved to your profile!');
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error(e);
      showToast('Design saved locally!');
    }
  };

  // Share Design
  const handleShareDesign = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Link copied to clipboard! Share your bespoke design with friends.');
    } else {
      showToast('Share link: ' + window.location.href);
    }
  };

  // Reset to initial design
  const handleResetDesign = () => {
    setConfig(INITIAL_DIY_CONFIG);
    setCurrentStep(3);
    showToast('↺ Studio reset to default Gemloo Atelier configuration.');
  };

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Customer Header */}
      <CustomerNavbar />

      {/* Main Studio Container */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Breadcrumb matching "Home > Customize Your Watch" */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-purple-300 font-medium">Customize Your Watch</span>
        </nav>

        {/* 3-Column Top Studio Section: Left Step Nav, Center Canvas, Right Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Title, Subtext, Badges & Step Navigator (cols 3) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Header Title with purple gradient matching Gemloo Image 2 */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Customize <br />
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  Your Watch
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Design a watch bracelet that's uniquely yours. Choose beads, accessories, colors and bands with real-time preview.
              </p>
            </div>

            {/* 3 Feature Bullet Points matching reference icons */}
            <div className="space-y-2 py-1">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Gem className="w-3.5 h-3.5" />
                </div>
                <span>Personalized Design</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Box className="w-3.5 h-3.5" />
                </div>
                <span>Real-time Preview</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Settings className="w-3.5 h-3.5" />
                </div>
                <span>Premium Materials</span>
              </div>
            </div>

            {/* Step Navigator (1 to 6) */}
            <DiyStepNavigator
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          {/* CENTER COLUMN: Central 3D Interactive Canvas & Smartwatch Beaded Ring (cols 6) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <DiyBraceletCanvas
              config={config}
              onOpenPreview={() => setIsPreviewModalOpen(true)}
              activeSlide={activeSlide}
              onSlideChange={setActiveSlide}
            />
          </div>

          {/* RIGHT COLUMN: Band Configuration & Live Design Summary (cols 3) */}
          <div className="lg:col-span-3 space-y-4">
            <DiyWristSettings
              config={config}
              onChange={setConfig}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            />

            <DiyDesignSummary
              config={config}
              onAddToCart={handleAddToCart}
              onSaveDesign={handleSaveDesign}
              onShareDesign={handleShareDesign}
              onResetDesign={handleResetDesign}
              isAddedToCart={isAddedToCart}
              isSaved={isSaved}
            />
          </div>
        </div>

        {/* BOTTOM SECTION: Full Catalogue Panel with Tabs (Beads, Accessories, Colors, Watch Base) */}
        <section className="pt-2">
          <DiyCataloguePanel
            config={config}
            onChange={setConfig}
          />
        </section>
      </main>

      {/* Modals */}
      <DiySizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onSelectSize={(sz) => setConfig((prev) => ({ ...prev, wristSizeCm: sz }))}
      />

      <DiyFinishPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        config={config}
        onAddToCart={handleAddToCart}
        isAddedToCart={isAddedToCart}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#090E24]/95 border border-purple-500/40 text-white text-xs shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md animate-slideUp">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomizeWatchPage;
