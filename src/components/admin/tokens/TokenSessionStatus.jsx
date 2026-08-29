import React from "react";
import { Activity } from "lucide-react";

export default function TokenSessionStatus({
  tokenDay,
  setDayStatus,
  cardClass,
  headingClass,
  mutedClass,
  isLight,
}) {
  if (!tokenDay) return null;

  return (
    <section className={`rounded-2xl border p-4 sm:p-5 ${cardClass}`}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-[#D4AF37]" />

        <h3 className={`font-black ${headingClass}`}>
          Current Session Status
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {
            type: "ssd",
            name: "SSD",
            status: tokenDay.ssd_status,
          },
          {
            type: "dd",
            name: "DD",
            status: tokenDay.dd_status,
          },
        ].map((item) => (
          <div
            key={item.type}
            className={`rounded-xl border p-4 ${
              isLight
                ? "bg-slate-50 border-slate-200"
                : "bg-[#0B0E14] border-white/10"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={`font-black ${headingClass}`}>
                  {item.name}
                </p>

                <p className={`text-xs mt-1 ${mutedClass}`}>
                  Status: {item.status}
                </p>
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setDayStatus(item.type, "active")}
                  className="px-2 py-1 rounded-md text-[10px] font-bold border border-green-500/30 text-green-500 hover:bg-green-500/10"
                >
                  Active
                </button>

                <button
                  type="button"
                  onClick={() => setDayStatus(item.type, "completed")}
                  className="px-2 py-1 rounded-md text-[10px] font-bold border border-red-500/30 text-red-500 hover:bg-red-500/10"
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
