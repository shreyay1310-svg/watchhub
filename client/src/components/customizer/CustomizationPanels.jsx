import React from 'react';
import {
  WATCH_TYPES,
  DIAL_CONFIG,
  CASE_CONFIG,
  STRAP_CONFIG,
  MOVEMENT_CONFIG,
  FEATURES_CONFIG,
  HANDS_MARKERS_CONFIG,
} from '../../data/customWatchData';
import { Check, Sparkles, ChevronRight, ChevronLeft, ShieldCheck, Award } from 'lucide-react';

export const CustomizationPanels = ({
  currentStep,
  customWatch,
  onChange,
  onNext,
  onPrev,
}) => {
  const percentComplete = Math.round((currentStep / 8) * 100);

  // Helper updater for nested properties
  const updateNested = (section, key, value) => {
    onChange({
      ...customWatch,
      [section]: {
        ...customWatch[section],
        [key]: value,
      },
    });
  };

  const toggleFeature = (featureId) => {
    const currentFeatures = customWatch.features || [];
    const exists = currentFeatures.includes(featureId);
    const updated = exists
      ? currentFeatures.filter((f) => f !== featureId)
      : [...currentFeatures, featureId];
    onChange({ ...customWatch, features: updated });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-7 font-poppins flex flex-col justify-between min-h-[500px]">
      <div>
        {/* Step Header with Progress */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-100">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-watch-gold uppercase block">
              Step {currentStep} of 8
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
              {currentStep === 1 && 'Select Watch Architecture'}
              {currentStep === 2 && 'Customize Dial & Proportions'}
              {currentStep === 3 && 'Choose Case & Bezel Materials'}
              {currentStep === 4 && 'Tailor Strap & Buckle'}
              {currentStep === 5 && 'Movement Caliber & Complications'}
              {currentStep === 6 && 'Timepiece Hands & Hour Markers'}
              {currentStep === 7 && 'Custom Engraving & Personalization'}
              {currentStep === 8 && 'Review Complete Specifications'}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-gray-700">{percentComplete}% Complete</span>
            <div className="w-24 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-watch-gold to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            STEP 1: WATCH TYPE
            ══════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-xs text-gray-500">
              Choose your foundation style. Each type has tailored movement compatibility and case geometry.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {WATCH_TYPES.map((type) => {
                const isSelected = customWatch.watchType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => onChange({ ...customWatch, watchType: type.id })}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-watch-gold bg-amber-50/60 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-gray-50 border border-gray-100">
                        {type.icon}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{type.name}</h4>
                        <p className="text-[11px] text-gray-500">{type.subtitle}</p>
                        <span className="text-xs font-black text-amber-800 mt-1 block">
                          ₹{type.basePrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-watch-gold text-black flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 2: DIAL (Shape, Size, Color, Finish)
            ══════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in max-h-[420px] overflow-y-auto pr-1">
            {/* 1. Dial Shape */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Dial Shape</label>
              <div className="grid grid-cols-5 gap-2">
                {DIAL_CONFIG.shapes.map((shape) => {
                  const isSelected = customWatch.dial.shape === shape.id;
                  return (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => updateNested('dial', 'shape', shape.id)}
                      className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'border-watch-gold bg-amber-50/60 font-bold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xl">{shape.icon}</span>
                      <span className="text-[11px] text-gray-800">{shape.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Dial Size */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-800">Dial Diameter</label>
                <span className="text-xs font-bold text-watch-gold-dark">{customWatch.dial.size} mm</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DIAL_CONFIG.sizes.map((s) => {
                  const isSelected = customWatch.dial.size === s.size;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => {
                        updateNested('dial', 'size', s.size);
                        updateNested('case', 'size', s.size);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-100 text-amber-950 border border-watch-gold shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Dial Color */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Dial Colour</label>
              <div className="flex flex-wrap items-center gap-2">
                {DIAL_CONFIG.colors.map((color) => {
                  const isSelected = customWatch.dial.color === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        updateNested('dial', 'color', color.id);
                        updateNested('dial', 'customHex', color.hex);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                        isSelected ? 'scale-115 border-watch-gold shadow-md' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} ${color.price > 0 ? `(+₹${color.price})` : ''}`}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 stroke-[3] ${
                            ['white', 'silver', 'champagne', 'gold'].includes(color.id)
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}

                {/* Custom Color Picker */}
                <div className="flex items-center gap-1.5 ml-1">
                  <input
                    type="color"
                    value={customWatch.dial.customHex || '#1B3B6F'}
                    onChange={(e) => {
                      updateNested('dial', 'color', 'custom');
                      updateNested('dial', 'customHex', e.target.value);
                    }}
                    className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
                    title="Pick Any Custom Color"
                  />
                  <span className="text-[11px] text-gray-500 font-medium">+ Custom</span>
                </div>
              </div>
            </div>

            {/* 4. Dial Finish */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Dial Finish</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {DIAL_CONFIG.finishes.map((f) => {
                  const isSelected = customWatch.dial.finish === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => updateNested('dial', 'finish', f.id)}
                      className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-watch-gold bg-amber-50/60 font-bold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xs text-gray-800 block font-bold">{f.name}</span>
                      <span className="text-[10px] text-gray-500 block truncate">{f.desc}</span>
                      {f.price > 0 && (
                        <span className="text-[10px] text-amber-800 font-bold block mt-1">+₹{f.price}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 3: CASE (Material, Color, Shape)
            ══════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in max-h-[420px] overflow-y-auto pr-1">
            {/* Case Material */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Case Material & Grade</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CASE_CONFIG.materials.map((mat) => {
                  const isSelected = customWatch.case.material === mat.id;
                  return (
                    <div
                      key={mat.id}
                      onClick={() => updateNested('case', 'material', mat.id)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-watch-gold bg-amber-50/60 font-bold shadow-xs'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{mat.name}</h4>
                        <p className="text-[10.5px] text-gray-500">{mat.grade}</p>
                      </div>
                      <span className="text-xs font-black text-amber-800">
                        {mat.price > 0 ? `+₹${mat.price.toLocaleString('en-IN')}` : 'Included'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Case Finish / Color */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Case Color & Metal Coating</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CASE_CONFIG.colors.map((c) => {
                  const isSelected = customWatch.case.color === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateNested('case', 'color', c.id)}
                      className={`p-2.5 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-watch-gold bg-amber-50/60 font-bold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-gray-400 flex-shrink-0"
                        style={{ background: c.hex }}
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold text-gray-800 block">{c.name}</span>
                        {c.price > 0 && (
                          <span className="text-[10px] text-amber-800 block">+₹{c.price}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Case Shape */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Case Profile Shape</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CASE_CONFIG.shapes.map((s) => {
                  const isSelected = customWatch.case.shape === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateNested('case', 'shape', s.id)}
                      className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-watch-gold bg-amber-50/60 font-bold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-gray-900 block">{s.name}</span>
                      <span className="text-[10px] text-gray-500 block">{s.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 4: STRAP (Material, Color, Width, Style)
            ══════════════════════════════════════════════════════════════ */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fade-in max-h-[420px] overflow-y-auto pr-1">
            {/* Strap Material */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Strap Material</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STRAP_CONFIG.materials.map((mat) => {
                  const isSelected = customWatch.strap.material === mat.id;
                  return (
                    <div
                      key={mat.id}
                      onClick={() => updateNested('strap', 'material', mat.id)}
                      className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-watch-gold bg-amber-50/60 font-bold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-gray-900">{mat.name}</h4>
                      <p className="text-[10px] text-gray-500 truncate">{mat.desc}</p>
                      <span className="text-[11px] font-bold text-amber-800 block mt-1">
                        {mat.price > 0 ? `+₹${mat.price.toLocaleString('en-IN')}` : 'Included'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strap Color */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Strap Colour</label>
              <div className="flex flex-wrap items-center gap-2">
                {STRAP_CONFIG.colors.map((c) => {
                  const isSelected = customWatch.strap.color === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateNested('strap', 'color', c.id)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                        isSelected ? 'scale-115 border-watch-gold shadow-md' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 stroke-[3] text-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strap Width & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">Lug / Strap Width</label>
                <div className="flex flex-wrap gap-1.5">
                  {STRAP_CONFIG.widths.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => updateNested('strap', 'width', w)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        customWatch.strap.width === w
                          ? 'bg-amber-100 text-amber-950 border border-watch-gold'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {w} mm
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">Strap Pattern / Style</label>
                <select
                  value={customWatch.strap.style}
                  onChange={(e) => updateNested('strap', 'style', e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-watch-gold"
                >
                  {STRAP_CONFIG.styles.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.desc})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 5: MOVEMENT & FEATURES
            ══════════════════════════════════════════════════════════════ */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-fade-in max-h-[420px] overflow-y-auto pr-1">
            {/* Movement Engine */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Movement Caliber</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MOVEMENT_CONFIG.map((m) => {
                  const isSelected = customWatch.movement === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => onChange({ ...customWatch, movement: m.id })}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-watch-gold bg-amber-50/60 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-gray-900">{m.name}</h4>
                          <span className="text-xs font-black text-amber-800">
                            {m.price > 0 ? `+₹${m.price.toLocaleString('en-IN')}` : 'Included'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{m.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technical Features & Complications */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Complications & Hardware Features</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FEATURES_CONFIG.map((feat) => {
                  const isChecked = (customWatch.features || []).includes(feat.id);
                  return (
                    <div
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'border-watch-gold bg-amber-50/40 text-gray-900 font-bold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{feat.icon}</span>
                        <div>
                          <p className="text-xs font-semibold">{feat.name}</p>
                          <p className="text-[10px] text-gray-400">{feat.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-amber-800">+₹{feat.price}</span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked ? 'bg-watch-gold border-watch-gold text-black' : 'border-gray-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 6: HANDS & MARKERS
            ══════════════════════════════════════════════════════════════ */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-fade-in max-h-[420px] overflow-y-auto pr-1">
            {/* Hands Color */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Timepiece Hands Color</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {HANDS_MARKERS_CONFIG.hands.map((h) => {
                  const isSelected = customWatch.hands === h.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => onChange({ ...customWatch, hands: h.id })}
                      className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-watch-gold bg-amber-50/60 font-bold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-gray-400" style={{ backgroundColor: h.hex }} />
                      <span className="text-xs font-bold text-gray-800">{h.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hour Markers */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">Hour Markers Styling</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {HANDS_MARKERS_CONFIG.markers.map((m) => {
                  const isSelected = customWatch.markers === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => onChange({ ...customWatch, markers: m.id })}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-watch-gold bg-amber-50/60 font-bold shadow-xs'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{m.name}</h4>
                        <p className="text-[10.5px] text-gray-500">{m.desc}</p>
                      </div>
                      <span className="text-xs font-black text-amber-800">
                        {m.price > 0 ? `+₹${m.price}` : 'Included'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 7: PERSONALIZATION (Dial Name & Back Engraving)
            ══════════════════════════════════════════════════════════════ */}
        {currentStep === 7 && (
          <div className="space-y-5 animate-fade-in max-h-[420px] overflow-y-auto pr-1">
            <div className="bg-amber-50/70 border border-watch-gold/30 rounded-2xl p-3.5 flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-watch-gold flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950">
                <p className="font-bold">Permanent Precision Laser Engraving</p>
                <p className="text-[11px] text-amber-900/80 mt-0.5">
                  Your initials or custom text are engraved on the watch dial and 316L case-back. Preview updates in real time!
                </p>
              </div>
            </div>

            {/* Custom Dial Text */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-800">Custom Dial Text (Under WatchHub Logo)</label>
                <span className="text-[11px] text-gray-400">
                  {(customWatch.personalization.dialText || '').length} / 15 chars
                </span>
              </div>
              <input
                type="text"
                maxLength={15}
                value={customWatch.personalization.dialText || ''}
                onChange={(e) => updateNested('personalization', 'dialText', e.target.value.toUpperCase())}
                placeholder="e.g. CUSTOM, SHREYA, BESPOKE"
                className="w-full text-xs font-bold p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-watch-gold uppercase"
              />
            </div>

            {/* Back Case Engraving */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-800">Exhibition Back Case Engraving</label>
                <span className="text-[11px] text-gray-400">
                  {(customWatch.personalization.backEngraving || '').length} / 30 chars
                </span>
              </div>
              <input
                type="text"
                maxLength={30}
                value={customWatch.personalization.backEngraving || ''}
                onChange={(e) => updateNested('personalization', 'backEngraving', e.target.value)}
                placeholder="e.g. S.Y. • 13.11.2026 • Live Every Second"
                className="w-full text-xs font-bold p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-watch-gold"
              />
            </div>

            {/* Engraving Font */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1.5">Engraving Typography Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'serif', name: 'Classic Roman', font: 'font-serif' },
                  { id: 'sans', name: 'Modern Clean', font: 'font-sans' },
                  { id: 'mono', name: 'Technical Horology', font: 'font-mono' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateNested('personalization', 'font', f.id)}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      customWatch.personalization.font === f.id
                        ? 'border-watch-gold bg-amber-50/60 font-bold'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-sm block ${f.font}`}>Abc 123</span>
                    <span className="text-[10px] text-gray-500">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 8: REVIEW & ORDER
            ══════════════════════════════════════════════════════════════ */}
        {currentStep === 8 && (
          <div className="space-y-4 animate-fade-in max-h-[420px] overflow-y-auto pr-1 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-emerald-900">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-bold">Your Custom Timepiece Design is Complete!</p>
                <p className="text-[11px] text-emerald-800/80">
                  Hand-crafted to order in our Swiss-certified Mumbai horology lab. Includes complimentary engraving inspection.
                </p>
              </div>
            </div>

            {/* Specifications Summary Card */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2">
              <h4 className="font-bold text-gray-900 pb-2 border-b border-gray-200">
                Full Technical Specifications:
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                <div>
                  <span className="text-gray-400 block">Watch Type</span>
                  <span className="font-bold text-gray-900 capitalize">{customWatch.watchType} Watch</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Dial Details</span>
                  <span className="font-bold text-gray-900 capitalize">
                    {customWatch.dial.shape}, {customWatch.dial.size}mm, {customWatch.dial.color} ({customWatch.dial.finish})
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Case & Bezel</span>
                  <span className="font-bold text-gray-900 capitalize">
                    {customWatch.case.material}, {customWatch.case.color}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Strap & Clasp</span>
                  <span className="font-bold text-gray-900 capitalize">
                    {customWatch.strap.material}, {customWatch.strap.color} ({customWatch.strap.width}mm)
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Movement Caliber</span>
                  <span className="font-bold text-gray-900 capitalize">{customWatch.movement}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Back Case Engraving</span>
                  <span className="font-bold text-amber-800">
                    "{customWatch.personalization.backEngraving || 'NONE'}"
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges Strip */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10.5px]">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-watch-gold mx-auto mb-1" />
                <span className="font-bold text-gray-800 block">5-Year Warranty</span>
                <span className="text-gray-400 text-[9.5px]">Direct Brand Assurance</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <Award className="w-4 h-4 text-watch-gold mx-auto mb-1" />
                <span className="font-bold text-gray-800 block">100% Authentic</span>
                <span className="text-gray-400 text-[9.5px]">Swiss Movement Grade</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <Sparkles className="w-4 h-4 text-watch-gold mx-auto mb-1" />
                <span className="font-bold text-gray-800 block">Custom Built</span>
                <span className="text-gray-400 text-[9.5px]">Crafted Just for You</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM STEP NAVIGATION BUTTONS (Previous / Next)
          ══════════════════════════════════════════════════════════════ */}
      <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            currentStep === 1
              ? 'opacity-30 cursor-not-allowed text-gray-400 bg-gray-100'
              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={currentStep === 8}
          className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
            currentStep === 8
              ? 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-500'
              : 'bg-watch-navy text-white hover:bg-watch-gold hover:text-black'
          }`}
        >
          <span>{currentStep === 7 ? 'Review Final Specs →' : 'Next Step'}</span>
          {currentStep < 7 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default CustomizationPanels;

