import React, { useState, useMemo } from 'react';
import {
  Bell,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  ArrowUpRight,
  Download,
  Building2,
  Boxes,
  Clock,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';

export default function ReorderAlertsModule({
  products,
  onGeneratePurchaseRequest,
  onNavigateTab,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // Compute reorder items based on stock threshold
  const reorderItems = useMemo(() => {
    return products
      .filter((p) => p.availableQty <= p.reorderLevel || p.status === 'Low Stock' || p.status === 'Out of Stock')
      .map((p) => {
        let calculatedPriority = 'Low';
        if (p.availableQty === 0 || p.status === 'Out of Stock') {
          calculatedPriority = 'Critical';
        } else if (p.availableQty <= Math.ceil(p.minStock * 0.5)) {
          calculatedPriority = 'High';
        } else if (p.availableQty <= p.minStock) {
          calculatedPriority = 'Medium';
        }

        const estCost = (p.recommendedOrder || 10) * (p.unitCost || 500000);

        return {
          ...p,
          priority: calculatedPriority,
          leadTime: p.brand === 'Rolex' || p.brand === 'Audemars Piguet' ? '14 Days' : '5-7 Days',
          estCost: estCost,
        };
      });
  }, [products]);

  // Filter items
  const filteredItems = useMemo(() => {
    return reorderItems.filter((item) => {
      const matchPriority = priorityFilter === 'All' || item.priority === priorityFilter;
      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      return matchPriority && matchSearch;
    });
  }, [reorderItems, priorityFilter, searchQuery]);

  // Priority counts
  const criticalCount = reorderItems.filter((i) => i.priority === 'Critical').length;
  const highCount = reorderItems.filter((i) => i.priority === 'High').length;
  const mediumCount = reorderItems.filter((i) => i.priority === 'Medium').length;
  const lowCount = reorderItems.filter((i) => i.priority === 'Low').length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(filteredItems.map((i) => i.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handle1ClickGeneratePR = (item) => {
    onGeneratePurchaseRequest({
      supplier: item.supplier,
      destinationWarehouse: item.warehouse,
      items: [
        {
          productId: item.id,
          name: item.name,
          sku: item.sku,
          brand: item.brand,
          quantity: item.recommendedOrder || 10,
          unitCost: item.unitCost,
        },
      ],
      totalCost: item.estCost,
      priority: item.priority === 'Critical' ? 'Urgent' : 'Standard',
      notes: `Automated reorder alert trigger for safety buffer restoration (${item.priority} Priority).`,
    });
  };

  const handleBulkReorder = () => {
    if (selectedProductIds.length === 0) return;
    const selectedItems = reorderItems.filter((i) => selectedProductIds.includes(i.id));
    const totalCost = selectedItems.reduce((sum, i) => sum + i.estCost, 0);

    onGeneratePurchaseRequest({
      supplier: selectedItems[0]?.supplier || 'Rolex Geneva SA / Swiss Imports Ltd',
      destinationWarehouse: selectedItems[0]?.warehouse || 'Main Warehouse',
      items: selectedItems.map((i) => ({
        productId: i.id,
        name: i.name,
        sku: i.sku,
        brand: i.brand,
        quantity: i.recommendedOrder || 10,
        unitCost: i.unitCost,
      })),
      totalCost: totalCost,
      priority: 'Urgent',
      notes: `Bulk procurement generated for ${selectedItems.length} low-stock luxury timepiece SKUs.`,
    });
    setSelectedProductIds([]);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500/20 text-red-500 border border-red-500/40';
      case 'High':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
      default:
        return 'bg-blue-500/20 text-[#00D5FF] border border-blue-500/40';
    }
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-400 border border-amber-500/40">
              Automated Reorder Engine
            </span>
            <span className="text-xs text-[#A7B1C2]">• {reorderItems.length} Threshold Alerts Active</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Reorder Alerts &amp; Safety Stock</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Predictive restock recommendations based on live boutique consumption and supplier manufacturing lead times.
          </p>
        </div>

        {selectedProductIds.length > 0 && (
          <button
            onClick={handleBulkReorder}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#6500FF]/30 transition-all cursor-pointer animate-fade-in"
          >
            <Sparkles className="w-4 h-4 text-[#E9B94F]" />
            <span>Bulk Reorder ({selectedProductIds.length} Items)</span>
          </button>
        )}
      </div>

      {/* 2. Priority KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setPriorityFilter(priorityFilter === 'Critical' ? 'All' : 'Critical')}
          className={`bg-[#11123D] border rounded-2xl p-4 shadow-md cursor-pointer transition-all ${
            priorityFilter === 'Critical' ? 'border-red-500 bg-[#17165A]' : 'border-[#29305D] hover:border-red-500/60'
          }`}
        >
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold text-red-400">Critical Priority</span>
            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-xs">
              0
            </div>
          </div>
          <p className="text-2xl font-black text-red-500">{criticalCount}</p>
          <p className="text-[10px] text-red-400/80 mt-0.5">0 Available Stock</p>
        </div>

        <div
          onClick={() => setPriorityFilter(priorityFilter === 'High' ? 'All' : 'High')}
          className={`bg-[#11123D] border rounded-2xl p-4 shadow-md cursor-pointer transition-all ${
            priorityFilter === 'High' ? 'border-rose-500 bg-[#17165A]' : 'border-[#29305D] hover:border-rose-500/60'
          }`}
        >
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold text-rose-400">High Priority</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-400">{highCount}</p>
          <p className="text-[10px] text-rose-300/80 mt-0.5">&lt;50% Safety Margin</p>
        </div>

        <div
          onClick={() => setPriorityFilter(priorityFilter === 'Medium' ? 'All' : 'Medium')}
          className={`bg-[#11123D] border rounded-2xl p-4 shadow-md cursor-pointer transition-all ${
            priorityFilter === 'Medium' ? 'border-amber-500 bg-[#17165A]' : 'border-[#29305D] hover:border-amber-500/60'
          }`}
        >
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold text-amber-400">Medium Priority</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400">{mediumCount}</p>
          <p className="text-[10px] text-amber-300/80 mt-0.5">At Reorder Level</p>
        </div>

        <div
          onClick={() => setPriorityFilter(priorityFilter === 'Low' ? 'All' : 'Low')}
          className={`bg-[#11123D] border rounded-2xl p-4 shadow-md cursor-pointer transition-all ${
            priorityFilter === 'Low' ? 'border-[#00D5FF] bg-[#17165A]' : 'border-[#29305D] hover:border-[#00D5FF]/60'
          }`}
        >
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold text-[#00D5FF]">Low Priority</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-[#00D5FF] flex items-center justify-center">
              <Boxes className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#00D5FF]">{lowCount}</p>
          <p className="text-[10px] text-[#00D5FF]/80 mt-0.5">Approaching Buffer</p>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert by SKU, timepiece name, supplier..."
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#6500FF]"
            />
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              <option value="All">All Priority Levels</option>
              <option value="Critical">Critical (0 Stock)</option>
              <option value="High">High (&lt;50% Buffer)</option>
              <option value="Medium">Medium (At Reorder Level)</option>
              <option value="Low">Low (Approaching)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Reorder Alerts Table */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#17165A] border-b border-[#29305D] text-[#A7B1C2] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedProductIds.length === filteredItems.length && filteredItems.length > 0}
                    className="rounded text-[#6500FF]"
                  />
                </th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Watch / SKU</th>
                <th className="py-3 px-3">Warehouse</th>
                <th className="py-3 px-3 text-center">Current</th>
                <th className="py-3 px-3 text-center">Min Level</th>
                <th className="py-3 px-3 text-center">Suggested Qty</th>
                <th className="py-3 px-3">Supplier &amp; Lead Time</th>
                <th className="py-3 px-3 text-right">Est. Cost</th>
                <th className="py-3 px-4 text-center">1-Click Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29305D]/50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#17165A]/40 transition-colors">
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(item.id)}
                      onChange={() => handleToggleSelect(item.id)}
                      className="rounded text-[#6500FF]"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${getPriorityBadge(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-contain bg-black/40 border border-[#29305D]" />
                      <div>
                        <p className="font-bold text-white text-xs">{item.name}</p>
                        <p className="text-[10px] font-mono text-[#00D5FF]">{item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-200">{item.warehouse}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold">
                    <span className={item.availableQty === 0 ? 'text-red-500' : 'text-amber-400'}>
                      {item.availableQty}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-[#A7B1C2]">{item.minStock}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                    +{item.recommendedOrder || 10} Units
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-white text-xs truncate max-w-[170px]">{item.supplier}</p>
                    <p className="text-[10px] text-[#A7B1C2]">Lead Time: {item.leadTime}</p>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-white">
                    ₹{(item.estCost / 100000).toFixed(1)} Lakhs
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handle1ClickGeneratePR(item)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold text-[11px] flex items-center gap-1 mx-auto shadow-xs transition-all cursor-pointer"
                    >
                      <span>Generate PR</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
