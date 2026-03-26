import {
  Calendar,
  FileText,
  Image,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  ThumbsUp,
  Video,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import {
  type Post,
  getConnections,
  getNotifications,
  getPosts,
  getUser,
  setPosts,
} from "../data/storage";

type Page =
  | "feed"
  | "profile"
  | "network"
  | "jobs"
  | "messaging"
  | "notifications";

export default function Feed({ setPage }: { setPage: (p: Page) => void }) {
  const [posts, setPosts_] = useState<Post[]>([]);
  const user = getUser();
  const [newPostText, setNewPostText] = useState("");
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const connections = getConnections();
  const suggestions = connections
    .filter((c) => c.type === "suggestion")
    .slice(0, 4);
  const news = [
    { title: "Tech layoffs slow as AI hiring surges", time: "2h ago" },
    {
      title: "Remote work remains popular despite RTO mandates",
      time: "4h ago",
    },
    { title: "Open source AI models close gap with GPT-4", time: "6h ago" },
    { title: "Junior developer salaries rise 15% YoY", time: "8h ago" },
    { title: "Rust adoption grows in systems programming", time: "12h ago" },
  ];

  useEffect(() => {
    setPosts_(getPosts());
  }, []);

  function handleLike(id: string) {
    const updated = posts.map((p) =>
      p.id === id
        ? {
            ...p,
            likedByMe: !p.likedByMe,
            likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
          }
        : p,
    );
    setPosts_(updated);
    setPosts(updated);
  }

  function handlePost() {
    if (!newPostText.trim()) return;
    const newPost: Post = {
      id: `p${Date.now()}`,
      authorId: "me",
      authorName: user.name,
      authorHeadline: user.headline,
      authorAvatar: "",
      content: newPostText,
      likes: 0,
      likedByMe: false,
      comments: [],
      shares: 0,
      timestamp: "Just now",
    };
    const updated = [newPost, ...posts];
    setPosts_(updated);
    setPosts(updated);
    setNewPostText("");
  }

  function handleComment(postId: string) {
    if (!commentText.trim()) return;
    const updated = posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c${Date.now()}`,
                authorName: user.name,
                authorAvatar: "",
                content: commentText,
                timestamp: "Just now",
              },
            ],
          }
        : p,
    );
    setPosts_(updated);
    setPosts(updated);
    setCommentText("");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6 pb-8 flex gap-5">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 space-y-3">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] overflow-hidden">
          <div className="h-14 bg-gradient-to-r from-[#0F4C75] to-[#0A66C2]" />
          <div className="px-4 pb-4">
            <div className="-mt-7 mb-2">
              <Avatar
                name={user.name}
                size="lg"
                className="border-2 border-white"
              />
            </div>
            <p className="font-semibold text-[#1F2328] text-sm">{user.name}</p>
            <p className="text-xs text-[#65707E] mt-0.5 leading-tight">
              {user.headline}
            </p>
            <hr className="my-3 border-[#E3E8EF]" />
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#65707E]">Profile viewers</span>
                <span className="font-semibold text-[#0A66C2]">
                  {user.profileViews}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#65707E]">Post impressions</span>
                <span className="font-semibold text-[#0A66C2]">
                  {user.postImpressions}
                </span>
              </div>
            </div>
            <hr className="my-3 border-[#E3E8EF]" />
            <button
              type="button"
              onClick={() => setPage("profile")}
              className="text-xs text-[#65707E] hover:text-[#0A66C2] font-medium"
            >
              My items
            </button>
          </div>
        </div>
        {/* Groups */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-4">
          <p className="text-xs font-semibold text-[#1F2328] mb-3">Groups</p>
          {["React Developers", "System Design", "Open Source"].map((g) => (
            <div
              key={g}
              className="flex items-center gap-2 py-1.5 cursor-pointer hover:text-[#0A66C2]"
            >
              <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-600">
                {g[0]}
              </div>
              <span className="text-xs text-[#1F2328]">{g}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Feed */}
      <main className="flex-1 min-w-0 space-y-3">
        {/* Post Composer */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-4">
          <div className="flex gap-3 mb-3">
            <Avatar name={user.name} size="md" />
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Start a post, try writing with AI"
              className="flex-1 border border-[#C9D2DC] rounded-full px-4 py-2 text-sm resize-none focus:outline-none focus:border-[#0A66C2] hover:border-[#0A66C2] transition-colors"
              rows={newPostText ? 3 : 1}
            />
          </div>
          {newPostText && (
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={handlePost}
                className="bg-[#0A66C2] hover:bg-[#084E96] text-white text-sm font-semibold px-5 py-1.5 rounded-full transition-colors"
              >
                Post
              </button>
            </div>
          )}
          <div className="flex gap-1 flex-wrap">
            {[
              { icon: <Image size={16} />, label: "Photo" },
              { icon: <Video size={16} />, label: "Video" },
              { icon: <Calendar size={16} />, label: "Event" },
              { icon: <FileText size={16} />, label: "Article" },
            ].map((a) => (
              <button
                type="button"
                key={a.label}
                className="flex items-center gap-1.5 text-xs text-[#65707E] hover:text-[#0A66C2] hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-sm border border-[#E3E8EF]"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-3">
                  <Avatar name={post.authorName} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-[#1F2328] hover:text-[#0A66C2] cursor-pointer">
                      {post.authorName}
                    </p>
                    <p className="text-xs text-[#65707E]">
                      {post.authorHeadline}
                    </p>
                    <p className="text-xs text-[#8A96A3]">{post.timestamp}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-[#65707E] hover:text-[#1F2328] p-1 rounded-full hover:bg-gray-100"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <p className="text-sm text-[#1F2328] leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Engagement counts */}
            <div className="px-4 py-1 flex justify-between text-xs text-[#65707E] border-t border-[#E3E8EF]">
              <span className="flex items-center gap-1">
                <span className="inline-flex items-center gap-0.5">
                  <span
                    className="w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center text-white"
                    style={{ fontSize: 9 }}
                  >
                    👍
                  </span>
                </span>
                {post.likes}
              </span>
              <span>
                {post.comments.length} comments · {post.shares} shares
              </span>
            </div>

            {/* Actions */}
            <div className="px-2 py-1 flex border-t border-[#E3E8EF]">
              {[
                {
                  icon: <ThumbsUp size={16} />,
                  label: "Like",
                  active: post.likedByMe,
                  action: () => handleLike(post.id),
                },
                {
                  icon: <MessageCircle size={16} />,
                  label: "Comment",
                  active: false,
                  action: () =>
                    setOpenComments(openComments === post.id ? null : post.id),
                },
                {
                  icon: <Share2 size={16} />,
                  label: "Repost",
                  active: false,
                  action: () => {},
                },
                {
                  icon: <Send size={16} />,
                  label: "Send",
                  active: false,
                  action: () => {},
                },
              ].map((btn) => (
                <button
                  type="button"
                  key={btn.label}
                  onClick={btn.action}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition-colors ${
                    btn.active
                      ? "text-[#0A66C2]"
                      : "text-[#65707E] hover:text-[#1F2328] hover:bg-gray-100"
                  }`}
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Comments section */}
            {openComments === post.id && (
              <div className="px-4 pb-4 border-t border-[#E3E8EF]">
                <div className="space-y-3 mt-3">
                  {post.comments.map((c) => (
                    <div key={c.id} className="flex gap-2">
                      <Avatar name={c.authorName} size="sm" />
                      <div className="bg-gray-50 rounded-lg px-3 py-2 flex-1">
                        <p className="text-xs font-semibold">{c.authorName}</p>
                        <p className="text-xs text-[#1F2328]">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <Avatar name={user.name} size="sm" />
                  <div className="flex-1 flex gap-2">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleComment(post.id)
                      }
                      placeholder="Add a comment..."
                      className="flex-1 border border-[#C9D2DC] rounded-full px-3 py-1.5 text-xs focus:outline-none focus:border-[#0A66C2]"
                    />
                    <button
                      type="button"
                      onClick={() => handleComment(post.id)}
                      className="bg-[#0A66C2] text-white text-xs px-3 py-1.5 rounded-full hover:bg-[#084E96]"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:block w-72 flex-shrink-0 space-y-3">
        <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-4">
          <p className="text-xs font-semibold text-[#1F2328] mb-3">
            Add to your feed
          </p>
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div key={s.id} className="flex items-start gap-3">
                <Avatar name={s.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1F2328] truncate">
                    {s.name}
                  </p>
                  <p className="text-xs text-[#65707E] leading-tight truncate">
                    {s.headline}
                  </p>
                  <button
                    type="button"
                    className="mt-1 text-xs font-semibold text-[#0A66C2] border border-[#0A66C2] rounded-full px-3 py-0.5 hover:bg-blue-50 transition-colors"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-4">
          <p className="text-xs font-semibold text-[#1F2328] mb-3">
            LinkedPro News
          </p>
          <div className="space-y-3">
            {news.map((n) => (
              <div
                key={n.title}
                className="cursor-pointer hover:text-[#0A66C2]"
              >
                <p className="text-xs font-medium text-[#1F2328] hover:text-[#0A66C2] leading-tight">
                  {n.title}
                </p>
                <p className="text-[11px] text-[#8A96A3] mt-0.5">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
