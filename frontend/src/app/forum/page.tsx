"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { MessageSquare, ThumbsUp, Plus, Search, Filter, X, UserCircle2, Flame, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ForumHubPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [filterCat, setFilterCat] = useState("all");
  const [sort, setSort] = useState("newest"); // newest | popular
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", examCategory: "" });
  const [saving, setSaving] = useState(false);
  
  const { user } = useAuthStore();

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
    if (!user) return alert("Please log in to post.");
    setSaving(true);
    try {
      await api.post("/forum/posts", form);
      setShowModal(false);
      setForm({ title: "", content: "", examCategory: "" });
      fetchPosts();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to create post");
    } finally {
      setSaving(false);
    }
  };

  const handleUpvote = async (postId: string) => {
    if (!user) return alert("Please log in to upvote.");
    try {
      const res = await api.put(`/forum/posts/${postId}/upvote`);
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

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0b0b0d] py-20 px-4">
      <div className="max-w-[1000px] mx-auto pt-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Community <span className="text-[#a435f0]">Discussions</span></h1>
            <p className="text-slate-500 font-medium text-lg">Ask doubts, share tips, and learn together.</p>
          </div>
          <button 
            onClick={() => {
              if(!user) return alert("Please log in to ask a question.");
              setShowModal(true);
            }} 
            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Ask Question
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setFilterCat("all")}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filterCat === "all" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"}`}
            >
              All Topics
            </button>
            {categories.map(c => (
              <button 
                key={c._id}
                onClick={() => setFilterCat(c.name.toLowerCase())}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filterCat === c.name.toLowerCase() ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-white/10 shrink-0">
            <button 
              onClick={() => setSort("newest")}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${sort === "newest" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500"}`}
            >
              <Clock className="w-4 h-4" /> New
            </button>
            <button 
              onClick={() => setSort("popular")}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${sort === "popular" ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : "text-slate-500"}`}
            >
              <Flame className="w-4 h-4" /> Top
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-[#a435f0] border-t-transparent rounded-full animate-spin" /></div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/10">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No discussions yet</h3>
              <p className="text-slate-500">Be the first to start a conversation in this category!</p>
            </div>
          ) : (
            posts.map(post => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={post._id} 
                className="bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex gap-6 group"
              >
                {/* Upvotes Column */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button 
                    onClick={() => handleUpvote(post._id)}
                    className={`p-2 rounded-lg transition-colors ${user && post.upvotes.includes(user._id) ? "bg-[#a435f0]/10 text-[#a435f0]" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#a435f0]"}`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  <span className={`font-black text-sm ${user && post.upvotes.includes(user._id) ? "text-[#a435f0]" : "text-slate-500"}`}>
                    {post.upvotes.length}
                  </span>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {post.examCategory}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Posted by <span className="font-bold text-slate-600 dark:text-slate-300">{post.author?.name || "Unknown"}</span> • {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                  
                  <Link href={`/forum/${post._id}`} className="block group-hover:text-[#a435f0] transition-colors">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{post.title}</h2>
                  </Link>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">{post.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <Link href={`/forum/${post._id}`} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                      <MessageSquare className="w-4 h-4" /> {post.commentCount} Comments
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Start a Discussion</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleCreatePost} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category</label>
                  <select required value={form.examCategory} onChange={e => setForm({...form, examCategory: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium outline-none focus:border-[#a435f0]">
                    <option value="">Select Category...</option>
                    <option value="general">General Discussion</option>
                    {categories.map(c => <option key={c._id} value={c.name.toLowerCase()}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Title</label>
                  <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="What is your question?" maxLength={100} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-lg outline-none focus:border-[#a435f0]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Details</label>
                  <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Provide more context or details here..." rows={5} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium outline-none focus:border-[#a435f0] resize-none" />
                </div>
                <button disabled={saving} type="submit" className="w-full py-4 bg-[#a435f0] hover:bg-[#8e2dd0] text-white rounded-xl font-black text-lg transition-colors">
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
