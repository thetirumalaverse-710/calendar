import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Save,
  Ticket,
  Trash2,
} from "lucide-react";
import { supabase } from "../../utils/supabaseClient";
import { getIndiaDateString,
  getIndiaDateTimeLocalValue,
} from "../../utils/indiaTime";

export default function AdminTokenManager({
  lang = "en",
  themeMode = "dark",
}) {
  const isLight = themeMode === "light";

  const [tokenDay, setTokenDay] = useState(null);
  const [observations, setObservations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRequestRef = useRef(0);

  const [dayForm, setDayForm] = useState({
  issuance_date: getIndiaDateString(),
  darshan_date: "",
  issuance_status: "active",
  issuance_started_at: "",
  ssd_quota: "",
  dd_quota: "",
  source_type: "manual",
  source_reference: "",
  notes: "",
});

  const getObservationDateTime = (dateString) => {
  if (!dateString) return getIndiaDateTimeLocalValue();

  const now = getIndiaDateTimeLocalValue();
  const time = now.slice(11, 16);

  return `${dateString}T${time}`;
};

useEffect(() => {
  if (!dayForm.issuance_date) return;

  setObservationForm((previous) => ({
    ...previous,
    observed_at: getObservationDateTime(dayForm.issuance_date),
  }));
}, [dayForm.issuance_date]);

  const [observationForm, setObservationForm] = useState({
    observed_at: getObservationDateTime(dayForm.issuance_date),
    ssd_remaining: "",
    dd_remaining: "",
    ssd_status: "active",
    dd_status: "active",
    source_type: "manual",
    source_reference: "",
    raw_text: "",
  });

  const headingClass = isLight
  ? "!text-slate-900"
  : "!text-white";

const mutedClass = isLight
  ? "!text-slate-600"
  : "!text-slate-300";

  const cardClass = isLight
    ? "bg-white border-slate-200"
    : "bg-[#111722] border-white/10";

  const inputClass = isLight
    ? "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
    : "bg-[#0B0E14] border-white/10 text-white placeholder:text-white/30";

 const getNextCalendarDate = (dateString) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);

  // Use noon to avoid timezone/DST edge cases.
  const date = new Date(year, month - 1, day, 12, 0, 0);
  date.setDate(date.getDate() + 1);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

 const loadTokenData = async () => {
  if (!dayForm.issuance_date) {
    setTokenDay(null);
    setObservations([]);
    setMessage("");
    return;
  }

  const requestId = ++loadRequestRef.current;

  try {
    setLoading(true);
    setError("");
    setMessage("");

    const selectedDate = dayForm.issuance_date;

     

    const nextDate = getNextCalendarDate(selectedDate);

const [year, month, selectedDay] = selectedDate.split("-").map(Number);
const isWednesday = new Date(
  year,
  month - 1,
  selectedDay,
  12,
  0,
  0
).getDay() === 3;

    const { data: day, error: dayError } = await supabase
      .from("token_days")
      .select("*")
      .eq("issuance_date", selectedDate)
      .maybeSingle();

    if (requestId !== loadRequestRef.current) {
  return;
}  

    // Ignore this response if the user has already selected another date.
if (requestId !== loadRequestRef.current) {
  return;
}

    if (dayError) {
      throw dayError;
    }

    // EXISTING SESSION
    if (day) {
      if (requestId !== loadRequestRef.current) {
  return;
}
      setTokenDay(day);

      setDayForm((previous) => ({
        ...previous,
        issuance_date: day.issuance_date,
        darshan_date: day.darshan_date ?? "",
        issuance_status: day.issuance_status ?? "active",
        issuance_started_at: day.issuance_started_at
          ? new Intl.DateTimeFormat("sv-SE", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
              .format(new Date(day.issuance_started_at))
              .replace(" ", "T")
          : "",
        ssd_quota: day.ssd_quota ?? "",
        dd_quota: day.dd_quota ?? "",
        source_type: day.source_type ?? "manual",
        source_reference: day.source_reference ?? "",
        notes: day.notes ?? "",
      }));

      const { data: observationRows, error: observationError } =
        await supabase
          .from("token_observations")
          .select("*")
          .eq("token_day_id", day.id)
          .order("observed_at", { ascending: false });

      if (requestId !== loadRequestRef.current) {
  return;
}

      if (observationError) {
        throw observationError;
      }

      setObservations(observationRows || []);
      return;
    }

    // NEW SESSION
    if (requestId !== loadRequestRef.current) {
  return;
}

    setTokenDay(null);
    setObservations([]);

    setDayForm((previous) => ({
  ...previous,
  darshan_date: nextDate,
  issuance_status: isWednesday ? "no_issuance" : "active",
  issuance_started_at: "",
  ssd_quota: "",
  dd_quota: "",
  source_type: "manual",
  source_reference: "",
  notes: "",
}));
  } catch (err) {
    console.error("Failed to load token data:", err);
    setTokenDay(null);
    setObservations([]);
    setError(err.message || "Failed to load token session.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadTokenData();
  }, [dayForm.issuance_date]);

  const saveTokenDay = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
  issuance_date: dayForm.issuance_date,
  darshan_date: dayForm.darshan_date || null,
  issuance_status: dayForm.issuance_status,
  issuance_started_at: dayForm.issuance_started_at
    ? new Date(dayForm.issuance_started_at).toISOString()
    : null,

  ssd_quota:
    dayForm.ssd_quota === ""
      ? null
      : Number(dayForm.ssd_quota),

  dd_quota:
    dayForm.dd_quota === ""
      ? null
      : Number(dayForm.dd_quota),

  source_type: dayForm.source_type || null,
  source_reference: dayForm.source_reference || null,
  notes: dayForm.notes || null,
};

      const { data, error: saveError } = await supabase
        .from("token_days")
        .upsert(payload, {
          onConflict: "issuance_date",
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setTokenDay(data); 

      await loadTokenData();

      setMessage("Token day saved successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save token day.");
    } finally {
      setSaving(false);
    }
  };

  const addObservation = async (event) => {
    event.preventDefault();

    if (!tokenDay) {
      setError("Save the token issuance session before adding an observation.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        token_day_id: tokenDay.id,

        observed_at: observationForm.observed_at
          ? new Date(observationForm.observed_at).toISOString()
          : new Date().toISOString(),

        ssd_remaining:
          observationForm.ssd_remaining === ""
            ? null
            : Number(observationForm.ssd_remaining),

        dd_remaining:
          observationForm.dd_remaining === ""
            ? null
            : Number(observationForm.dd_remaining),

        ssd_status: observationForm.ssd_status,
        dd_status: observationForm.dd_status,

        source_type: observationForm.source_type || "manual",
        source_reference: observationForm.source_reference || null,
        raw_text: observationForm.raw_text || null,
      };

      const { error: insertError } = await supabase
        .from("token_observations")
        .insert(payload);

      if (insertError) throw insertError;

      setObservationForm({
        observed_at: getObservationDateTime(dayForm.issuance_date),
        ssd_remaining: "",
        dd_remaining: "",
        ssd_status: "active",
        dd_status: "active",
        source_type: "manual",
        source_reference: "",
        raw_text: "",
      });

    await loadTokenData();

    setMessage("Token observation added successfully.");

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add observation.");
    } finally {
      setSaving(false);
    }
  };

  const deleteObservation = async (id) => {
    const confirmed = window.confirm(
      "Delete this token observation? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const { error: deleteError } = await supabase
        .from("token_observations")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await loadTokenData();

      setMessage("Observation deleted.");
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete observation.");
    } finally {
      setSaving(false);
    }
  };

  const setDayStatus = async (type, status) => {
    if (!tokenDay) return;

    try {
      setSaving(true);
      setError("");

      const field = type === "ssd" ? "ssd_status" : "dd_status";

      const { data, error: updateError } = await supabase
        .from("token_days")
        .update({
          [field]: status,
        })
        .eq("id", tokenDay.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setTokenDay(data);
      setMessage(
        `${type.toUpperCase()} status changed to ${status}.`
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 max-h-[80vh] overflow-y-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#D4AF37]" />

            <h2 className={`text-xl font-black ${headingClass}`}>
              {lang === "te"
                ? "SSD / DD టోకెన్ నిర్వహణ"
                : "SSD / DD Token Management"}
            </h2>
          </div>

          <p className={`text-xs mt-1 ${mutedClass}`}>
            {lang === "te"
              ? "రోజువారీ టోకెన్ సమాచారం నిర్వహించండి"
              : "Manage daily SSD and DD token information"}
          </p>
        </div>

        <button
          type="button"
          onClick={loadTokenData}
          disabled={loading || saving}
          className="px-3 py-2 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold flex items-center gap-2 hover:bg-[#D4AF37]/10 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 flex items-center gap-2 text-green-500 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2 text-red-500 text-xs font-bold">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* TOKEN DAY */}
      <section className={`rounded-2xl border p-4 sm:p-5 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#D4AF37]" />

          <h3 className={`font-black ${headingClass}`}>
            Token Issuance Session
          </h3>
        </div>

        <form onSubmit={saveTokenDay} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                Issuance Date
              </span>

              <input
  type="date"
  value={dayForm.issuance_date}
  onChange={(e) => {

    const issuanceDate = e.target.value;

    setDayForm((previous) => ({
      ...previous,
      issuance_date: issuanceDate,
      darshan_date: getNextCalendarDate(issuanceDate),
    }));
  }}
  className={`w-full rounded-xl border px-3 py-2 text-sm ${inputClass}`}
/>
            </label>

            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                Darshan Date
              </span>

              <input
                type="date"
                value={dayForm.darshan_date}
                onChange={(e) =>
                  setDayForm({
                    ...dayForm,
                    darshan_date: e.target.value,
                  })
                }
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
              />
            </label>

            <label className="block">
  <span className={`text-xs font-bold ${mutedClass}`}>
    Issuance Status
  </span>

  <select
    value={dayForm.issuance_status}
    onChange={(e) =>
      setDayForm({
        ...dayForm,
        issuance_status: e.target.value,
      })
    }
    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
  >
    <option value="active">Tokens Issued</option>
    <option value="no_issuance">No Token Issuance</option>
  </select>
</label>

{dayForm.issuance_status === "no_issuance" && (
  <div className="sm:col-span-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3">
    <div className="font-extrabold text-amber-300">
      ⚠️ No SSD/DD token issuance
    </div>
    <div className={`mt-1 text-xs ${mutedClass}`}>
      No tokens are issued on Wednesdays for Thursday darshan.
    </div>
  </div>
)}


            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                Issuance Start
              </span>

              <input
                type="datetime-local"
                value={dayForm.issuance_started_at}
                onChange={(e) =>
                  setDayForm({
                    ...dayForm,
                    issuance_started_at: e.target.value,
                  })
                }
                disabled={dayForm.issuance_status === "no_issuance"}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
              />
            </label>

            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                SSD Quota
              </span>

              <input
                type="number"
                min="0"
                value={dayForm.ssd_quota}
                onChange={(e) =>
                  setDayForm({
                    ...dayForm,
                    ssd_quota: e.target.value,
                  })
                }
                placeholder="e.g. 10000"
                disabled={dayForm.issuance_status === "no_issuance"}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
              />
            </label>

            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                DD Quota
              </span>

              <input
                type="number"
                min="0"
                value={dayForm.dd_quota}
                onChange={(e) =>
                  setDayForm({
                    ...dayForm,
                    dd_quota: e.target.value,
                  })
                }
                placeholder="e.g. 2000"
                disabled={dayForm.issuance_status === "no_issuance"}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
              />
            </label>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                Source
              </span>

              <select
                value={dayForm.source_type}
                onChange={(e) =>
                  setDayForm({
                    ...dayForm,
                    source_type: e.target.value,
                  })
                }
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
              >
                <option value="manual">Manual</option>
                <option value="telegram">Telegram</option>
                <option value="official">Official</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                Source Reference
              </span>

              <input
                type="text"
                value={dayForm.source_reference}
                onChange={(e) =>
                  setDayForm({
                    ...dayForm,
                    source_reference: e.target.value,
                  })
                }
                placeholder="Optional source/message reference"
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
              />
            </label>

          </div>

          <label className="block">
            <span className={`text-xs font-bold ${mutedClass}`}>
              Notes
            </span>

            <textarea
              rows="3"
              value={dayForm.notes}
              onChange={(e) =>
                setDayForm({
                  ...dayForm,
                  notes: e.target.value,
                })
              }
              placeholder="Optional notes about this token issuance session..."
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none focus:border-[#D4AF37] ${inputClass}`}
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0B0E14] font-black text-xs flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Token Session"}
          </button>
        </form>
      </section>

      {/* CURRENT STATUS */}
      {tokenDay && (
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
                      onClick={() =>
                        setDayStatus(item.type, "active")
                      }
                      className="px-2 py-1 rounded-md text-[10px] font-bold border border-green-500/30 text-green-500 hover:bg-green-500/10"
                    >
                      Active
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDayStatus(item.type, "completed")
                      }
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
      )}

      {/* ADD OBSERVATION */}
      <section className={`rounded-2xl border p-4 sm:p-5 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-[#D4AF37]" />

          <h3 className={`font-black ${headingClass}`}>
            Add Token Observation
          </h3>
        </div>

        {!tokenDay ? (
          <div className={`text-sm ${mutedClass}`}>
            Save the token issuance session first.
          </div>
        ) : (
          <form onSubmit={addObservation} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <label className="block">
                <span className={`text-xs font-bold ${mutedClass}`}>
                  Observation Time
                </span>

                <input
                  type="datetime-local"
                  value={observationForm.observed_at}
                  onChange={(e) =>
                    setObservationForm({
                      ...observationForm,
                      observed_at: e.target.value,
                    })
                  }
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
                />
              </label>

              <label className="block">
                <span className={`text-xs font-bold ${mutedClass}`}>
                  SSD Remaining
                </span>

                <input
                  type="number"
                  min="0"
                  value={observationForm.ssd_remaining}
                  onChange={(e) =>
                    setObservationForm({
                      ...observationForm,
                      ssd_remaining: e.target.value,
                    })
                  }
                  placeholder="e.g. 6748"
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
                />
              </label>

              <label className="block">
                <span className={`text-xs font-bold ${mutedClass}`}>
                  DD Remaining
                </span>

                <input
                  type="number"
                  min="0"
                  value={observationForm.dd_remaining}
                  onChange={(e) =>
                    setObservationForm({
                      ...observationForm,
                      dd_remaining: e.target.value,
                    })
                  }
                  placeholder="e.g. 1431"
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
                />
              </label>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <label className="block">
                <span className={`text-xs font-bold ${mutedClass}`}>
                  SSD Status
                </span>

                <select
                  value={observationForm.ssd_status}
                  onChange={(e) =>
                    setObservationForm({
                      ...observationForm,
                      ssd_status: e.target.value,
                    })
                  }
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="unknown">Unknown</option>
                </select>
              </label>

              <label className="block">
                <span className={`text-xs font-bold ${mutedClass}`}>
                  DD Status
                </span>

                <select
                  value={observationForm.dd_status}
                  onChange={(e) =>
                    setObservationForm({
                      ...observationForm,
                      dd_status: e.target.value,
                    })
                  }
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="unknown">Unknown</option>
                </select>
              </label>

            </div>

            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                Raw Source Text
              </span>

              <textarea
                rows="3"
                value={observationForm.raw_text}
                onChange={(e) =>
                  setObservationForm({
                    ...observationForm,
                    raw_text: e.target.value,
                  })
                }
                placeholder="Paste the source message here if useful..."
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none focus:border-[#D4AF37] ${inputClass}`}
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0B0E14] font-black text-xs flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Observation
            </button>
          </form>
        )}
      </section>

      {/* OBSERVATION HISTORY */}
