import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewsRatingsTab({
  reviews,
  handleApproveReview,
}) {
  return (
    <div className="space-y-5">
      <div className="bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm flex justify-between items-center">
        <div>
          <h4 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
            <Star className="w-5 h-5 text-watch-gold fill-watch-gold" /> Customer Review Moderation Queue
          </h4>
          <p className="text-xs text-[#A6B1C8] mt-0.5">
            Review, approve, or reply to authentic buyer feedback and unboxing photos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  rev.status.includes('Approved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {rev.status}
                </span>
              </div>

              <h5 className="font-bold text-[#F8FAFC] text-xs mt-2">{rev.title}</h5>
              <p className="text-xs text-[#A6B1C8] mt-1 leading-relaxed">"{rev.comment}"</p>
            </div>

            <div className="pt-3 border-t border-white/10 text-xs space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#F8FAFC]">{rev.customer}</span>
                <span className="text-gray-400 font-mono text-[10px]">{rev.date}</span>
              </div>
              <span className="text-[10.5px] font-bold text-watch-gold block truncate">{rev.watch}</span>

              <div className="flex justify-end gap-2 pt-1">
                {rev.status.includes('Pending') ? (
                  <button
                    onClick={() => handleApproveReview(rev.id)}
                    className="px-3 py-1 bg-watch-gold text-watch-navy-dark font-extrabold rounded-lg text-xs cursor-pointer"
                  >
                    Approve & Publish
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Replied as WatchHub Official to review ${rev.id}`)}
                    className="px-3 py-1 bg-white/5 hover:bg-gray-200 text-[#A6B1C8] font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Reply as WatchHub
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
