"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import { Plus, Trash2, Search, Edit, X, Save, Loader2, Sparkles, Zap, Brain } from "lucide-react";
import { toast } from "@/store/toastStore";
import { confirm } from "@/components/ConfirmDialog";

interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface Test {
  _id: string;
  title: string;
  type: string;
  exam: string;
  subject: string;
  difficulty: string;
  generatedBy: string;
  durationMinutes: number;
  questions: Question[];
}

const ALLOWED_EXAMS = ['JKBOSE', 'NEET UG', 'NEET PG', 'JEE Mains', 'JEE Advanced', 'JKBOPEE', 'CUET', 'SKAUST-K UET'];

export default function ManageTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Test, "_id" | "generatedBy">>({
    title: "", type: "Full-Length", exam: "", subject: "", difficulty: "Medium", durationMinutes: 60, questions: []
  });

  // AI Generation State
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    exam: "NEET UG",
    subject: "",
    topic: "",
    count: 10,
    difficulty: "Medium"
  });

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tests");
      setTests(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.questions.length === 0) return toast.warning("Please add at least one question.");
    
    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (!q.questionText || q.options.some(opt => !opt) || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
         return toast.warning(`Question ${i + 1} is incomplete. Ensure all 4 options and correct answer are set.`);
      }
    }

    setSaving(true);
    try {
      const payload = { ...form, generatedBy: form.questions.length > 0 ? 'ai' : 'manual' };
      if (editingId) {
        await api.put(`/tests/${editingId}`, payload);
      } else {
        await api.post("/tests", payload);
      }
      setShowModal(false);
      setEditingId(null);
      resetForm();
      fetchTests();
      toast.success(editingId ? "Test updated successfully" : "Test created successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", type: "Full-Length", exam: "", subject: "", difficulty: "Medium", durationMinutes: 60, questions: [] });
    setShowAiPanel(false);
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await api.get(`/tests/${id}`);
      const t = res.data.data;
      setEditingId(t._id);
      setForm({
        title: t.title, type: t.type, exam: t.exam || "", subject: t.subject || "",
        difficulty: t.difficulty || "Medium", durationMinutes: t.durationMinutes, questions: t.questions || []
      });
      setShowModal(true);
    } catch (err) {
      toast.error("Failed to fetch test details");
    }
  };

  const handleDelete = async (id: string) => {
    confirm("Are you sure you want to delete this test?", async () => {
      try {
        await api.delete(`/tests/${id}`);
        fetchTests();
        toast.success("Test deleted successfully");
      } catch (err) {
        toast.error("Failed to delete");
      }
    }, "Delete Test");
  };

  const addQuestion = () => {
    setForm(p => ({
      ...p,
      questions: [...p.questions, { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0, explanation: "" }]
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const qs = [...form.questions];
    (qs[index] as any)[field] = value;
    setForm({ ...form, questions: qs });
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const qs = [...form.questions];
    qs[qIndex].options[optIndex] = value;
    setForm({ ...form, questions: qs });
  };

  const removeQuestion = (index: number) => {
    const qs = form.questions.filter((_, i) => i !== index);
    setForm({ ...form, questions: qs });
  };

  // ===== AI GENERATION =====
  const handleAiGenerate = async () => {
    if (!aiConfig.subject.trim()) {
      return toast.warning("Please enter a subject for AI generation.");
    }

    setAiGenerating(true);
    try {
      const res = await api.post("/ai/generate-questions", {
        exam: aiConfig.exam,
        subject: aiConfig.subject.trim(),
        topic: aiConfig.topic.trim() || undefined,
        count: aiConfig.count,
        difficulty: aiConfig.difficulty
      });

      const generated = res.data.data || [];
      if (generated.length === 0) {
        toast.warning("AI returned no questions. Try adjusting your parameters.");
        return;
      }

      setForm(p => ({
        ...p,
        questions: [...p.questions, ...generated],
        ...(p.exam ? {} : { exam: aiConfig.exam }),
        ...(p.subject ? {} : { subject: aiConfig.subject }),
        ...(p.title ? {} : { title: `${aiConfig.exam} — ${aiConfig.subject} Mock Test` }),
        ...(p.difficulty === 'Medium' ? { difficulty: aiConfig.difficulty } : {})
      }));

      toast.success(`Generated ${generated.length} questions with AI`);
      setShowAiPanel(false);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || "AI generation failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setAiGenerating(false);
    }
  };

  const filteredTests = useMemo(() => {
    return tests.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [tests, search]);

  return (
    <div>
      <Topbar title="Manage Mock Tests" />
      <div className="px-4 md:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search tests..."
              className="input pl-11 w-full md:w-72" 
            />
          </div>
          <button onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create New Test
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Title</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Type / Exam</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Questions</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Source</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>Loading tests...</td></tr>
                ) : filteredTests.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>No tests found.</td></tr>
                ) : filteredTests.map((test) => (
                  <tr key={test._id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-200">{test.title}</p>
                      <p className="text-xs text-slate-500">{test.subject || "No subject"} {test.difficulty ? `• ${test.difficulty}` : ""}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="badge badge-indigo">{test.type}</span>
                      <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{test.exam}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-300">{test.questions.length} Qs</td>
                    <td className="px-5 py-4">
                      {test.generatedBy === 'ai' ? (
                        <span className="badge" style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>
                          <Sparkles className="w-3 h-3" /> AI
                        </span>
                      ) : (
                        <span className="badge badge-gray">Manual</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(test._id)} className="p-2 rounded-lg transition-all hover:text-indigo-400" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
                          <Edit className="w-4 h-4"/>
                        </button>
                        <button onClick={() => handleDelete(test._id)} className="btn-danger !py-2 !px-2">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Builder */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-10 sm:p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-4xl animate-fadeUp flex flex-col h-[90vh] overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1.75rem" }}>
            
            <div className="flex items-center justify-between px-6 py-5 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
              <h2 className="text-xl font-black text-white">{editingId ? "Edit Mock Test" : "Create New Mock Test"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-white/5" style={{ color: "#475569" }}><X className="w-5 h-5"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="test-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Test Title</label>
                    <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Full Mock Test - JKBOSE" className="input" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Duration (Mins)</label>
                    <input type="number" required value={form.durationMinutes} onChange={e => setForm({...form, durationMinutes: parseInt(e.target.value)})} className="input" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Target Exam</label>
                    <select value={form.exam} onChange={e => setForm({...form, exam: e.target.value})} className="input">
                      <option value="">Select Exam</option>
                      {ALLOWED_EXAMS.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Subject</label>
                    <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="e.g. Mathematics" className="input" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Test Category</label>
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input">
                      <option value="Full-Length">Full-Length Mock</option>
                      <option value="Chapter-wise">Chapter-wise Test</option>
                      <option value="Subjective">Subjective Quiz</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Difficulty</label>
                    <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="input">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                {/* Questions Builder */}
                <div>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h3 className="text-lg font-black text-white">Questions ({form.questions.length})</h3>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setShowAiPanel(!showAiPanel)} 
                        className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
                        style={{ background: "linear-gradient(135deg, #8b5cf6, #d946ef)", color: "white" }}>
                        <Zap className="w-4 h-4" /> AI Generate
                      </button>
                      <button type="button" onClick={addQuestion} className="btn-primary !px-4 !py-2 !text-xs !bg-none" style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", boxShadow: "none" }}>
                        <Plus className="w-4 h-4"/> Add Question
                      </button>
                    </div>
                  </div>

                  {/* AI Generation Panel */}
                  {showAiPanel && (
                    <div className="mb-6 p-6 rounded-2xl space-y-4 relative overflow-hidden" style={{ background: "var(--surface2)", border: "1px solid rgba(139,92,246,0.3)" }}>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <Brain className="w-5 h-5" style={{ color: "#a78bfa" }} />
                          <h4 className="font-black" style={{ color: "#e9d5ff" }}>AI Question Generator</h4>
                          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd" }}>Powered by Gemini</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#a78bfa" }}>Target Exam</label>
                            <select value={aiConfig.exam} onChange={e => setAiConfig({...aiConfig, exam: e.target.value})} className="input" style={{ borderColor: "rgba(139,92,246,0.2)" }}>
                              {ALLOWED_EXAMS.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#a78bfa" }}>Subject</label>
                            <input value={aiConfig.subject} onChange={e => setAiConfig({...aiConfig, subject: e.target.value})} placeholder="e.g. Physics, Chemistry" className="input" style={{ borderColor: "rgba(139,92,246,0.2)" }} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#a78bfa" }}>Topic / Chapter <span className="opacity-50">(optional)</span></label>
                            <input value={aiConfig.topic} onChange={e => setAiConfig({...aiConfig, topic: e.target.value})} placeholder="e.g. Thermodynamics" className="input" style={{ borderColor: "rgba(139,92,246,0.2)" }} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#a78bfa" }}>Count</label>
                              <input type="number" min={5} max={50} value={aiConfig.count} onChange={e => setAiConfig({...aiConfig, count: Math.min(50, Math.max(5, parseInt(e.target.value) || 5))})} className="input" style={{ borderColor: "rgba(139,92,246,0.2)" }} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#a78bfa" }}>Difficulty</label>
                              <select value={aiConfig.difficulty} onChange={e => setAiConfig({...aiConfig, difficulty: e.target.value})} className="input" style={{ borderColor: "rgba(139,92,246,0.2)" }}>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-5">
                          <button
                            type="button"
                            onClick={handleAiGenerate}
                            disabled={aiGenerating}
                            className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-60 transition-all"
                            style={{ background: "linear-gradient(135deg, #8b5cf6, #d946ef)", color: "white" }}
                          >
                            {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            {aiGenerating ? "Generating..." : `Generate ${aiConfig.count} Qs`}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAiPanel(false)}
                            className="px-4 py-3 font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:bg-white/5"
                            style={{ color: "#c4b5fd" }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    {form.questions.map((q, qIndex) => (
                      <div key={qIndex} className="p-5 rounded-2xl relative" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                        <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                        <h4 className="font-bold text-white mb-4 text-sm">Question {qIndex + 1}</h4>
                        
                        <div className="space-y-4">
                          <textarea required value={q.questionText} onChange={e => updateQuestion(qIndex, 'questionText', e.target.value)} placeholder="Type question here..." className="input min-h-[80px]" />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map((optIndex) => (
                              <div key={optIndex} className="flex items-center gap-3 p-1.5 rounded-xl border transition-all" style={{ 
                                borderColor: q.correctAnswerIndex === optIndex ? "rgba(16,185,129,0.5)" : "var(--border)",
                                background: q.correctAnswerIndex === optIndex ? "rgba(16,185,129,0.05)" : "var(--surface)"
                              }}>
                                <div className="flex flex-col items-center justify-center pl-2" title="Mark as correct answer">
                                  <input type="radio" name={`correct-${qIndex}`} checked={q.correctAnswerIndex === optIndex} onChange={() => updateQuestion(qIndex, 'correctAnswerIndex', optIndex)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                                </div>
                                <input required value={q.options[optIndex]} onChange={e => updateOption(qIndex, optIndex, e.target.value)} placeholder={`Option ${optIndex + 1}`} className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-300 py-1" />
                                {q.correctAnswerIndex === optIndex && <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md" style={{ color: "#10b981", background: "rgba(16,185,129,0.15)" }}>Correct</span>}
                              </div>
                            ))}
                          </div>
                          
                          <textarea value={q.explanation} onChange={e => updateQuestion(qIndex, 'explanation', e.target.value)} placeholder="Explanation (optional)" className="input !py-2 !text-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 flex items-center justify-end gap-3 shrink-0" style={{ borderTop: "1px solid var(--border)", background: "var(--surface2)" }}>
              <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/5" style={{ color: "#94a3b8" }}>Cancel</button>
              <button type="submit" form="test-form" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                {saving ? "Saving..." : "Save Test"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
