import { UserCheck, UserPlus, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import {
  type Connection,
  getConnections,
  setConnections,
} from "../data/storage";

export default function Network() {
  const [connections, setConnections_] = useState<Connection[]>([]);

  useEffect(() => {
    setConnections_(getConnections());
  }, []);

  const requests = connections.filter((c) => c.type === "request");
  const suggestions = connections.filter((c) => c.type === "suggestion");
  const connected = connections.filter((c) => c.type === "connected");

  function accept(id: string) {
    const updated = connections.map((c) =>
      c.id === id ? { ...c, type: "connected" as const } : c,
    );
    setConnections_(updated);
    setConnections(updated);
  }

  function ignore(id: string) {
    const updated = connections.filter((c) => c.id !== id);
    setConnections_(updated);
    setConnections(updated);
  }

  function connect(id: string) {
    const updated = connections.map((c) =>
      c.id === id ? { ...c, type: "connected" as const } : c,
    );
    setConnections_(updated);
    setConnections(updated);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      {/* Invitations */}
      {requests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-6 mb-4">
          <h2 className="text-base font-semibold text-[#1F2328] mb-1">
            Invitations
          </h2>
          <p className="text-xs text-[#65707E] mb-4">
            {requests.length} pending
          </p>
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center gap-4">
                <Avatar name={r.name} size="lg" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1F2328]">
                    {r.name}
                  </p>
                  <p className="text-xs text-[#65707E]">{r.headline}</p>
                  <p className="text-xs text-[#8A96A3]">
                    {r.mutualConnections} mutual connections
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => ignore(r.id)}
                    className="border border-gray-400 text-gray-600 text-sm font-medium px-4 py-1.5 rounded-full hover:border-[#1F2328] hover:text-[#1F2328] transition-colors"
                  >
                    Ignore
                  </button>
                  <button
                    type="button"
                    onClick={() => accept(r.id)}
                    className="bg-[#0A66C2] text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-[#084E96] transition-colors"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-6">
        <h2 className="text-base font-semibold text-[#1F2328] mb-4">
          People you may know
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="border border-[#E3E8EF] rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <Avatar name={s.name} size="lg" className="mb-2" />
              <p className="text-sm font-semibold text-[#1F2328]">{s.name}</p>
              <p className="text-xs text-[#65707E] mt-0.5 leading-tight">
                {s.headline}
              </p>
              <p className="text-xs text-[#8A96A3] mt-1">
                {s.mutualConnections} mutual connections
              </p>
              <button
                type="button"
                onClick={() => connect(s.id)}
                className="mt-3 border border-[#0A66C2] text-[#0A66C2] text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-1.5"
              >
                <UserPlus size={14} />
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Connected */}
      {connected.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-6 mt-4">
          <h2 className="text-base font-semibold text-[#1F2328] mb-4">
            Connections ({connected.length})
          </h2>
          <div className="space-y-3">
            {connected.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <Avatar name={c.name} size="md" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1F2328]">
                    {c.name}
                  </p>
                  <p className="text-xs text-[#65707E]">{c.headline}</p>
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <UserCheck size={14} />
                  Connected
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
