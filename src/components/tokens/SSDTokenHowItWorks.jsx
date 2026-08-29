import React from "react";
import { Info } from "lucide-react";

const HOW_IT_WORKS_STEPS = [
  {
    n: "01",
    title: "Obtain the token",
    body: "Visit the applicable token centre and follow the instructions given there.",
  },
  {
    n: "02",
    title: "Check your slot",
    body: "Read the reporting date and time assigned on your token.",
  },
  {
    n: "03",
    title: "Report at ATGH Circle",
    body: "Both SSD and DD token holders must report at ATGH Circle according to the date and time assigned on their token.",
  },
];

export default function SSDTokenHowItWorks({
  isLight,
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
        <Info className="w-5 h-5 text-[#D4AF37]" />

        <h2 className={`font-black text-lg ${headingClass}`}>
          {text.how}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {HOW_IT_WORKS_STEPS.map((step) => (
          <div
            key={step.n}
            className={`tv-card-hover rounded-xl border p-4 ${
              isLight
                ? "bg-slate-50 border-slate-200 hover:border-[#D4AF37]/50 hover:bg-white"
                : "bg-[#0B0E14] border-white/10 hover:border-[#D4AF37]/40 hover:bg-[#151A24]"
            }`}
          >
            <span className="text-[#D4AF37] text-xs font-black">
              {step.n}
            </span>

            <h3 className={`font-extrabold text-sm mt-2 ${headingClass}`}>
              {step.title}
            </h3>

            <p className={`text-xs mt-1.5 leading-relaxed ${mutedClass}`}>
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
