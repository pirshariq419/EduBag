"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import {
  MessageSquare, Trash2, Search, ThumbsUp, ExternalLink,
  Loader2, Eye, X, ChevronDown, AlertTriangle, Shield, Clock, Users
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
    if (!confirm("Are you sure you want to delete this post and all its comments? This cannot be undone.")) return;
    try {
      await api.delete(`/forum/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
      if (viewPost?._id === id) setViewPost(null);
    } catch { alert("Failed to delete post"); }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/forum/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch { alert("Failed to delete comment"); }
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

  // Get unique categories from posts
  const categories = Array.from(new Set(posts.map(p => p.examCategory))).filter(Boolean);

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || p.examCategory === filterCategory;
    return matchSearch && matchCategory;
  });

  // Stats
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
            { label: "Total Comments", value: totalComments, icon: Clock, color: "#06b6d4" },
            { label: "Total Upvotes", value: totalUpvotes, icon: ThumbsUp, color: "#8b5cf6" },
            { label: "Categories", value: categories.length, icon: Users, color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}15` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{s.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts or authors..." className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-72" />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
          <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(p => (
              <div key={p._id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.content}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-widest whitespace-nowrap shrink-0">{p.examCategory}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span className="font-medium">by <span className="font-bold text-slate-600">{p.author?.name || "Unknown"}</span></span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(p.createdAt))} ago</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <ThumbsUp className="w-3.5 h-3.5" /> {p.upvotes?.length || 0}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <MessageSquare className="w-3.5 h-3.5" /> {p.commentCount || 0}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleViewPost(p)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all" title="View Post & Comments">
                      <Eye className="w-4 h-4" />
                    </button>
                    <a href={`http://localhost:3000/forum/${p._id}`} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all" title="View on student site">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => handleDelete(p._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all" title="Delete Post">
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
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-10 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewPost(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-600 text-sm">
                  {viewPost.author?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{viewPost.author?.name || "Unknown"}</div>
                  <div className="text-[10px] font-medium text-slate-400">
                    {formatDistanceToNow(new Date(viewPost.createdAt))} ago in <span className="uppercase text-indigo-600 font-bold">{viewPost.examCategory}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setViewPost(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900 mb-3 leading-tight">{viewPost.title}</h2>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{viewPost.content}</p>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                    <ThumbsUp className="w-4 h-4" /> {viewPost.upvotes?.length || 0} Upvotes
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                    <MessageSquare className="w-4 h-4" /> {viewPost.commentCount || 0} Comments
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="px-6 py-5">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Comments</h3>

                {loadingComments ? (
                  <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                ) : comments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400 font-medium">No comments yet.</div>
                ) : (
                  <div className="space-y-3">
                    {comments.map(c => (
                      <div key={c._id} className="bg-slate-50 rounded-xl p-4 flex gap-3">
                        <div className="w-7 h-7 shrink-0 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-[10px]">
                          {c.author?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{c.author?.name || "Unknown"}</span>
                              <span className="text-[10px] text-slate-400">{formatDistanceToNow(new Date(c.createdAt))} ago</span>
                            </div>
                            <button onClick={() => handleDeleteComment(c._id)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0" title="Delete Comment">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-slate-700 text-sm whitespace-pre-wrap">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <a href={`http://localhost:3000/forum/${viewPost._id}`} target="_blank" rel="noreferrer"
                className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" /> View on Student Site
              </a>
              <button onClick={() => { handleDelete(viewPost._id); }} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 flex items-center gap-2 transition-all">
                <Trash2 className="w-4 h-4" /> Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
