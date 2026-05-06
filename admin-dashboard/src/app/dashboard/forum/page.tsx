"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import {
  MessageSquare, Trash2, Search, ThumbsUp, ExternalLink,
  Loader2, Eye, X, ChevronDown, AlertTriangle, Shield, Clock, Users
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/store/toastStore";
import { confirm } from "@/components/ConfirmDialog";

interface PostComment {
  _id: string;
  content: string;
  author: { _id: string; name: string };
  createdAt: string;
}

export default function ForumModerationPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewPost, setViewPost] = useState<any>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

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
    confirm("Are you sure you want to delete this post and all its comments? This cannot be undone.", async () => {
      try {
        await api.delete(`/forum/posts/${id}`);
        setPosts(posts.filter(p => p._id !== id));
        if (viewPost?._id === id) setViewPost(null);
        toast.success("Post deleted");
      } catch { toast.error("Failed to delete post"); }
    }, "Delete Post");
  };

  const handleDeleteComment = async (commentId: string) => {
    confirm("Delete this comment?", async () => {
      try {
        await api.delete(`/forum/comments/${commentId}`);
        setComments(comments.filter(c => c._id !== commentId));
        toast.success("Comment deleted");
      } catch { toast.error("Failed to delete comment"); }
    }, "Delete Comment");
  };

  const handleViewPost = async (post: any) => {
    setViewPost(post);
    setLoadingComments(true);
    try {
      const res = await api.get(`/forum/posts/${post._id}`);
      setComments(res.data.data.comments || []);
    } catch {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const categories = Array.from(new Set(posts.map(p => p.examCategory))).filter(Boolean);

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || p.examCategory === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalComments = posts.reduce((a, p) => a + (p.commentCount || 0), 0);
  const totalUpvotes = posts.reduce((a, p) => a + (p.upvotes?.length || 0), 0);

  return (
    <div>
      <Topbar title="Forum Moderation" />
      <div className="px-4 md:px-8 py-8 space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Posts", value: posts.length, icon: MessageSquare, color: "#6366f1" },
            { label: "Comments", value: totalComments, icon: Clock, color: "#06b6d4" },
            { label: "Upvotes", value: totalUpvotes, icon: ThumbsUp, color: "#8b5cf6" },
            { label: "Categories", value: categories.length, icon: Users, color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} className="card card-hover p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}15` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts or authors..." className="input pl-11 w-full md:w-72" />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input !w-auto !py-3"
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Posts Card Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="card py-20 text-center">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(p => (
              <div key={p._id} className="card card-hover p-5 group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">{p.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.content}</p>
                  </div>
                  <span className="badge badge-indigo whitespace-nowrap shrink-0">{p.examCategory}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span className="font-medium">by <span className="font-bold text-slate-300">{p.author?.name || "Unknown"}</span></span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(p.createdAt))} ago</span>
                </div>

                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <ThumbsUp className="w-3.5 h-3.5" /> {p.upvotes?.length || 0}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5" /> {p.commentCount || 0}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleViewPost(p)} className="p-2 rounded-lg transition-all hover:text-indigo-400" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }} title="View Post & Comments">
                      <Eye className="w-4 h-4" />
                    </button>
                    <a href={`http://localhost:3000/forum/${p._id}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg transition-all hover:text-cyan-400" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }} title="View on student site">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => handleDelete(p._id)} className="btn-danger !py-2 !px-2" title="Delete Post">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Detail Drawer/Modal */}
      {viewPost && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-10 sm:p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-2xl animate-fadeUp flex flex-col max-h-[85vh] overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1.75rem" }}>

            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                  {viewPost.author?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{viewPost.author?.name || "Unknown"}</div>
                  <div className="text-[10px] font-medium text-slate-500">
                    {formatDistanceToNow(new Date(viewPost.createdAt))} ago in <span className="uppercase font-bold" style={{ color: "#818cf8" }}>{viewPost.examCategory}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setViewPost(null)} className="p-2 rounded-xl hover:bg-white/5" style={{ color: "#475569" }}><X className="w-5 h-5" /></button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
                <h2 className="text-xl font-black text-white mb-3 leading-tight">{viewPost.title}</h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{viewPost.content}</p>

                <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-400">
                    <ThumbsUp className="w-4 h-4" /> {viewPost.upvotes?.length || 0} Upvotes
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-400">
                    <MessageSquare className="w-4 h-4" /> {viewPost.commentCount || 0} Comments
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="px-6 py-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Comments</h3>

                {loadingComments ? (
                  <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                ) : comments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-500 font-medium">No comments yet.</div>
                ) : (
                  <div className="space-y-3">
                    {comments.map(c => (
                      <div key={c._id} className="rounded-xl p-4 flex gap-3" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                        <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>
                          {c.author?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{c.author?.name || "Unknown"}</span>
                              <span className="text-[10px] text-slate-500">{formatDistanceToNow(new Date(c.createdAt))} ago</span>
                            </div>
                            <button onClick={() => handleDeleteComment(c._id)} className="text-slate-600 hover:text-red-500 transition-colors shrink-0" title="Delete Comment">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-slate-300 text-sm whitespace-pre-wrap">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 flex items-center justify-between shrink-0" style={{ borderTop: "1px solid var(--border)", background: "var(--surface2)" }}>
              <a href={`http://localhost:3000/forum/${viewPost._id}`} target="_blank" rel="noreferrer"
                className="text-sm font-bold hover:underline flex items-center gap-1.5" style={{ color: "#818cf8" }}
              >
                <ExternalLink className="w-4 h-4" /> View on Student Site
              </a>
              <button onClick={() => { handleDelete(viewPost._id); }} className="btn-danger flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
