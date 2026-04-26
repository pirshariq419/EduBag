"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import { Plus, Trash2, Search, FileText, X, Save, Loader2, Pencil } from "lucide-react";

interface Resource {
  _id: string;
  title: string;
  type: string;
  exam: string;
  class?: string;
  year?: number;
  subject?: string;
  fileUrl: string;
  createdAt: string;
}

interface CategoryItem {
  _id: string;
  id: string;   // slug like "jkbose", "neet-ug"
  name: string;  // display like "JKBOSE", "NEET UG"
}

const CLASSES = ["Class 10th", "Class 11th", "Class 12th", "N/A"];
const YEARS = Array.from({ length: 14 }, (_, i) => 2026 - i);

const defaultForm = {
  title: "", exam: "", class: "N/A",
  year: 2025, subject: "", fileUrl: ""
};

export default function PYQPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });

  // Fetch categories (exams) for the dropdown
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      const cats = (res.data.data || []).filter((c: any) => c.type !== "syllabus");
      setCategories(cats);
      // Set default exam to first category if available
      if (cats.length > 0 && !form.exam) {
        setForm(p => ({ ...p, exam: cats[0].id }));
      }
    } catch { }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/resources?type=pyq");
      setItems(res.data.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "pyq");

    try {
      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm(p => ({ ...p, fileUrl: res.data.data }));
    } catch (err: any) {
      alert(err?.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Build the payload — send class as null if N/A
    const payload = {
      ...form,
      type: "pyq",
      class: form.class === "N/A" ? undefined : form.class,
    };

    try {
      if (editingId) {
        await api.put(`/resources/${editingId}`, payload);
      } else {
        await api.post("/resources", payload);
      }
      closeModal();
      fetchItems();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to save");
    } finally { setSaving(false); }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...defaultForm,
      exam: categories.length > 0 ? categories[0].id : "",
    });
    setShowModal(true);
  };

  const openEditModal = (item: Resource) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      exam: item.exam,
      class: item.class || "N/A",
      year: item.year || 2025,
      subject: item.subject || "",
      fileUrl: item.fileUrl,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this PYQ entry?")) return;
    try {
      await api.delete(`/resources/${id}`);
      setItems((p) => p.filter((i) => i._id !== id));
    } catch { alert("Failed to delete"); }
  };

  // Helper: get category display name from slug
  const getCatName = (slug: string) => {
    const cat = categories.find(c => c.id === slug);
    return cat ? cat.name : slug;
  };

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.exam.toLowerCase().includes(search.toLowerCase())
  );

  // Auto-generate title from selections
  const autoTitle = () => {
    const examName = getCatName(form.exam);
    const cls = form.class !== "N/A" ? ` ${form.class}` : "";
    const subj = form.subject ? ` ${form.subject}` : "";
    return `${examName}${cls}${subj} ${form.year}`.trim();
  };

  return (
    <div>
      <Topbar title="PYQ Papers" />
      <div className="px-4 md:px-8 py-8 space-y-6">

        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PYQs..."
              className="input pl-11 w-full md:w-72"
            />
          </div>
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add PYQ Paper
          </button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                  {["Title", "Exam", "Class", "Year", "Subject", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>No PYQs found. Add your first one!</td></tr>
                ) : filtered.map((item) => (
                  <tr key={item._id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-200">{item.title}</td>
                    <td className="px-5 py-4"><span className="badge badge-indigo">{getCatName(item.exam)}</span></td>
                    <td className="px-5 py-4 text-slate-400">{item.class || "—"}</td>
                    <td className="px-5 py-4 font-bold text-white">{item.year || "—"}</td>
                    <td className="px-5 py-4 text-slate-400">{item.subject || "—"}</td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <a href={item.fileUrl} target="_blank" rel="noreferrer"
                          className="p-2 rounded-lg transition-all hover:text-cyan-400"
                          style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}>
                          <FileText className="w-4 h-4" />
                        </a>
                        <button onClick={() => openEditModal(item)} className="p-2 rounded-lg transition-all hover:text-indigo-400" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
                          <Pencil className="w-4 h-4" />
                        </button>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-10 sm:p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-lg animate-fadeUp flex flex-col max-h-[85vh]" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1.75rem" }}>
            <div className="flex items-center justify-between px-4 md:px-7 py-5 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <h2 className="text-lg font-black text-white">{editingId ? "Edit PYQ Paper" : "Add PYQ Paper"}</h2>
                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{editingId ? "Update paper details" : "Fill in the details to publish this paper"}</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-white/5" style={{ color: "#475569" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-4 md:px-7 py-6 space-y-5 overflow-y-auto">
              {/* Exam + Class */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Exam Board</label>
                  <select required value={form.exam} onChange={(e) => setForm(p => ({ ...p, exam: e.target.value }))} className="input">
                    <option value="">Select Exam...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500">Linked to your Categories/Exams</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Class / Level</label>
                  <select value={form.class} onChange={(e) => setForm(p => ({ ...p, class: e.target.value }))} className="input">
                    {CLASSES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Year + Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Year</label>
                  <select value={form.year} onChange={(e) => setForm(p => ({ ...p, year: Number(e.target.value) }))} className="input">
                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Subject</label>
                  <input value={form.subject} onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
                    placeholder="e.g. Physics" className="input" />
                </div>
              </div>

              {/* Title — auto-generated with option to override */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Paper Title</label>
                  <button type="button" onClick={() => setForm(p => ({ ...p, title: autoTitle() }))} className="text-[10px] font-bold text-indigo-400 hover:underline">
                    Auto-generate
                  </button>
                </div>
                <input required value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. JKBOSE Class 12th Physics 2024" className="input" />
              </div>

              {/* File Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Upload PDF Document</label>
                <label className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:bg-white/5"
                  style={{ borderColor: form.fileUrl ? "rgba(16,185,129,0.4)" : "var(--border)", background: form.fileUrl ? "rgba(16,185,129,0.05)" : "transparent" }}>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  {uploading ? (
                    <><Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Uploading...</span></>
                  ) : form.fileUrl ? (
                    <><FileText className="w-5 h-5" style={{ color: "#10b981" }} />
                    <span className="text-xs font-bold text-emerald-400">✓ File uploaded — Click to replace</span></>
                  ) : (
                    <><FileText className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Click to upload PDF</span></>
                  )}
                </label>
                {form.fileUrl && (
                  <p className="text-[10px] font-mono px-1 truncate" style={{ color: "#10b981" }}>{form.fileUrl}</p>
                )}
              </div>

              <button type="submit" disabled={saving || uploading} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : (editingId ? "Save Changes" : "Publish PYQ Paper")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
