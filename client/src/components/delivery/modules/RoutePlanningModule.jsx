import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  Truck,
  Plus,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Zap,
  Navigation,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const RoutePlanningModule = ({
  routes = [],
  orders = [],
  riders = [],
  couriers = [],
  onCreateRoute = () => { },
}) => {
  const safeRoutes = Array.isArray(routes) ? routes : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeRiders = Array.isArray(riders) ? riders : [];
  const safeCouriers = Array.isArray(couriers) ? couriers : [];

  const [activeRouteId, setActiveRouteId] = useState(safeRoutes[0]?.routeId || '');
  const [selectedRiderId, setSelectedRiderId] = useState('rd_001');
  const [startingWarehouse, setStartingWarehouse] = useState('Central Vault WH-01, New Delhi');
  const [selectedPartner, setSelectedPartner] = useState('Blue Dart Express');
  const [priority, setPriority] = useState('Urgent Express');
  const [selectedOrderIds, setSelectedOrderIds] = useState(['WH-ORD-9021', 'WH-ORD-9027']);

  const currentRoute = safeRoutes.find((r) => r.routeId === activeRouteId) || safeRoutes[0] || null;

  // Route sequence optimization algorithm simulation
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationNotice, setOptimizationNotice] = useState('');

  const handleOptimizeSequence = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationNotice('Multi-stop sequence optimized by AI proximity matrix. Reduced travel time by 18 mins (3.4 km saved).');
      setTimeout(() => setOptimizationNotice(''), 6000);
    }, 800);
  };

  const handleCreateNewRoute = (e) => {
    e.preventDefault();
    const rider = safeRiders.find((r) => r.id === selectedRiderId) || safeRiders[0] || { city: 'New Delhi', id: 'rd_001', name: 'Rohan Singh' };
    const newRoute = {
      routeId: `RT-${Math.floor(100 + Math.random() * 900)}`,
      routeName: `${rider.city} Priority Express Loop`,
      riderId: rider.id,
      riderName: rider.name,
      partnerName: selectedPartner,
      startingWarehouse,
      totalStops: selectedOrderIds.length + 1,
      totalDistanceKm: (10 + selectedOrderIds.length * 3.5).toFixed(1),
      estimatedTimeMin: 45 + selectedOrderIds.length * 20,
      fuelEstimateLiters: (1.2 + selectedOrderIds.length * 0.4).toFixed(1),
      priority,
      status: 'Ready for Dispatch',
      stops: selectedOrderIds.map((id, index) => {
        const order = orders.find((o) => o.orderId === id);
        return {
          stopNumber: index + 1,
          orderId: id,
          customer: order ? order.customerName : 'Customer',
          address: order ? `${order.city} (${order.deliveryAddress})` : 'Destination',
          eta: `${11 + index}:30 AM`,
          status: 'Pending',
        };
      }),
    };

    if (onCreateRoute) {
      onCreateRoute(newRoute);
      setActiveRouteId(newRoute.routeId);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE TITLE & TOP ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Route Planning & Sequence Optimization
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Group multiple watch delivery drops into optimal driver clusters to minimize transit time and carbon footprint.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOptimizeSequence}
            disabled={isOptimizing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF]/25 to-[#00D5FF]/20 hover:bg-[#6500FF]/30 border border-[#00D5FF]/40 text-xs font-bold text-[#00D5FF] transition-all cursor-pointer shadow-md"
          >
            <Zap className={`w-3.5 h-3.5 text-[#00D5FF] ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Optimizing Sequence...' : 'AI Optimize Sequence'}</span>
          </button>
        </div>
      </div>

      {optimizationNotice && (
        <div className="p-3.5 rounded-xl bg-[#00C98B]/15 border border-[#00C98B]/40 text-[#00C98B] flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[#00C98B] flex-shrink-0" />
          <span>{optimizationNotice}</span>
        </div>
      )}

      {/* 2. TOP ROUTE ANALYTICS CARDS */}
      {currentRoute && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
            <span className="text-xs font-semibold text-[#A7B1C2] block">Total Distance</span>
            <span className="text-2xl font-bold text-white block mt-1">{currentRoute.totalDistanceKm} km</span>
            <span className="text-[10px] text-[#00C98B] mt-0.5 block">Shortest route mapped</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
            <span className="text-xs font-semibold text-[#A7B1C2] block">Estimated Travel Time</span>
            <span className="text-2xl font-bold text-[#00D5FF] block mt-1">{currentRoute.estimatedTimeMin} mins</span>
            <span className="text-[10px] text-[#A7B1C2] mt-0.5 block">Includes 10m handover buffer</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
            <span className="text-xs font-semibold text-[#A7B1C2] block">Total Delivery Stops</span>
            <span className="text-2xl font-bold text-[#E9B94F] block mt-1">{currentRoute.totalStops} Stops</span>
            <span className="text-[10px] text-[#A7B1C2] mt-0.5 block">Single driver cluster</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
            <span className="text-xs font-semibold text-[#A7B1C2] block">Fuel / EV Battery Estimate</span>
            <span className="text-2xl font-bold text-[#00C98B] block mt-1">{currentRoute.fuelEstimateLiters} L / 3.8 kWh</span>
            <span className="text-[10px] text-[#00C98B] mt-0.5 block">Low emission zone verified</span>
          </div>
        </div>
      )}

      {/* 3. TWO COLUMNS: LEFT (INTERACTIVE MAP & SEQUENCE) + RIGHT (ROUTE PLANNING FORM) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: MAP & SEQUENCE STOPS (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Route Selector Pill Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {routes.map((r) => (
              <button
                key={r.routeId}
                onClick={() => setActiveRouteId(r.routeId)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${activeRouteId === r.routeId
                  ? 'bg-[#6500FF] border-[#6500FF] text-white shadow-md'
                  : 'bg-[#11172C] border-[#28334B] text-[#A7B1C2] hover:text-white'
                  }`}
              >
                {r.routeName} ({r.routeId})
              </button>
            ))}
          </div>

          {/* Interactive Route Map Canvas */}
          <div className="p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Multi-Waypoint Navigation Map
                </h3>
                <p className="text-xs text-[#A7B1C2]">
                  Origin: <strong className="text-white">{currentRoute?.startingWarehouse}</strong>
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/30">
                {currentRoute?.status}
              </span>
            </div>

            {/* Map Canvas */}
            <div className="relative h-64 rounded-xl bg-[#081529] border border-[#28334B] overflow-hidden p-4 flex flex-col justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(#28334B_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              {/* Origin Hub */}
              <div className="absolute left-[15%] top-[50%] z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#6500FF] border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-[#6500FF]/50">
                  WH
                </div>
                <div className="bg-[#081529] border border-[#6500FF] px-2 py-0.5 rounded text-[9px] text-white whitespace-nowrap mt-1">
                  Start: WH-01
                </div>
              </div>

              {/* Stop 1 */}
              <div className="absolute left-[38%] top-[25%] z-10 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#00D5FF] border-2 border-white flex items-center justify-center text-[10px] font-bold text-black shadow-md">
                  1
                </div>
                <div className="bg-[#081529] border border-[#00D5FF] px-1.5 py-0.2 rounded text-[8.5px] text-white whitespace-nowrap mt-0.5">
                  Stop 1
                </div>
              </div>

              {/* Stop 2 */}
              <div className="absolute left-[62%] top-[35%] z-10 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#00D5FF] border-2 border-white flex items-center justify-center text-[10px] font-bold text-black shadow-md">
                  2
                </div>
                <div className="bg-[#081529] border border-[#00D5FF] px-1.5 py-0.2 rounded text-[8.5px] text-white whitespace-nowrap mt-0.5">
                  Stop 2
                </div>
              </div>

              {/* Stop 3 */}
              <div className="absolute left-[82%] bottom-[25%] z-10 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#E9B94F] border-2 border-white flex items-center justify-center text-[10px] font-bold text-black shadow-md">
                  3
                </div>
                <div className="bg-[#081529] border border-[#E9B94F] px-1.5 py-0.2 rounded text-[8.5px] text-white whitespace-nowrap mt-0.5">
                  Stop 3
                </div>
              </div>

              {/* Route Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#00D5FF] stroke-2 [stroke-dasharray:6_4]">
                <path d="M 120 150 Q 220 80 290 85 T 450 110 T 600 200" fill="none" />
              </svg>

              {/* Footer info */}
              <div className="relative z-10 mt-auto bg-[#11172C]/90 backdrop-blur-md p-2.5 rounded-lg border border-[#28334B] flex items-center justify-between text-[11px]">
                <span className="text-[#A7B1C2]">
                  Assigned Rider: <strong className="text-white">{currentRoute?.riderName}</strong>
                </span>
                <span className="text-[#00C98B] font-bold">
                  Carrier: {currentRoute?.partnerName}
                </span>
              </div>
            </div>

            {/* Stops Sequence Table */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-white block">
                Turn-by-Turn Delivery Stops ({currentRoute?.stops?.length})
              </span>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {currentRoute?.stops?.map((stop) => (
                  <div
                    key={stop.stopNumber}
                    className="p-3 rounded-xl bg-[#081529] border border-[#28334B] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#6500FF]/25 border border-[#6500FF]/50 text-[#00D5FF] flex items-center justify-center font-bold text-[11px]">
                        {stop.stopNumber}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{stop.customer}</span>
                        <span className="text-[11px] text-[#A7B1C2]">{stop.address}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-mono text-[#E9B94F] block">ETA: {stop.eta}</span>
                      <span
                        className={`text-[10px] font-bold ${stop.status === 'Delivered' || stop.status === 'Completed'
                          ? 'text-[#00C98B]'
                          : 'text-[#00D5FF]'
                          }`}
                      >
                        {stop.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: ROUTE PLANNING FORM (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-4">
          <div>
            <h3 className="font-serif font-bold text-base text-white">
              Create New Optimized Route
            </h3>
            <p className="text-xs text-[#A7B1C2]">
              Select starting depot, driver and orders to cluster.
            </p>
          </div>

          <form onSubmit={handleCreateNewRoute} className="space-y-3.5 text-xs">
            {/* Warehouse Select */}
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Starting Warehouse Hub</label>
              <select
                value={startingWarehouse}
                onChange={(e) => setStartingWarehouse(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
              >
                <option value="Central Vault WH-01, New Delhi">Central Vault WH-01, New Delhi</option>
                <option value="Mumbai Western Vault WH-02, Worli">Mumbai Western Vault WH-02, Worli</option>
                <option value="Bengaluru South Vault WH-03, Whitefield">Bengaluru South Vault WH-03, Whitefield</option>
              </select>
            </div>

            {/* Courier Partner */}
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Delivery Logistics Partner</label>
              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
              >
                {couriers.map((cp) => (
                  <option key={cp.id} value={cp.name}>{cp.name}</option>
                ))}
              </select>
            </div>

            {/* Assign Rider */}
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Assigned Rider Fleet</label>
              <select
                value={selectedRiderId}
                onChange={(e) => setSelectedRiderId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
              >
                {riders.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.city} • {r.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Route Priority Class</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
              >
                <option value="Urgent Express">Urgent Express (2-4h)</option>
                <option value="Same Day VIP">Same Day VIP</option>
                <option value="Standard Next-Day">Standard Next-Day</option>
              </select>
            </div>

            {/* Orders Checklist */}
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">
                Select Orders to Cluster ({selectedOrderIds.length} Selected)
              </label>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                {orders.map((o) => {
                  const isChecked = selectedOrderIds.includes(o.orderId);
                  return (
                    <div
                      key={o.orderId}
                      onClick={() =>
                        setSelectedOrderIds((prev) =>
                          prev.includes(o.orderId) ? prev.filter((id) => id !== o.orderId) : [...prev, o.orderId]
                        )
                      }
                      className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer text-xs ${isChecked
                        ? 'bg-[#081529] border-[#6500FF] text-white font-bold'
                        : 'bg-[#081529]/50 border-[#28334B] text-[#A7B1C2]'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${isChecked ? 'bg-[#6500FF] border-[#6500FF] text-white' : 'border-[#28334B]'
                            }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{o.orderId} - {o.customerName}</span>
                      </div>
                      <span className="text-[10px] text-[#E9B94F]">{o.city}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white font-bold text-xs shadow-lg shadow-[#6500FF]/30 cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Compass className="w-4 h-4" />
              <span>Generate & Dispatch Route</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanningModule;