<section className={`rounded-2xl border p-4 sm:p-5 ${cardClass}`}>
  <div className="flex items-center justify-between gap-3 mb-4">
    <div>
      <h3 className={`font-black ${headingClass}`}>
        Token Observations
      </h3>

      <p className={`text-xs mt-1 ${mutedClass}`}>
        {observations.length} observation
        {observations.length === 1 ? "" : "s"}
      </p>
    </div>
  </div>

  {observations.length === 0 ? (
    <div className={`text-sm ${mutedClass}`}>
      No observations recorded yet.
    </div>
  ) : (
    <div className="space-y-2">
      {observations.map((observation) => (
        <div
          key={observation.id}
          className={`rounded-xl border p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
            isLight
              ? "bg-white border-slate-200 text-slate-900"
              : "bg-[#0B0E14] border-white/10 text-white"
          }`}
        >
          {/* Observation details */}
          <div className="min-w-0">
            <p
              className={`text-xs font-black ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {new Date(observation.observed_at).toLocaleString()}
            </p>

            <div className="flex flex-wrap gap-6 mt-2">
              <div className="text-sm font-bold">
                <span
                  className="mr-1"
                  style={{
                    color: isLight ? "#475569" : "#CBD5E1",
                  }}
                >
                  SSD:
                </span>

                <span
                  className="font-black"
                  style={{
                    color: isLight ? "#0F172A" : "#FFFFFF",
                  }}
                >
                  {String(observation.ssd_remaining ?? "—")}
                </span>
              </div>

              <div className="text-sm font-bold">
                <span
                  className="mr-1"
                  style={{
                    color: isLight ? "#475569" : "#CBD5E1",
                  }}
                >
                  DD:
                </span>

                <span
                  className="font-black"
                  style={{
                    color: isLight ? "#0F172A" : "#FFFFFF",
                  }}
                >
                  {String(observation.dd_remaining ?? "—")}
                </span>
              </div>
            </div>
          </div>

          {/* Delete button */}
          <button
            type="button"
            onClick={() => deleteObservation(observation.id)}
            disabled={saving}
            className="self-end sm:self-auto p-2 rounded-lg text-red-500 hover:bg-red-500/10 disabled:opacity-50"
            title="Delete observation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )}
</section>
    </div>
  );
}