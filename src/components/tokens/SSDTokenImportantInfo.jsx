import React from "react";
import { AlertTriangle } from "lucide-react";

export default function SSDTokenImportantInfo({
  isLight,
  headingClass,
  mutedClass,
  text,
  lang,
}) {
  return (
    <section
      className={`rounded-2xl border p-4 sm:p-5 mb-5 ${
        isLight
          ? "bg-orange-50 border-orange-200"
          : "bg-orange-500/5 border-orange-500/20"
      }`}
    >
      <div className="flex gap-3">
        <AlertTriangle className="w-5 h-5 text-[#FF5722] shrink-0 mt-0.5" />

        <div>
          <h2 className={`font-black text-base ${headingClass}`}>
            {text.important}
          </h2>

          <p
            className={`text-xs sm:text-sm mt-2 leading-relaxed ${mutedClass}`}
          >
            <strong className={headingClass}>
              {lang === "te"
                ? "ఈ వెబ్‌సైట్‌లో టోకెన్ సమాచారం ప్రతి 10 నిమిషాలకు స్వయంచాలకంగా నవీకరించబడుతుంది."
                : "Token information on this website is automatically refreshed every 10 minutes."}
            </strong>{" "}
            {lang === "te"
              ? "టోకెన్ల జారీ సమయాలు స్థిరంగా ఉండవు. రద్దీ మరియు ఇతర నిర్వహణ పరిస్థితులపై ఆధారపడి సమయాలు మారవచ్చు. ఇక్కడ చూపించే చారిత్రక సమయాలు నమోదైన సమాచారం మాత్రమే."
              : "Token issuance times are not fixed and may vary depending on crowd conditions and operational arrangements. Historical timings shown here are recorded information only and should not be treated as a guaranteed schedule."}
          </p>
        </div>
      </div>
    </section>
  );
}
