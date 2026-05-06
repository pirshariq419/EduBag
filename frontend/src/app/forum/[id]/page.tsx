"use client";
import { useEffect, useState, use } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, Trash2, ChevronLeft, Send, Share2, BookmarkPlus } from "lucide-react";
import { confirm } from "@/components/ConfirmDialog";
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
      toast.error("Post not found");
      router.push("/forum");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [unwrappedParams.id]);

  const handleUpvote = async () => {
    if (!user) {
      toast.warning("Log in to upvote");
      router.push("/login");
      return;
    }
    try {
      await api.put(`/forum/posts/${post._id}/upvote`);
      setPost({
        ...post,
        upvotes: post.upvotes.includes(user._id)
          ? post.upvotes.filter((id: string) => id !== user._id)
          : [...post.upvotes, user._id]
      });
    } catch { }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.warning("Log in to comment");
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/forum/posts/${post._id}/comments`, { content: newComment });
      setComments([...comments, res.data.data]);
      setNewComment("");
      setPost({ ...post, commentCount: post.commentCount + 1 });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    confirm("Are you sure you want to delete this post?", async () => {
      try {
        await api.delete(`/forum/posts/${post._id}`);
        router.push("/forum");
      } catch {
        toast.error("Failed to delete");
      }
    }, "Delete Post");
  };

  const handleDeleteComment = async (commentId: string) => {
    confirm("Delete this comment?", async () => {
      try {
        await api.delete(`/forum/comments/${commentId}`);
        setComments(comments.filter(c => c._id !== commentId));
        setPost({ ...post, commentCount: post.commentCount - 1 });
      } catch {
        toast.error("Failed to delete comment");
      }
    }, "Delete Comment");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#fafafa] dark:bg-[#0b0b0d] flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#a435f0] border-t-transparent rounded-full animate-spin" /></div>;
  if (!post) return null;

  const isAuthor = user && user._id === post.author?._id;
  const isAdmin = user && user.role === 'admin';
  const hasUpvoted = user && post.upvotes.includes(user._id);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0b0b0d] py-20 px-4">
      <div className="max-w-[800px] mx-auto pt-10">

        <Link href="/forum" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#a435f0] mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Discussions
        </Link>

        {/* Original Post */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm mb-8 overflow-hidden">
          {/* Post Header */}
          <div className="px-6 md:px-8 pt-6 md:pt-8 pb-5 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#a435f0] to-[#6d28d9] flex items-center justify-center font-black text-white text-sm">
                  {post.author?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{post.author?.name || "Unknown User"}</div>
                  <div className="text-xs font-medium text-slate-400">
                    {formatDistanceToNow(new Date(post.createdAt))} ago in{" "}
                    <span className="uppercase text-[#a435f0] font-bold">{post.examCategory}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleShare} className="p-2 text-slate-400 hover:text-[#a435f0] hover:bg-[#a435f0]/10 rounded-xl transition-all" title="Share">
                  <Share2 className="w-4 h-4" />
                </button>
                {(isAuthor || isAdmin) && (
                  <button onClick={handleDeletePost} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all" title="Delete Post">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">{post.title}</h1>
          </div>

          {/* Post Body */}
          <div className="px-6 md:px-8 py-6">
            <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Actions */}
          <div className="px-6 md:px-8 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-4">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl transition-all ${hasUpvoted
                ? "bg-[#a435f0]/10 text-[#a435f0] shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10"
                }`}
            >
              <ThumbsUp className={`w-5 h-5 ${hasUpvoted ? "fill-[#a435f0]" : ""}`} />
              <span>{post.upvotes.length}</span>
              <span className="hidden sm:inline text-sm">{hasUpvoted ? "Upvoted" : "Upvote"}</span>
            </button>
            <div className="flex items-center gap-2 font-bold text-slate-500 px-4 py-2.5">
              <MessageSquare className="w-5 h-5" />
              <span>{post.commentCount}</span>
              <span className="hidden sm:inline text-sm">{post.commentCount === 1 ? 'Reply' : 'Replies'}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Replies <span className="text-slate-400 font-bold text-base">({comments.length})</span>
            </h3>
          </div>

          {/* Add Comment */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a thoughtful reply..."
                className="w-full p-5 min-h-[120px] outline-none resize-none text-slate-900 dark:text-white bg-transparent"
              />
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <p className="text-xs text-slate-400">Be helpful and respectful</p>
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-5 py-2.5 bg-[#a435f0] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#8e2dd0] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Posting..." : "Reply"}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl text-center border border-slate-200 dark:border-white/10">
              <p className="font-bold text-slate-500 mb-2">Join the discussion</p>
              <Link href="/login" className="text-[#a435f0] font-black hover:underline">Log in to reply</Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="font-medium text-sm">No replies yet. Be the first to respond!</p>
              </div>
            )}
            {comments.map((comment, index) => (
              <div key={comment._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex gap-4 hover:border-[#a435f0]/10 transition-all">
                <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-xs">
                  {comment.author?.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{comment.author?.name || "Unknown User"}</span>
                      <span className="text-xs font-medium text-slate-400">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                      {comment.author?._id === post.author?._id && (
                        <span className="px-2 py-0.5 bg-[#a435f0]/10 text-[#a435f0] text-[9px] font-black rounded-full uppercase tracking-widest">OP</span>
                      )}
                    </div>
                    {(user && user._id === comment.author?._id || isAdmin) && (
                      <button onClick={() => handleDeleteComment(comment._id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
