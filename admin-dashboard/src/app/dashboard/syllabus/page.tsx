"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import { Plus, Trash2, Search, BookOpen, X, Save, Loader2, FileText, Pencil } from "lucide-react";
import { toast } from "@/store/toastStore";
import { confirm } from "@/components/ConfirmDialog";

interface Resource {
  _id: string;
  title: string;
  exam: string;
  class?: string;
  fileUrl: string;
  createdAt: string;
}

interface CategoryItem {
  _id: string;
  id: string;
  name: string;
}

const CLASSES = ["Class 10th", "Class 11th", "Class 12th", "Undergraduate", "Postgraduate", "General"];

const defaultForm = { title: "", exam: "", class: "Class 10th", fileUrl: "" };

export default function SyllabusPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      const cats = (res.data.data || []).filter((c: any) => c.type !== "pyq");
      setCategories(cats);
      if (cats.length > 0 && !form.exam) {
        setForm(p => ({ ...p, exam: cats[0].id }));
      }
    } catch { }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/resources?type=syllabus");
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
    formData.append("type", "syllabus");

    try {
      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm(p => ({ ...p, fileUrl: res.data.data }));
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/resources/${editingId}`, { ...form, type: "syllabus" });
      } else {
        await api.post("/resources", { ...form, type: "syllabus" });
      }
      closeModal();
      fetchItems();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save");
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
      class: item.class || "Class 10th",
      fileUrl: item.fileUrl,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    confirm("Are you sure you want to delete this syllabus entry?", async () => {
      try {
        await api.delete(`/resources/${id}`);
        setItems((p) => p.filter((i) => i._id !== id));
        toast.success("Syllabus entry deleted");
      } catch { toast.error("Failed to delete"); }
    }, "Delete Syllabus");
    return;
  };

  const getCatName = (slug: string) => {
    const cat = categories.find(c => c.id === slug);
    return cat ? cat.name : slug;
  };

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.exam.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Topbar title="Syllabus" />
      <div className="px-4 md:px-8 py-8 space-y-6">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search syllabi..." className="input pl-11 w-full md:w-72" />
          </div>
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Syllabus
          </button>
        </div>

        {/* Card Grid view */}
        {loading ? (
          <div className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.length === 0 ? (
              <div className="col-span-3 py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>
                No syllabi yet. Add your first one!
              </div>
            ) : filtered.map((item) => (
              <div key={item._id} className="card card-hover p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(139,92,246,0.15)" }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: "#8b5cf6" }} />
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-white text-sm leading-tight">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="badge badge-indigo">{getCatName(item.exam)}</span>
                    {item.class && <span className="badge badge-gray">{item.class}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <a href={item.fileUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 flex-1 text-xs font-bold py-2.5 rounded-xl justify-center transition-all"
                    style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}>
                    <FileText className="w-3.5 h-3.5" /> Preview
                  </a>
                  <button onClick={() => openEditModal(item)}
                    className="flex items-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
                    style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-10 sm:p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md animate-fadeUp flex flex-col max-h-[85vh]" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1.75rem" }}>
            <div className="flex items-center justify-between px-4 md:px-7 py-5 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <h2 className="text-lg font-black text-white">{editingId ? "Edit Syllabus" : "Add Syllabus"}</h2>
                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{editingId ? "Update official syllabus PDF link" : "Link an official syllabus PDF"}</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-white/5" style={{ color: "#475569" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-4 md:px-7 py-6 space-y-5 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Syllabus Title</label>
                <input required value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. JKBOSE Class 12 Official Syllabus 2026" className="input" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Exam / Board</label>
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

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Upload Syllabus PDF</label>
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
                {saving ? "Saving..." : (editingId ? "Save Changes" : "Publish Syllabus")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
