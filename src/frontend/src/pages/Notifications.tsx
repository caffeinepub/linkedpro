import {
  Bell,
  Briefcase,
  Gift,
  Heart,
  MessageSquare,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  type Notification,
  getNotifications,
  setNotifications,
} from "../data/storage";

const typeIcons: Record<string, React.ReactNode> = {
  like: <Heart size={14} className="text-red-500" />,
  connection: <UserCheck size={14} className="text-[#0A66C2]" />,
  comment: <MessageSquare size={14} className="text-green-500" />,
  job: <Briefcase size={14} className="text-orange-500" />,
  birthday: <Gift size={14} className="text-purple-500" />,
};

export default function Notifications() {
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifs(getNotifications());
  }, []);

  function markAllRead() {
    const updated = notifs.map((n) => ({ ...n, read: true }));
    setNotifs(updated);
    setNotifications(updated);
  }

  function markRead(id: string) {
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifs(updated);
    setNotifications(updated);
  }

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
      <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF]">
        <div className="flex items-center justify-between p-5 border-b border-[#E3E8EF]">
          <div>
            <h2 className="text-base font-semibold text-[#1F2328]">
              Notifications
            </h2>
            {unread > 0 && (
              <p className="text-xs text-[#65707E]">{unread} new</p>
            )}
          </div>
          {unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-sm text-[#0A66C2] font-medium hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div>
          {notifs.map((n) => (
            <button
              type="button"
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full text-left flex items-start gap-4 p-4 border-b border-[#E3E8EF] cursor-pointer transition-colors hover:bg-gray-50 ${
                !n.read ? "bg-blue-50/50" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bell size={18} className="text-gray-500" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-[#E3E8EF]">
                  {typeIcons[n.type] ?? <Bell size={12} />}
                </span>
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm leading-snug ${!n.read ? "font-medium text-[#1F2328]" : "text-[#1F2328]"}`}
                >
                  {n.text}
                </p>
                <p className="text-xs text-[#8A96A3] mt-1">{n.timestamp}</p>
              </div>
              {!n.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#0A66C2] mt-1.5 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
