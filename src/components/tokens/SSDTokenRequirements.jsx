import React from "react";
import { ShieldCheck } from "lucide-react";

const REQUIREMENTS = [
  "Carry the original Aadhaar card.",
  "Each person must physically stand in the queue to obtain a token.",
  "The token specifies the assigned reporting date and time for darshan.",
  "The reporting point for both SSD and DD token holders is ATGH Circle.",
  "DD token holders must go through Srivari Mettu only.",
  "DD token holders must scan their token at the 1200th step on the day of darshan.",
];

export default function SSDTokenRequirements({
  cardClass,
  headingClass,
  mutedClass,
  text,
}) {
  return (
    <section
      className={`rounded-2xl border p-5 sm:p-6 mb-5 ${cardClass}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />

        <h2 className={`font-black text-lg ${headingClass}`}>
          {text.requirements}
        </h2>
      </div>

      <div className="space-y-3">
        {REQUIREMENTS.map((item, index) => (
          <div key={index} className="flex gap-3 items-start">
            <span className="w-6 h-6 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-black flex items-center justify-center shrink-0">
              {index + 1}
            </span>

            <p className={`text-sm leading-relaxed ${mutedClass}`}>
              {item}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
