"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import { MessageSquare, Trash2, Search, ThumbsUp, Link as LinkIcon, ExternalLink, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ForumModerationPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/forum/posts");
      setPosts(res.data.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post and all its comments? This cannot be undone.")) return;
    try {
      await api.delete(`/forum/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch { alert("Failed to delete post"); }
  };

  const filtered = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.author?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Topbar title="Forum Moderation" />
      <div className="px-4 md:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts or authors..." className="input pl-11 w-72" />
          </div>
          <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> {posts.length} Total Posts
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-4 font-black uppercase text-xs tracking-widest text-slate-500 w-1/2">Post Details</th>
                <th className="px-5 py-4 font-black uppercase text-xs tracking-widest text-slate-500">Author</th>
                <th className="px-5 py-4 font-black uppercase text-xs tracking-widest text-slate-500 text-center">Stats</th>
                <th className="px-5 py-4 font-black uppercase text-xs tracking-widest text-slate-500">Posted</th>
                <th className="px-5 py-4 font-black uppercase text-xs tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-500 font-medium">No posts found.</td></tr>
              ) : filtered.map(p => (
                <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 mb-1 line-clamp-1">{p.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{p.content}</div>
                    <div className="mt-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-widest">{p.examCategory}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700">{p.author?.name || "Unknown"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1 text-slate-500 font-bold text-xs"><ThumbsUp className="w-3 h-3"/> {p.upvotes.length}</div>
                      <div className="flex items-center gap-1 text-slate-500 font-bold text-xs"><MessageSquare className="w-3 h-3"/> {p.commentCount}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs font-medium">{formatDistanceToNow(new Date(p.createdAt))} ago</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`http://localhost:3000/forum/${p._id}`} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200" title="View on student site">
                        <ExternalLink className="w-4 h-4"/>
                      </a>
                      <button onClick={() => handleDelete(p._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Delete Post">
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
    </div>
  );
}
