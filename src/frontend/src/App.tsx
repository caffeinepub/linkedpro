import { useEffect, useState } from "react";
import Header from "./components/Header";
import { getConversations, getNotifications, seedData } from "./data/storage";
import Feed from "./pages/Feed";
import Jobs from "./pages/Jobs";
import Messaging from "./pages/Messaging";
import Network from "./pages/Network";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

type Page =
  | "feed"
  | "profile"
  | "network"
  | "jobs"
  | "messaging"
  | "notifications";

export default function App() {
  const [page, setPage] = useState<Page>("feed");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    seedData();
    const convs = getConversations();
    setUnreadMessages(convs.reduce((sum, c) => sum + c.unread, 0));
    const notifs = getNotifications();
    setUnreadNotifications(notifs.filter((n) => !n.read).length);
  }, []);

  // Refresh badge counts when navigating away from messaging/notifications
  function handleSetPage(p: Page) {
    setPage(p);
    if (p !== "messaging") {
      const convs = getConversations();
      setUnreadMessages(convs.reduce((sum, c) => sum + c.unread, 0));
    } else {
      setUnreadMessages(0);
    }
    if (p !== "notifications") {
      const notifs = getNotifications();
      setUnreadNotifications(notifs.filter((n) => !n.read).length);
    } else {
      setUnreadNotifications(0);
    }
  }

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("lp_user") || "{}");
    } catch {
      return {};
    }
  })();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EEF3F8" }}>
      <Header
        currentPage={page}
        setPage={handleSetPage}
        unreadMessages={unreadMessages}
        unreadNotifications={unreadNotifications}
        userName={user.name || "User"}
      />
      <div className="pt-14">
        {page === "feed" && <Feed setPage={handleSetPage} />}
        {page === "profile" && <Profile />}
        {page === "network" && <Network />}
        {page === "jobs" && <Jobs />}
        {page === "messaging" && <Messaging />}
        {page === "notifications" && <Notifications />}
      </div>
      {/* Footer */}
      <footer className="border-t border-[#E3E8EF] bg-white mt-8 py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#0F4C75]">LinkedPro</span>
          <div className="flex flex-wrap gap-3 text-xs text-[#65707E]">
            {[
              "About",
              "Accessibility",
              "Help Center",
              "Privacy",
              "Terms",
              "Advertising",
              "Business Services",
            ].map((l) => (
              <span
                key={l}
                className="hover:text-[#0A66C2] cursor-pointer hover:underline"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
