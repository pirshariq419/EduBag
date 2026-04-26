"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import { Plus, Trash2, Search, X, Save, Loader2, Image as ImageIcon, Pencil } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  id: string;
  logo: string;
  type: "pyq" | "syllabus" | "all";
  order: number;
}

const defaultForm: { name: string; id: string; logo: string; type: "pyq" | "syllabus" | "all"; order: number } = { name: "", id: "", logo: "/images/logo.png", type: "all", order: 0 };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...defaultForm });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "others");
    try {
      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm(p => ({ ...p, logo: res.data.data }));
    } catch (err: any) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...defaultForm });
    setShowModal(true);
  };

  const openEditModal = (item: Category) => {
    setEditingId(item._id);
    setForm({ name: item.name, id: item.id, logo: item.logo, type: item.type, order: item.order });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
      } else {
        await api.post("/categories", form);
      }
      closeModal();
      setForm({ ...defaultForm });
      fetchItems();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure? This will not delete resources under this category, but the category won't show on frontend.")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchItems();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const typeLabel: Record<string, string> = { all: "PYQ & Syllabus", pyq: "PYQ Only", syllabus: "Syllabus Only" };
  const typeColor: Record<string, string> = { all: "#8b5cf6", pyq: "#06b6d4", syllabus: "#f59e0b" };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <Topbar title="Manage Categories (Exams)" />

      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exams/categories..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all" />
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
            <Plus className="w-4 h-4" /> Add New Category
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-[2rem]">
            <ImageIcon className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-300 mb-1">No categories found</h3>
            <p className="text-sm text-slate-500 mb-6">Add exam categories like JKBOSE, NEET, JEE, etc.</p>
            <button onClick={openAddModal} className="px-6 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add First Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item._id} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-indigo-500/50 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 p-2 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='%236366f1' viewBox='0 0 24 24'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E"; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest" style={{ background: `${typeColor[item.type]}20`, color: typeColor[item.type] }}>
                        {typeLabel[item.type]}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">Order: {item.order}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 px-1">
                  <span>ID: <code className="text-slate-400 font-mono">{item.id}</code></span>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  <button onClick={() => openEditModal(item)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => deleteItem(item._id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-10 sm:p-4">
          <div onClick={closeModal} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-[#1c1d1f] border border-white/10 rounded-[2.5rem] w-full max-w-xl p-6 md:p-10 flex flex-col max-h-[85vh] shadow-2xl">
            <div className="flex items-center justify-between mb-8 shrink-0">
              <h2 className="text-2xl font-black">{editingId ? "Edit Category" : "New Category"}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category Name</label>
                  <input required value={form.name} onChange={(e) => {
                    const name = e.target.value;
                    setForm(p => ({
                      ...p,
                      name,
                      ...(!editingId ? { id: name.toLowerCase().replace(/\s+/g, '-') } : {})
                    }));
                  }} placeholder="e.g. JKBOSE" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500 text-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">System ID</label>
                  <input required value={form.id} onChange={(e) => setForm(p => ({ ...p, id: e.target.value.toLowerCase() }))} placeholder="jkbose" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500 font-mono text-white" />
                  <p className="text-[10px] text-slate-500">Auto-generated from name. Used internally.</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/10 p-2 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={form.logo}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='%236366f1' viewBox='0 0 24 24'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E"; }}
                    />
                  </div>
                  <label className="flex-1 flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-white/10 cursor-pointer hover:bg-white/5 transition-all">
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {uploading ? "Uploading..." : "Click to upload logo"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Display Type</label>
                  <select value={form.type} onChange={(e) => setForm(p => ({ ...p, type: e.target.value as any }))} className="w-full bg-[#2a2a2e] border border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500 text-white appearance-none cursor-pointer">
                    <option value="all">Both (PYQ &amp; Syllabus)</option>
                    <option value="pyq">PYQ Only</option>
                    <option value="syllabus">Syllabus Only</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Display Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500 text-white" />
                  <p className="text-[10px] text-slate-500">Lower numbers appear first.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <button type="button" onClick={closeModal} className="flex-1 py-4 rounded-2xl bg-white/5 font-bold hover:bg-white/10 transition-all">Cancel</button>
                <button type="submit" disabled={saving || uploading} className="flex-1 py-4 rounded-2xl bg-indigo-600 font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
