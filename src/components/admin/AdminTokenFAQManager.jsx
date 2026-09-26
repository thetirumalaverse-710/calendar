import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { TOKEN_FAQS } from '../../data/tokenFaqData';
import {
  pullTokenFaqsFromCloud,
  saveTokenFaqOrderToCloud,
  deleteTokenFaqFromCloud
} from '../../utils/tokenFaqCloud';
import { updateTokenFaqStructuredData } from '../../utils/structuredData';

export default function AdminTokenFAQManager({
  lang = 'en',
  themeMode = 'dark',
  onFaqsUpdated
}) {
  const isLight = themeMode === 'light';

  const [faqs, setFaqs] = useState(() =>
    TOKEN_FAQS.map((f, idx) => ({
      id: f.id,
      question: f.question,
      questionTe: f.questionTe || '',
      answer: f.answer,
      answerTe: f.answerTe || '',
      sortOrder: idx + 1,
      isActive: true
    }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success' | 'error', text: '' }
  const [deletedIds, setDeletedIds] = useState([]);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [faqForm, setFaqForm] = useState({
    question: '',
    questionTe: '',
    answer: '',
    answerTe: '',
    isActive: true
  });

  // Load existing FAQs from Cloud on mount
  useEffect(() => {
    let cancelled = false;
    const loadFaqs = async () => {
      try {
        setLoading(true);
        const res = await pullTokenFaqsFromCloud();
        if (!cancelled && res.success && Array.isArray(res.faqs) && res.faqs.length > 0) {
          setFaqs(res.faqs);
        }
      } catch (err) {
        console.warn('Failed to load FAQs in admin manager:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadFaqs();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStartAdd = () => {
    setEditingId(null);
    setIsAdding(true);
    setFaqForm({
      question: '',
      questionTe: '',
      answer: '',
      answerTe: '',
      isActive: true
    });
    setStatusMsg(null);
  };

  const handleStartEdit = (faq) => {
    setIsAdding(false);
    setEditingId(faq.id);
    setFaqForm({
      question: faq.question || '',
      questionTe: faq.questionTe || faq.question_te || '',
      answer: faq.answer || '',
      answerTe: faq.answerTe || faq.answer_te || '',
      isActive: faq.isActive !== false && faq.is_active !== false
    });
    setStatusMsg(null);
  };

  const handleCancelForm = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      setStatusMsg({
        type: 'error',
        text: lang === 'te' ? 'ఆంగ్ల ప్రశ్న మరియు సమాధానం తప్పనిసరి.' : 'English question and answer are required.'
      });
      return;
    }

    if (isAdding) {
      const newId = `faq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newFaq = {
        id: newId,
        question: faqForm.question.trim(),
        questionTe: faqForm.questionTe.trim() || faqForm.question.trim(),
        answer: faqForm.answer.trim(),
        answerTe: faqForm.answerTe.trim() || faqForm.answer.trim(),
        sortOrder: faqs.length + 1,
        isActive: faqForm.isActive
      };
      setFaqs(prev => [...prev, newFaq]);
      setIsAdding(false);
      setStatusMsg({
        type: 'success',
        text: lang === 'te' ? 'కొత్త ప్రశ్న జాబితాలో చేర్చబడింది. భద్రపరచడానికి "Save Changes" క్లిక్ చేయండి.' : 'New FAQ added to list. Click "Save Changes to Cloud" to persist.'
      });
    } else if (editingId) {
      setFaqs(prev =>
        prev.map(item =>
          item.id === editingId
            ? {
                ...item,
                question: faqForm.question.trim(),
                questionTe: faqForm.questionTe.trim() || item.questionTe || faqForm.question.trim(),
                answer: faqForm.answer.trim(),
                answerTe: faqForm.answerTe.trim() || item.answerTe || faqForm.answer.trim(),
                isActive: faqForm.isActive
              }
            : item
        )
      );
      setEditingId(null);
      setStatusMsg({
        type: 'success',
        text: lang === 'te' ? 'ప్రశ్న నవీకరించబడింది. భద్రపరచడానికి "Save Changes" క్లిక్ చేయండి.' : 'FAQ updated in list. Click "Save Changes to Cloud" to persist.'
      });
    }
  };

  const handleToggleActive = (id) => {
    setFaqs(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, isActive: item.isActive === false ? true : false }
          : item
      )
    );
    setStatusMsg({
      type: 'success',
      text: lang === 'te' ? 'ప్రశ్న స్థితి మార్చబడింది. భద్రపరచడానికి "Save Changes" క్లిక్ చేయండి.' : 'FAQ visibility toggled. Click "Save Changes to Cloud" to persist.'
    });
  };

  const handleDelete = (id) => {
    const confirmMsg =
      lang === 'te'
        ? 'ఈ ప్రశ్నను ఖచ్చితంగా తొలగించాలనుకుంటున్నారా?'
        : 'Are you sure you want to delete this FAQ?';
    if (!window.confirm(confirmMsg)) return;

    setFaqs(prev => prev.filter(f => f.id !== id));
    setDeletedIds(prev => [...prev, id]);
    if (editingId === id) setEditingId(null);
    setStatusMsg({
      type: 'success',
      text: lang === 'te' ? 'ప్రశ్న తొలగించబడింది. మార్పులను భద్రపరచడానికి "Save Changes" క్లిక్ చేయండి.' : 'FAQ removed from list. Click "Save Changes to Cloud" to persist.'
    });
  };

  const handleMoveUp = (index) => {
    if (index <= 0) return;
    setFaqs(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setStatusMsg(null);
  };

  const handleMoveDown = (index) => {
    if (index >= faqs.length - 1) return;
    setFaqs(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setStatusMsg(null);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMsg(null);

    try {
      // 1. Delete removed FAQs from cloud if any
      if (deletedIds.length > 0) {
        for (const id of deletedIds) {
          await deleteTokenFaqFromCloud(id);
        }
        setDeletedIds([]);
      }

      // 2. Persist full list with updated order & active status
      const res = await saveTokenFaqOrderToCloud(faqs);
      if (!res.success) {
        throw new Error(res.message || 'Failed to save FAQs to cloud.');
      }

      // 3. Update structured data JSON-LD immediately
      updateTokenFaqStructuredData(faqs);

      // 4. Dispatch event to update /tokens immediately in any open views
      window.dispatchEvent(new CustomEvent('token-faqs-updated', { detail: faqs }));

      if (onFaqsUpdated) {
        onFaqsUpdated(faqs);
      }

      setStatusMsg({
        type: 'success',
        text: lang === 'te' ? '✅ టోకెన్ ప్రశ్నలు క్లౌడ్‌లో విజయవంతంగా భద్రపరచబడ్డాయి!' : '✅ Token FAQs successfully saved to Supabase cloud and live site!'
      });
    } catch (err) {
      console.error('Error saving FAQs:', err);
      setStatusMsg({
        type: 'error',
        text: err.message || 'Cloud save failed. Please ensure you are logged in as admin.'
      });
    } finally {
      setSaving(false);
    }
  };

  const cardBg = isLight ? 'bg-white border-slate-200' : 'bg-[#111722] border-[#D4AF37]/30';
  const textHeading = isLight ? 'text-slate-900' : 'text-white';
  const textMuted = isLight ? 'text-slate-600' : 'text-slate-300';
  const inputBg = isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0B0E14] border-white/20 text-white';

  return (
    <div className="space-y-6">
      {/* Top Header & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D4AF37]/20">
        <div>
          <h3 className={`font-serif text-lg font-bold flex items-center gap-2 ${textHeading}`}>
            <HelpCircle className="w-5 h-5 text-[#FFD700]" />
            <span>{lang === 'te' ? 'SSD & DD టోకెన్ ప్రశ్నల నిర్వహణ' : 'SSD & DD Token FAQs Management'}</span>
          </h3>
          <p className={`text-xs ${textMuted} mt-0.5`}>
            {lang === 'te'
              ? 'దర్శన టోకెన్ల తరచుగా అడిగే ప్రశ్నలను (ఇంగ్లీష్ & తెలుగు) సవరించండి, క్రమాన్ని మార్చండి లేదా కొత్తవి జోడించండి.'
              : 'Manage pilgrim token FAQs in English and Telugu. Reorder, edit, toggle visibility, and persist to cloud.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isAdding && !editingId && (
            <button
              type="button"
              onClick={handleStartAdd}
              className="px-3 py-1.5 rounded-lg bg-[#141923] border border-[#D4AF37]/50 text-[#FFD700] hover:bg-[#D4AF37]/20 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'కొత్త ప్రశ్న' : 'Add FAQ'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FFD700] text-black text-xs font-extrabold flex items-center gap-1.5 shadow-md hover:brightness-110 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? (lang === 'te' ? 'భద్రపరుస్తోంది...' : 'Saving...') : (lang === 'te' ? 'మార్పులను భద్రపరచు' : 'Save Changes to Cloud')}</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {statusMsg && (
        <div
          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400'
              : 'bg-red-950/40 border-red-500 text-red-400'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Add / Edit Form Modal/Panel */}
      {(isAdding || editingId) && (
        <form onSubmit={handleFormSubmit} className={`p-4 rounded-xl border space-y-4 shadow-lg ${cardBg}`}>
          <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
            <h4 className={`text-sm font-bold flex items-center gap-2 ${textHeading}`}>
              {isAdding ? <Plus className="w-4 h-4 text-[#FFD700]" /> : <Edit3 className="w-4 h-4 text-[#FFD700]" />}
              <span>
                {isAdding
                  ? (lang === 'te' ? 'కొత్త ప్రశ్న జోడించండి' : 'Add New FAQ')
                  : (lang === 'te' ? 'ప్రశ్నను సవరించండి' : 'Edit FAQ')}
              </span>
            </h4>
            <button
              type="button"
              onClick={handleCancelForm}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#FFD700] block mb-1">
                English Question *
              </label>
              <input
                type="text"
                value={faqForm.question}
                onChange={e => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                placeholder="e.g. What documents are required to obtain a token?"
                className={`w-full px-3 py-2 rounded-lg border text-xs ${inputBg}`}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#FFD700] block mb-1">
                Telugu Question (తెలుగు ప్రశ్న)
              </label>
              <input
                type="text"
                value={faqForm.questionTe}
                onChange={e => setFaqForm(prev => ({ ...prev, questionTe: e.target.value }))}
                placeholder="ఉదా: టోకెన్ పొందడానికి ఏ పత్రాలు అవసరం?"
                className={`w-full px-3 py-2 rounded-lg border text-xs ${inputBg}`}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#FFD700] block mb-1">
                English Answer *
              </label>
              <textarea
                rows={4}
                value={faqForm.answer}
                onChange={e => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Provide accurate, grounded answer in English..."
                className={`w-full px-3 py-2 rounded-lg border text-xs leading-relaxed ${inputBg}`}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#FFD700] block mb-1">
                Telugu Answer (తెలుగు సమాధానం)
              </label>
              <textarea
                rows={4}
                value={faqForm.answerTe}
                onChange={e => setFaqForm(prev => ({ ...prev, answerTe: e.target.value }))}
                placeholder="తెలుగులో స్పష్టమైన వివరణ ఇవ్వండి..."
                className={`w-full px-3 py-2 rounded-lg border text-xs leading-relaxed ${inputBg}`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D4AF37]/15">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-300">
              <input
                type="checkbox"
                checked={faqForm.isActive}
                onChange={e => setFaqForm(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 rounded text-[#FFD700] focus:ring-[#FFD700]"
              />
              <span>{lang === 'te' ? 'ప్రజలకు చూపించు (Active)' : 'Active (Visible on public token page)'}</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-3 py-1.5 rounded-lg border border-white/20 text-slate-300 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FFD700] text-black text-xs font-extrabold shadow hover:brightness-110 cursor-pointer"
              >
                {isAdding ? 'Add to List' : 'Update in List'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* List of FAQs */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-xs text-[#FFD700] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading FAQs...</span>
          </div>
        ) : faqs.length === 0 ? (
          <div className={`p-6 rounded-xl border text-center text-xs ${textMuted} ${cardBg}`}>
            No FAQs currently configured. Click "Add FAQ" to create one.
          </div>
        ) : (
          faqs.map((faq, index) => {
            const isActive = faq.isActive !== false && faq.is_active !== false;

            return (
              <div
                key={faq.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${cardBg} ${
                  editingId === faq.id ? 'ring-2 ring-[#FFD700]' : ''
                } ${!isActive ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFD700] text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs sm:text-sm font-extrabold ${textHeading}`}>
                        {faq.question}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isActive
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-600'
                        }`}
                      >
                        {isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>

                    {(faq.questionTe || faq.question_te) && (
                      <div className="text-[11px] text-[#D4AF37] font-serif">
                        {faq.questionTe || faq.question_te}
                      </div>
                    )}

                    <p className={`text-[11px] sm:text-xs leading-relaxed line-clamp-2 ${textMuted}`}>
                      {faq.answer}
                    </p>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {/* Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(faq.id)}
                    title={isActive ? 'Deactivate (Hide from public)' : 'Activate (Show to public)'}
                    className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                      isActive
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50'
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Reorder Up */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move Up"
                    className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-slate-300 hover:text-[#FFD700] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Reorder Down */}
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === faqs.length - 1}
                    title="Move Down"
                    className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-slate-300 hover:text-[#FFD700] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(faq)}
                    title="Edit FAQ"
                    className="p-1.5 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(faq.id)}
                    title="Delete FAQ"
                    className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
