import React from "react";
import { ArrowLeftRight, CheckCircle2, AlertCircle, Footprints, Bus } from "lucide-react";

export default function SSDVsDDComparison({
  isLight,
  cardClass,
  headingClass,
  mutedClass,
  lang = "en",
}) {
  const isEn = lang === "en";

  const comparisonRows = [
    {
      feature: isEn ? "Full Name & Slip Name" : "పూర్తి పేరు & టోకెన్ స్లిప్ పేరు",
      ssd: isEn
        ? "Slotted Sarva Darshan (Printed as SSD)"
        : "స్లాటెడ్ సర్వ దర్శనం (స్లిప్‌పై SSD అని ఉంటుంది)",
      dd: isEn
        ? "Divya Darshan (Officially printed as 'SSD Srivari Mettu' on tokens)"
        : "దివ్య దర్శనం (టోకెన్ స్లిప్‌పై 'SSD Srivari Mettu' అని ముద్రించబడుతుంది)",
    },
    {
      feature: isEn ? "When to Walk Footpath" : "కాలినడకన ఎప్పుడు నడవాలి?",
      ssd: isEn
        ? "Not required (Can travel by bus, car, or walk anytime)"
        : "వర్తించదు (బస్సు, కారు లేదా ఎప్పుడైనా నడక)",
      dd: isEn
        ? "MUST walk on the DAY OF DARSHANAM ONLY (not on booking day)"
        : "తప్పనిసరిగా దర్శనం రోజున మాత్రమే నడవాలి (టోకెన్ తీసుకున్న రోజు కాదు)",
    },
    {
      feature: isEn ? "Target Pilgrims" : "ఎవరి కోసం?",
      ssd: isEn
        ? "All general pilgrims arriving via bus, car, or train"
        : "బస్సు, కారు లేదా రైలు ద్వారా వచ్చే సాధారణ భక్తులందరూ",
      dd: isEn
        ? "Pilgrims trekking on foot via Srivari Mettu footpath"
        : "శ్రీవారి మెట్టు కాలినడక మార్గం ద్వారా నడిచి వెళ్లే భక్తులు మాత్రమే",
    },
    {
      feature: isEn ? "Tirupati Counter Locations" : "తిరుపతిలో కౌంటర్ల ప్రదేశాలు",
      ssd: isEn
        ? "Vishnu Nivasam (Railway Stn), Srinivasam (Bus Stand), Bhudevi Complex"
        : "విష్ణు నివాసం (రైల్వే స్టేషన్), శ్రీనివాసం (బస్టాండ్), భూదేవి కాంప్లెక్స్",
      dd: isEn
        ? "Dedicated DD counter at Bhudevi Complex (Alipiri)"
        : "భూదేవి కాంప్లెక్స్ వద్ద ప్రత్యేక DD కౌంటర్ (అలిపిరి)",
    },
    {
      feature: isEn ? "Travel Mode Allowed" : "ప్రయాణ విధానం",
      ssd: isEn
        ? "Any mode (Ghat road bus, jeep, taxi, or walking)"
        : "ఏ మార్గమైనా (ఘాట్ రోడ్డు బస్సు, జీపు, టాక్సీ లేదా నడక)",
      dd: isEn
        ? "Strictly walking on foot via Srivari Mettu on darshan day"
        : "దర్శనం రోజున తప్పనిసరిగా శ్రీవారి మెట్టు ద్వారా కాలినడకనే వెళ్ళాలి",
    },
    {
      feature: isEn ? "Mandatory Scanning Check" : "తప్పనిసరి స్కానింగ్ నిబంధన",
      ssd: isEn
        ? "Direct reporting at ATGH Circle in Tirumala"
        : "తిరుమలలోని ATGH సర్కిల్ వద్ద నేరుగా రిపోర్ట్ చేయాలి",
      dd: isEn
        ? "MUST scan token at the 1200th step on Srivari Mettu on darshan day"
        : "దర్శనం రోజున శ్రీవారి మెట్టు 1200వ మెట్టు వద్ద టోకెన్ తప్పనిసరిగా స్కాన్ చేయించుకోవాలి",
    },
    {
      feature: isEn ? "Cost / Ticket Price" : "ధర / రుసుము",
      ssd: isEn ? "100% Free (No charges)" : "పూర్తిగా ఉచితం (ఉచిత దర్శనం)",
      dd: isEn ? "100% Free (No charges)" : "పూర్తిగా ఉచితం (ఉచిత దర్శనం)",
    },
    {
      feature: isEn ? "Reporting Point in Tirumala" : "తిరుమలలో రిపోర్టింగ్ ప్రదేశం",
      ssd: isEn
        ? "ATGH Circle (at allotted slot time)"
        : "ATGH సర్కిల్ (కేటాయించిన సమయానికి)",
      dd: isEn
        ? "ATGH Circle (at allotted slot time after footpath trek)"
        : "ATGH సర్కిల్ (నడక మార్గం స్కానింగ్ పూర్తయ్యాక)",
    },
    {
      feature: isEn ? "ID Proof Requirement" : "గుర్తింపు కార్డు",
      ssd: isEn
        ? "Original Aadhaar Card (Biometric physical presence)"
        : "అసలు ఆధార్ కార్డు (బయోమెట్రిక్ కోసం వ్యక్తిగత హాజరు)",
      dd: isEn
        ? "Original Aadhaar Card (Biometric physical presence)"
        : "అసలు ఆధార్ కార్డు (బయోమెట్రిక్ కోసం వ్యక్తిగత హాజరు)",
    },
  ];

  return (
    <section
      id="ssd-vs-dd-comparison"
      aria-labelledby="comparison-heading"
      className={`rounded-2xl border p-5 sm:p-6 mb-5 ${cardClass}`}
    >
      {/* Section Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="rounded-xl bg-[#D4AF37]/15 p-2 shrink-0">
          <ArrowLeftRight className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h2
            id="comparison-heading"
            className={`font-black text-lg sm:text-2xl tracking-tight ${headingClass}`}
          >
            {isEn
              ? "Difference Between SSD and DD Tokens in Tirumala"
              : "తిరుమల SSD మరియు DD టోకెన్ల మధ్య ముఖ్య తేడాలు"}
          </h2>
          <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${mutedClass}`}>
            {isEn
              ? "Understand what SSD and DD tokens mean, who they are for, and how the pedestrian footpath rules apply."
              : "స్లాటెడ్ సర్వ దర్శనం (SSD) మరియు దివ్య దర్శనం (DD) టోకెన్ల అర్థం, నిబంధనలు మరియు కాలినడక మార్గ నియమాలను తెలుసుకోండి."}
          </p>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* SSD Card */}
        <div
          className={`p-4 rounded-xl border ${
            isLight
              ? "bg-amber-50/60 border-amber-200/80"
              : "bg-[#141923] border-[#D4AF37]/30"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Bus className="w-5 h-5 text-amber-500" />
            <h3 className={`font-black text-base ${headingClass}`}>
              {isEn ? "What is an SSD Token?" : "SSD టోకెన్ అంటే ఏమిటి?"}
            </h3>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed ${mutedClass}`}>
            {isEn ? (
              <>
                <strong className="text-[#D4AF37]">SSD (Slotted Sarva Darshan)</strong> is a free offline token for general pilgrims. It gives you a dedicated reporting time-slot at Tirumala so you avoid long waiting queues. You can reach Tirumala by bus, jeep, taxi, or walking.
              </>
            ) : (
              <>
                <strong className="text-[#D4AF37]">SSD (స్లాటెడ్ సర్వ దర్శనం)</strong> అనేది సాధారణ భక్తులందరికీ ఇచ్చే ఉచిత ఆఫ్‌లైన్ టోకెన్. దీని ద్వారా నిర్ణీత సమయంలో తిరుమలలో రిపోర్ట్ చేసి సులభంగా దర్శనం చేసుకోవచ్చు. మీరు బస్సు లేదా ఇతర వాహనాల ద్వారా తిరుమలకు చేరుకోవచ్చు.
              </>
            )}
          </p>
        </div>

        {/* DD Card */}
        <div
          className={`p-4 rounded-xl border ${
            isLight
              ? "bg-emerald-50/60 border-emerald-200/80"
              : "bg-[#101b1a] border-emerald-500/30"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Footprints className="w-5 h-5 text-emerald-400" />
            <h3 className={`font-black text-base ${headingClass}`}>
              {isEn ? "What is a DD Token (SSD Srivari Mettu)?" : "DD టోకెన్ (SSD శ్రీవారి మెట్టు) అంటే ఏమిటి?"}
            </h3>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed ${mutedClass}`}>
            {isEn ? (
              <>
                <strong className="text-emerald-400">DD (Divya Darshan)</strong> is officially labelled as <strong className="text-[#D4AF37]">&apos;SSD Srivari Mettu&apos;</strong> on the physical token slips. It is meant exclusively for pedestrian pilgrims. Pilgrims need to walk via Srivari Mettu <span className="underline decoration-amber-400 font-bold">on the day of darshanam only</span> and must scan their token barcode at the 1200th step.
              </>
            ) : (
              <>
                <strong className="text-emerald-400">DD (దివ్య దర్శనం)</strong> టోకెన్ స్లిప్పులపై అధికారికంగా <strong className="text-[#D4AF37]">&apos;SSD Srivari Mettu&apos;</strong> అని ముద్రించబడుతుంది. భక్తులు తప్పనిసరిగా <span className="underline decoration-amber-400 font-bold">దర్శనం రోజున మాత్రమే</span> శ్రీవారి మెట్టు మార్గంలో నడవాలి మరియు 1200వ మెట్టు వద్ద టోకెన్‌ను స్కాన్ చేయించుకోవాలి.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Detailed Side-by-Side Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 shadow-inner">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr
              className={
                isLight
                  ? "bg-slate-100 text-slate-800 border-b border-slate-200"
                  : "bg-[#141923] text-[#FFD700] border-b border-white/10"
              }
            >
              <th className="p-3 sm:p-3.5 font-bold">{isEn ? "Feature" : "అంశం"}</th>
              <th className="p-3 sm:p-3.5 font-bold text-amber-500">
                {isEn ? "SSD Token (Sarva Darshan)" : "SSD టోకెన్ (సర్వ దర్శనం)"}
              </th>
              <th className="p-3 sm:p-3.5 font-bold text-emerald-400">
                {isEn ? "DD Token (SSD Srivari Mettu)" : "DD టోకెన్ (SSD శ్రీవారి మెట్టు)"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {comparisonRows.map((row, idx) => (
              <tr
                key={idx}
                className={
                  idx % 2 === 0
                    ? isLight
                      ? "bg-white"
                      : "bg-[#0B0E14]/40"
                    : isLight
                    ? "bg-slate-50/70"
                    : "bg-[#111622]/50"
                }
              >
                <td className={`p-3 font-semibold ${headingClass}`}>
                  {row.feature}
                </td>
                <td className={`p-3 leading-relaxed ${mutedClass}`}>
                  {row.ssd}
                </td>
                <td className={`p-3 leading-relaxed ${mutedClass}`}>
                  {row.dd}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Helpful Warning Footnote */}
      <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300 leading-relaxed font-medium">
          {isEn
            ? "Important Note: DD tokens are printed as 'SSD Srivari Mettu' on your ticket slip. Pilgrims need to walk via Srivari Mettu on the day of darshanam only (not on the token collection day). If you travel to Tirumala by bus or car without scanning at the 1200th step, your token will be rejected at the ATGH entry counter."
            : "ముఖ్య గమనిక: DD టోకెన్ల స్లిప్‌పై 'SSD Srivari Mettu' అని ముద్రించబడి ఉంటుంది. భక్తులు టోకెన్ తీసుకున్న రోజు కాకుండా కేవలం దర్శనం రోజున మాత్రమే శ్రీవారి మెట్టు ద్వారా నడవాలి. 1200వ మెట్టు వద్ద స్కానింగ్ కాకపోతే తిరుమల ATGH కౌంటర్ వద్ద టోకెన్ అనుమతించబడదు."}
        </p>
      </div>
    </section>
  );
}
