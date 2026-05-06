"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";
import {
  MessageSquare, ThumbsUp, Plus, Search, X, Flame, Clock,
  TrendingUp, Users, ChevronRight, Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ForumHubPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  const [filterCat, setFilterCat] = useState("all");
  const [sort, setSort] = useState("newest"); // newest | popular
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", examCategory: "" });
  const [saving, setSaving] = useState(false);

  const { user } = useAuthStore();
  const router = useRouter();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/forum/posts?category=${filterCat}&sort=${sort}`);
      setPosts(res.data.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch { }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [filterCat, sort]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.warning("Please log in to post.");
    setSaving(true);
    try {
      await api.post("/forum/posts", form);
      setShowModal(false);
      setForm({ title: "", content: "", examCategory: "" });
      fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create post");
    } finally {
      setSaving(false);
    }
  };

  const handleUpvote = async (postId: string) => {
    if (!user) {
      toast.warning("Please log in to upvote.");
      router.push("/login");
      return;
    }
    try {
      await api.put(`/forum/posts/${postId}/upvote`);
      setPosts(posts.map(p => {
        if (p._id === postId) {
          const hasUpvoted = p.upvotes.includes(user._id);
          const newUpvotes = hasUpvoted ? p.upvotes.filter((id: string) => id !== user._id) : [...p.upvotes, user._id];
          return { ...p, upvotes: newUpvotes };
        }
        return p;
      }));
    } catch { }
  };

  // Filter by search query locally
  const displayPosts = searchQuery
    ? posts.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : posts;

  // Stats
  const totalDiscussions = posts.length;
  const totalComments = posts.reduce((a, p) => a + (p.commentCount || 0), 0);
  const totalUpvotes = posts.reduce((a, p) => a + (p.upvotes?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0b0b0d] py-20 px-4">
      <div className="max-w-[1000px] mx-auto pt-10">

        {/* Hero Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a435f0] to-[#6d28d9] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Community <span className="text-[#a435f0]">Forum</span>
                </h1>
              </div>
              <p className="text-slate-500 font-medium text-base md:text-lg">Ask doubts, share tips, and learn together with students across J&K.</p>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  toast.warning("Please log in to ask a question.");
                  router.push("/login");
                  return;
                }
                setShowModal(true);
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-[#a435f0] to-[#6d28d9] text-white rounded-2xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Ask a Question
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              { label: "Discussions", value: totalDiscussions, icon: MessageSquare, color: "#a435f0" },
              { label: "Comments", value: totalComments, icon: TrendingUp, color: "#06b6d4" },
              { label: "Upvotes", value: totalUpvotes, icon: ThumbsUp, color: "#f59e0b" },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-4 text-center">
                <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setFilterCat("all")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterCat === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-[#a435f0]/30"
                }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setFilterCat("general")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterCat === "general"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-[#a435f0]/30"
                }`}
            >
              💬 General
            </button>
            {categories.map(c => (
              <button
                key={c._id}
                onClick={() => setFilterCat(c.name.toLowerCase())}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterCat === c.name.toLowerCase()
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-[#a435f0]/30"
                  }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2.5 rounded-xl border transition-all ${showSearch ? "bg-[#a435f0]/10 text-[#a435f0] border-[#a435f0]/30" : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10 hover:text-[#a435f0]"}`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setSort("newest")}
                className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${sort === "newest" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Clock className="w-3.5 h-3.5" /> New
              </button>
              <button
                onClick={() => setSort("popular")}
                className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${sort === "popular" ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Flame className="w-3.5 h-3.5" /> Top
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar (conditional) */}
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search discussions..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-[#a435f0] text-slate-900 dark:text-white font-medium"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-[#a435f0] border-t-transparent rounded-full animate-spin" /></div>
          ) : displayPosts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/10">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No discussions yet</h3>
              <p className="text-slate-500 mb-6">Be the first to start a conversation!</p>
              <button
                onClick={() => {
                  if (!user) {
                    toast.warning("Please log in to ask a question.");
                    router.push("/login");
                    return;
                  }
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-[#a435f0] text-white rounded-xl font-bold hover:bg-[#8e2dd0] transition-all"
              >
                Ask a Question
              </button>
            </div>
          ) : (
            displayPosts.map((post, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                key={post._id}
                className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#a435f0]/20 transition-all flex gap-4 md:gap-6 group"
              >
                {/* Upvotes Column */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleUpvote(post._id)}
                    className={`p-2 rounded-xl transition-all ${user && post.upvotes.includes(user._id)
                      ? "bg-[#a435f0]/10 text-[#a435f0] scale-110"
                      : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#a435f0]"
                      }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  <span className={`font-black text-sm ${user && post.upvotes.includes(user._id) ? "text-[#a435f0]" : "text-slate-500"}`}>
                    {post.upvotes.length}
                  </span>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-[#a435f0]/10 text-[#a435f0]">
                      {post.examCategory}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      <span className="font-bold text-slate-600 dark:text-slate-300">{post.author?.name || "Anonymous"}</span> • {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>

                  <Link href={`/forum/${post._id}`} className="block group-hover:text-[#a435f0] transition-colors">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1.5 leading-tight">{post.title}</h2>
                  </Link>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">{post.content}</p>

                  <div className="flex items-center gap-4">
                    <Link href={`/forum/${post._id}`} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#a435f0] transition-colors">
                      <MessageSquare className="w-4 h-4" /> {post.commentCount} {post.commentCount === 1 ? 'Reply' : 'Replies'}
                    </Link>
                    <Link href={`/forum/${post._id}`} className="text-xs font-bold text-[#a435f0] hover:underline flex items-center gap-1 ml-auto">
                      View Discussion <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-10 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Start a Discussion</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Ask a doubt or share something useful</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleCreatePost} className="p-6 space-y-5 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category</label>
                  <select required value={form.examCategory} onChange={e => setForm({ ...form, examCategory: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium outline-none focus:border-[#a435f0] text-slate-900 dark:text-white">
                    <option value="">Select Category...</option>
                    <option value="general">💬 General Discussion</option>
                    {categories.map(c => <option key={c._id} value={c.name.toLowerCase()}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Title</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="What is your question?" maxLength={100} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-lg outline-none focus:border-[#a435f0] text-slate-900 dark:text-white" />
                  <p className="text-right text-[10px] font-bold text-slate-400">{form.title.length}/100</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Details</label>
                  <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Provide more context or details here..." rows={5} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium outline-none focus:border-[#a435f0] resize-none text-slate-900 dark:text-white" />
                </div>
                <button disabled={saving} type="submit" className="w-full py-4 bg-gradient-to-r from-[#a435f0] to-[#6d28d9] hover:from-[#8e2dd0] hover:to-[#5b21b6] text-white rounded-xl font-black text-lg transition-all shadow-lg shadow-purple-500/20">
                  {saving ? "Posting..." : "Post Discussion"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
