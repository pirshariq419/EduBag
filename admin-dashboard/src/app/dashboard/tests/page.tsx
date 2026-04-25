"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import { Plus, Trash2, Search, Edit, X, Save, Loader2, CheckCircle } from "lucide-react";

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
  durationMinutes: number;
  questions: Question[];
}

export default function ManageTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Test, "_id">>({
    title: "", type: "Full-Length", exam: "", subject: "", durationMinutes: 60, questions: []
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
    if (form.questions.length === 0) return alert("Please add at least one question.");
    
    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (!q.questionText || q.options.some(opt => !opt) || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
         return alert(`Question ${i + 1} is incomplete. Ensure all 4 options and correct answer are set.`);
      }
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/tests/${editingId}`, form);
      } else {
        await api.post("/tests", form);
      }
      setShowModal(false);
      setEditingId(null);
      resetForm();
      fetchTests();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", type: "Full-Length", exam: "", subject: "", durationMinutes: 60, questions: [] });
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await api.get(`/tests/${id}`);
      const t = res.data.data;
      setEditingId(t._id);
      setForm({
        title: t.title, type: t.type, exam: t.exam || "", subject: t.subject || "", 
        durationMinutes: t.durationMinutes, questions: t.questions || []
      });
      setShowModal(true);
    } catch (err) {
      alert("Failed to fetch test details");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this test?")) return;
    try {
      await api.delete(`/tests/${id}`);
      fetchTests();
    } catch (err) {
      alert("Failed to delete");
    }
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

  const filteredTests = useMemo(() => {
    return tests.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [tests, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar title="Manage Mock Tests" />
      <div className="px-4 md:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search tests..." 
              className="pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-72" 
            />
          </div>
          <button 
            onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus className="w-4 h-4" /> Create New Test
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="text-slate-500 font-medium">Loading tests...</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-black text-slate-900 text-sm uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 font-black text-slate-900 text-sm uppercase tracking-wider">Type / Exam</th>
                    <th className="px-6 py-4 font-black text-slate-900 text-sm uppercase tracking-wider">Questions</th>
                    <th className="px-6 py-4 font-black text-slate-900 text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTests.map((test) => (
                    <tr key={test._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{test.title}</p>
                        <p className="text-xs text-slate-500">{test.subject || "No subject"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">{test.type}</span>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{test.exam}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-600">{test.questions.length} Qs</td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(test._id)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit className="w-4 h-4"/></button>
                          <button onClick={() => handleDelete(test._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">No tests found matching your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Builder */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-4xl h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">{editingId ? "Edit Mock Test" : "Create New Mock Test"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-6 h-6"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <form id="test-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Test Title</label>
                    <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Full Mock Test - JKBOSE 2026" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Duration (Minutes)</label>
                    <input type="number" required value={form.durationMinutes} onChange={e => setForm({...form, durationMinutes: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Target Exam</label>
                    <input required value={form.exam} onChange={e => setForm({...form, exam: e.target.value})} placeholder="e.g. JKBOSE" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                    <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="e.g. Mathematics" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Test Category</label>
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer">
                      <option value="Full-Length">Full-Length Mock</option>
                      <option value="Chapter-wise">Chapter-wise Test</option>
                      <option value="Subjective">Subjective Quiz</option>
                    </select>
                  </div>
                </div>

                {/* Questions Builder */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-900">Questions ({form.questions.length})</h3>
                    <button type="button" onClick={addQuestion} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 flex items-center gap-2">
                      <Plus className="w-4 h-4"/> Add Question
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {form.questions.map((q, qIndex) => (
                      <div key={qIndex} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative">
                        <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                        <h4 className="font-bold text-slate-900 mb-4">Question {qIndex + 1}</h4>
                        
                        <div className="space-y-4">
                          <textarea required value={q.questionText} onChange={e => updateQuestion(qIndex, 'questionText', e.target.value)} placeholder="Type question here..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]" />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[0, 1, 2, 3].map((optIndex) => (
                              <div key={optIndex} className={`flex items-center gap-3 p-2 rounded-xl border ${q.correctAnswerIndex === optIndex ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                                <input type="radio" name={`correct-${qIndex}`} checked={q.correctAnswerIndex === optIndex} onChange={() => updateQuestion(qIndex, 'correctAnswerIndex', optIndex)} className="w-4 h-4 accent-emerald-500 ml-2" />
                                <input required value={q.options[optIndex]} onChange={e => updateOption(qIndex, optIndex, e.target.value)} placeholder={`Option ${optIndex + 1}`} className="flex-1 bg-transparent outline-none text-sm font-medium" />
                              </div>
                            ))}
                          </div>
                          
                          <textarea value={q.explanation} onChange={e => updateQuestion(qIndex, 'explanation', e.target.value)} placeholder="Explanation (optional, shown after test)" className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
              <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button type="submit" form="test-form" disabled={saving} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200">
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
