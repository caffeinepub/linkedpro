import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar";
import {
  type Conversation,
  getConversations,
  setConversations,
} from "../data/storage";

export default function Messaging() {
  const [conversations, setConversations_] = useState<Conversation[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convs = getConversations();
    setConversations_(convs);
    if (convs.length) setActive(convs[0].id);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: bottomRef is a stable ref
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active, conversations]);

  function sendMessage() {
    if (!text.trim() || !active) return;
    const updated = conversations.map((c) =>
      c.id === active
        ? {
            ...c,
            unread: 0,
            messages: [
              ...c.messages,
              {
                id: `m${Date.now()}`,
                senderId: "me",
                content: text,
                timestamp: "Just now",
              },
            ],
          }
        : c,
    );
    setConversations_(updated);
    setConversations(updated);
    setText("");
  }

  function openConv(id: string) {
    const updated = conversations.map((c) =>
      c.id === id ? { ...c, unread: 0 } : c,
    );
    setConversations_(updated);
    setConversations(updated);
    setActive(id);
  }

  const activeConv = conversations.find((c) => c.id === active);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-4">
      <div
        className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] flex overflow-hidden"
        style={{ height: "calc(100vh - 8rem)" }}
      >
        {/* Conversation list */}
        <div className="w-72 flex-shrink-0 border-r border-[#E3E8EF] flex flex-col">
          <div className="p-4 border-b border-[#E3E8EF]">
            <h2 className="text-base font-semibold text-[#1F2328]">
              Messaging
            </h2>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => openConv(c.id)}
                className={`w-full flex items-start gap-3 p-4 text-left border-b border-[#E3E8EF] transition-colors hover:bg-gray-50 ${
                  active === c.id
                    ? "bg-blue-50 border-l-2 border-l-[#0A66C2]"
                    : ""
                }`}
              >
                <div className="relative">
                  <Avatar name={c.participantName} size="md" />
                  {c.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0A66C2] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm truncate ${c.unread ? "font-semibold text-[#1F2328]" : "text-[#1F2328]"}`}
                  >
                    {c.participantName}
                  </p>
                  <p className="text-xs text-[#65707E] truncate">
                    {c.messages[c.messages.length - 1]?.content}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        {activeConv ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-[#E3E8EF] flex items-center gap-3">
              <Avatar name={activeConv.participantName} size="md" />
              <div>
                <p className="text-sm font-semibold text-[#1F2328]">
                  {activeConv.participantName}
                </p>
                <p className="text-xs text-[#65707E]">
                  {activeConv.participantHeadline}
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}
                >
                  {msg.senderId !== "me" && (
                    <Avatar
                      name={activeConv.participantName}
                      size="sm"
                      className="mr-2 mt-1"
                    />
                  )}
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      msg.senderId === "me"
                        ? "bg-[#0A66C2] text-white rounded-br-none"
                        : "bg-gray-100 text-[#1F2328] rounded-bl-none"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${msg.senderId === "me" ? "text-blue-200" : "text-[#8A96A3]"}`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t border-[#E3E8EF] flex gap-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Write a message..."
                className="flex-1 border border-[#C9D2DC] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#0A66C2]"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="bg-[#0A66C2] text-white p-2 rounded-full hover:bg-[#084E96] transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#65707E] text-sm">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
