"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import { Plus, Trash2, Search, Building2, X, Save, Loader2, Globe, MapPin, Pencil, Image as ImageIcon } from "lucide-react";

interface College {
  _id: string;
  name: string;
  location: string;
  image?: string;
  websiteUrl?: string;
  description?: string;
  createdAt: string;
}

export default function CollegesPage() {
  const [items, setItems] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", location: "J&K, India", image: "", websiteUrl: "", description: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "colleges");

    try {
      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm(p => ({ ...p, image: res.data.data }));
    } catch (err: any) {
      alert(err?.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/colleges");
      setItems(res.data.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/colleges/${editingId}`, form);
      } else {
        await api.post("/colleges", form);
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ name: "", location: "J&K, India", image: "", websiteUrl: "", description: "" });
      fetchItems();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleEdit = (item: College) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      location: item.location,
      image: item.image || "",
      websiteUrl: item.websiteUrl || "",
      description: item.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this college entry?")) return;
    try {
      await api.delete(`/colleges/${id}`);
      setItems((p) => p.filter((i) => i._id !== id));
    } catch { alert("Failed to delete"); }
  };

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.location.toLowerCase().includes(search.toLowerCase())
  );

  const f = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <Topbar title="College Explorer" />
      <div className="px-4 md:px-8 py-8 space-y-6">

        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges..."
              className="input pl-11 w-72"
            />
          </div>
          <button onClick={() => { setEditingId(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add College
          </button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                  {["College Name", "Location", "Website", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>No colleges found. Add your first one!</td></tr>
                ) : filtered.map((item) => (
                  <tr key={item._id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/5">
                          {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500"><Building2 className="w-5 h-5" /></div>}
                        </div>
                        <span className="font-semibold text-slate-200">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {item.websiteUrl ? (
                        <a href={item.websiteUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1.5 font-bold">
                          <Globe className="w-3.5 h-3.5" /> Visit
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 rounded-lg transition-all hover:text-indigo-400" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-lg animate-fadeUp" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1.75rem" }}>
            <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <h2 className="text-lg font-black text-white">{editingId ? "Edit College" : "Add New College"}</h2>
                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Manage institution details and links</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-white/5" style={{ color: "#475569" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>College Name</label>
                <input required value={form.name} onChange={(e) => f("name", e.target.value)}
                  placeholder="e.g. GMC Srinagar" className="input" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Location</label>
                  <input required value={form.location} onChange={(e) => f("location", e.target.value)}
                    placeholder="e.g. Srinagar, J&K" className="input" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Website URL</label>
                  <input value={form.websiteUrl} onChange={(e) => f("websiteUrl", e.target.value)}
                    placeholder="https://..." className="input" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>College Image</label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-white/5 overflow-hidden shrink-0">
                    {form.image ? (
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <label className="flex-1 flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:bg-white/5" 
                    style={{ borderColor: "var(--border)" }}>
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} accept="image/*" />
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
                      {uploading ? "Uploading Image..." : "Click to upload campus photo"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Image URL (Optional)</label>
                <input value={form.image} onChange={(e) => f("image", e.target.value)}
                  placeholder="/images/college.jpg" className="input" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Brief Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => f("description", e.target.value)}
                  placeholder="Tell students about this college..." className="input py-3" />
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : (editingId ? "Save Changes" : "Add College")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
