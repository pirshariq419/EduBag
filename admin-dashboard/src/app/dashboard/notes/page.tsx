"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import { Plus, Trash2, Search, Crown, BookOpen, X, Save, Loader2, Edit, FileText } from "lucide-react";
import { toast } from "@/store/toastStore";
import { confirm } from "@/components/ConfirmDialog";

interface Note {
  _id: string;
  title: string;
  subject: string;
  chapter?: string;
  exam: string;
  fileUrl: string;
  description?: string;
  createdAt: string;
}

const EXAMS    = ["JKBOSE", "JEE", "NEET", "BOARDS", "General"];
const SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Urdu", "History", "Political Science", "Economics", "General"];

export default function NotesPage() {
  const [items, setItems] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", subject: "Physics", chapter: "", exam: "JEE",
    description: "", fileUrl: ""
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notes");
      setItems(res.data.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/notes", form);
      setForm({ title: "", subject: "Physics", chapter: "", exam: "JEE", description: "", fileUrl: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save note");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    confirm("Are you sure you want to delete this note?", async () => {
      try {
        await api.delete(`/notes/${id}`);
        setItems((p) => p.filter((i) => i._id !== id));
        toast.success("Note deleted");
      } catch { toast.error("Failed to delete"); }
    }, "Delete Note");
  };

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.subject.toLowerCase().includes(search.toLowerCase()) ||
    i.exam.toLowerCase().includes(search.toLowerCase())
  );

  const f = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <Topbar title="Notes & Study Material" />
      <div className="px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..." className="input pl-11 w-full md:w-72" />
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Note
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                  {["Title", "Subject", "Chapter", "Exam", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>No notes yet. Add your first one!</td></tr>
                ) : filtered.map((item) => (
                  <tr key={item._id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-200">{item.title}</td>
                    <td className="px-5 py-4"><span className="badge badge-indigo">{item.subject}</span></td>
                    <td className="px-5 py-4 text-slate-400">{item.chapter || "—"}</td>
                    <td className="px-5 py-4"><span className="badge badge-gray">{item.exam}</span></td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <a href={item.fileUrl} target="_blank" rel="noreferrer"
                          className="p-2 rounded-lg" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}>
                          <FileText className="w-4 h-4" />
                        </a>
                        <button onClick={() => handleDelete(item._id)} className="btn-danger !py-2 !px-2">
                          <Trash2 className="w-4 h-4" />
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-10 sm:p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-lg animate-fadeUp flex flex-col max-h-[85vh]" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1.75rem" }}>
            <div className="flex items-center justify-between px-4 md:px-7 py-5 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <h2 className="text-lg font-black text-white">Add Study Note</h2>
                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Publish a new note or study material</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-white/5" style={{ color: "#475569" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-4 md:px-7 py-6 space-y-5 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Note Title</label>
                <input required value={form.title} onChange={(e) => f("title", e.target.value)}
                  placeholder="e.g. Mechanics Complete Notes — JEE Advanced" className="input" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Subject</label>
                  <select value={form.subject} onChange={(e) => f("subject", e.target.value)} className="input">
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Exam</label>
                  <select value={form.exam} onChange={(e) => f("exam", e.target.value)} className="input">
                    {EXAMS.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Chapter (optional)</label>
                <input value={form.chapter} onChange={(e) => f("chapter", e.target.value)}
                  placeholder="e.g. Electrostatics" className="input" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Description (optional)</label>
                <textarea value={form.description} onChange={(e) => f("description", e.target.value)}
                  placeholder="Short description of the note content..." className="input resize-none" rows={2} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>File URL / Path</label>
                <input required value={form.fileUrl} onChange={(e) => f("fileUrl", e.target.value)}
                  placeholder="/assets/notes/jee/physics-mechanics.pdf" className="input" />
              </div>



              <button type="submit" disabled={saving} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Publishing..." : "Publish Note"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
