import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { TOKEN_FAQS } from "../../data/tokenFaqData";

export default function SSDTokenFAQ({
  isLight,
  cardClass,
  headingClass,
  mutedClass,
  lang = "en",
}) {
  const [openId, setOpenId] = useState(TOKEN_FAQS[0]?.id || null);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const sectionTitle =
    lang === "te"
      ? "తరచుగా అడిగే ప్రశ్నలు (FAQ)"
      : "Frequently Asked Questions (FAQ)";

  const sectionSubtitle =
    lang === "te"
      ? "ఉచిత ఆఫ్‌లైన్ దర్శన టోకెన్లు, కౌంటర్ ప్రదేశాలు మరియు నిబంధనలపై ముఖ్య సమాచారం"
      : "Essential information regarding free offline darshan tokens, counters, and reporting guidelines";

  return (
    <section
      aria-labelledby="tokens-faq-heading"
      className={`rounded-2xl border p-5 sm:p-6 mb-5 ${cardClass}`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-xl bg-[#D4AF37]/15 p-2 shrink-0">
          <HelpCircle className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h2
            id="tokens-faq-heading"
            className={`font-black text-lg sm:text-xl tracking-tight ${headingClass}`}
          >
            {sectionTitle}
          </h2>
          <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${mutedClass}`}>
            {sectionSubtitle}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {TOKEN_FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          const questionText = lang === "te" ? faq.questionTe : faq.question;
          const answerText = lang === "te" ? faq.answerTe : faq.answer;

          return (
            <div
              key={faq.id}
              className={`rounded-xl border transition-colors overflow-hidden ${
                isLight
                  ? isOpen
                    ? "bg-amber-50/70 border-amber-300"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  : isOpen
                  ? "bg-[#141923] border-[#D4AF37]/50"
                  : "bg-[#0B0E14] border-white/10 hover:border-white/20"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                className="w-full text-left p-4 flex items-center justify-between gap-3 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <span
                  className={`font-extrabold text-sm sm:text-base leading-snug ${
                    isOpen
                      ? isLight
                        ? "text-amber-950 font-black"
                        : "text-[#FFD700] font-black"
                      : headingClass
                  }`}
                >
                  {questionText}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-[#D4AF37] transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${faq.id}`}
                  className="px-4 pb-4 pt-1 animate-fade-in"
                >
                  <p
                    className={`text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                      isLight
                        ? "border-amber-200 text-slate-800"
                        : "border-white/10 text-slate-200"
                    }`}
                  >
                    {answerText}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
