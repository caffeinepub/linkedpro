import {
  Bell,
  Briefcase,
  ChevronDown,
  Grid,
  Home,
  MessageSquare,
  Search,
  Users,
} from "lucide-react";
import Avatar from "./Avatar";

type Page =
  | "feed"
  | "profile"
  | "network"
  | "jobs"
  | "messaging"
  | "notifications";

interface HeaderProps {
  currentPage: Page;
  setPage: (p: Page) => void;
  unreadMessages: number;
  unreadNotifications: number;
  userName: string;
}

export default function Header({
  currentPage,
  setPage,
  unreadMessages,
  unreadNotifications,
  userName,
}: HeaderProps) {
  const navItems: {
    id: Page;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    { id: "feed", label: "Home", icon: <Home size={20} /> },
    { id: "network", label: "My Network", icon: <Users size={20} /> },
    { id: "jobs", label: "Jobs", icon: <Briefcase size={20} /> },
    {
      id: "messaging",
      label: "Messaging",
      icon: <MessageSquare size={20} />,
      badge: unreadMessages,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={20} />,
      badge: unreadNotifications,
    },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14"
      style={{ backgroundColor: "#0F4C75" }}
    >
      <div className="max-w-6xl mx-auto h-full flex items-center px-4 gap-2">
        {/* Logo */}
        <button
          type="button"
          onClick={() => setPage("feed")}
          className="flex items-center gap-1.5 text-white font-bold text-lg flex-shrink-0"
        >
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-[#0F4C75] font-black text-sm">LP</span>
          </div>
          <span className="hidden sm:block">LinkedPro</span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xs mx-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 rounded text-sm bg-blue-900/50 text-white placeholder-blue-200 border border-blue-700 focus:outline-none focus:border-blue-300"
            />
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex items-center gap-1 ml-auto">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`relative flex flex-col items-center px-3 py-1 rounded text-xs transition-all ${
                currentPage === item.id
                  ? "text-white border-b-2 border-white"
                  : "text-blue-200 hover:text-white hover:bg-blue-800/50"
              }`}
            >
              <span className="relative">
                {item.icon}
                {item.badge ? (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                ) : null}
              </span>
              <span className="hidden sm:block mt-0.5">{item.label}</span>
            </button>
          ))}

          {/* Profile */}
          <button
            type="button"
            onClick={() => setPage("profile")}
            className={`flex flex-col items-center px-3 py-1 rounded text-xs transition-all ${
              currentPage === "profile"
                ? "text-white border-b-2 border-white"
                : "text-blue-200 hover:text-white hover:bg-blue-800/50"
            }`}
          >
            <Avatar name={userName} size="sm" />
            <span className="hidden sm:block mt-0.5">Me</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
