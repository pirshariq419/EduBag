"use client";
import { useEffect, useState, use } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, Trash2, ChevronLeft, Send, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const fetchPost = async () => {
    try {
      const res = await api.get(`/forum/posts/${unwrappedParams.id}`);
      setPost(res.data.data.post);
      setComments(res.data.data.comments);
    } catch (err) {
      alert("Post not found");
      router.push("/forum");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [unwrappedParams.id]);

  const handleUpvote = async () => {
    if (!user) return alert("Log in to upvote");
    try {
      const res = await api.put(`/forum/posts/${post._id}/upvote`);
      setPost({ 
        ...post, 
        upvotes: post.upvotes.includes(user._id) 
          ? post.upvotes.filter((id: string) => id !== user._id) 
          : [...post.upvotes, user._id] 
      });
    } catch {}
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Log in to comment");
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await api.post(`/forum/posts/${post._id}/comments`, { content: newComment });
      setComments([...comments, res.data.data]);
      setNewComment("");
      setPost({ ...post, commentCount: post.commentCount + 1 });
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/forum/posts/${post._id}`);
      router.push("/forum");
    } catch {
      alert("Failed to delete");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete comment?")) return;
    try {
      await api.delete(`/forum/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      setPost({ ...post, commentCount: post.commentCount - 1 });
    } catch {
      alert("Failed to delete comment");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#fafafa] dark:bg-[#0b0b0d] flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#a435f0] border-t-transparent rounded-full animate-spin"/></div>;
  if (!post) return null;

  const isAuthor = user && user._id === post.author?._id;
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0b0b0d] py-20 px-4">
      <div className="max-w-[800px] mx-auto pt-10">
        
        <Link href="/forum" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Discussions
        </Link>

        {/* Original Post */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400">
                {post.author?.name?.charAt(0) || "U"}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{post.author?.name || "Unknown User"}</div>
                <div className="text-xs font-medium text-slate-400">{formatDistanceToNow(new Date(post.createdAt))} ago in <span className="uppercase text-[#a435f0]">{post.examCategory}</span></div>
              </div>
            </div>
            
            {(isAuthor || isAdmin) && (
              <button onClick={handleDeletePost} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{post.title}</h1>
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap mb-8">{post.content}</p>
          
          <div className="flex items-center gap-6 pt-6 border-t border-slate-100 dark:border-white/10">
            <button 
              onClick={handleUpvote}
              className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition-colors ${user && post.upvotes.includes(user._id) ? "bg-[#a435f0]/10 text-[#a435f0]" : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
            >
              <ThumbsUp className="w-5 h-5" /> {post.upvotes.length}
            </button>
            <div className="flex items-center gap-2 font-bold text-slate-500">
              <MessageSquare className="w-5 h-5" /> {post.commentCount}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white pl-2">Comments ({post.commentCount})</h3>

          {/* Add Comment */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="relative">
              <textarea 
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a comment..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 pr-16 min-h-[100px] outline-none focus:border-[#a435f0] resize-none shadow-sm" 
              />
              <button 
                type="submit" 
                disabled={submitting || !newComment.trim()}
                className="absolute bottom-4 right-4 p-2 bg-[#a435f0] text-white rounded-xl hover:bg-[#8e2dd0] disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl text-center border border-slate-200 dark:border-white/10">
              <p className="font-bold text-slate-500 mb-2">Join the discussion</p>
              <Link href="/login" className="text-[#a435f0] font-black hover:underline">Log in to comment</Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment._id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex gap-4">
                <div className="w-8 h-8 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs">
                  {comment.author?.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{comment.author?.name || "Unknown User"}</span>
                      <span className="text-xs font-medium text-slate-400">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                    </div>
                    {(user && user._id === comment.author?._id || isAdmin) && (
                      <button onClick={() => handleDeleteComment(comment._id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
