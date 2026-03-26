import {
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { type Job, getJobs, setJobs } from "../data/storage";

export default function Jobs() {
  const [jobs, setJobs_] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "saved">("all");
  const [typeFilter, setTypeFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  useEffect(() => {
    setJobs_(getJobs());
  }, []);

  function toggleSave(id: string) {
    const updated = jobs.map((j) =>
      j.id === id ? { ...j, saved: !j.saved } : j,
    );
    setJobs_(updated);
    setJobs(updated);
  }

  function apply(id: string) {
    const updated = jobs.map((j) =>
      j.id === id ? { ...j, applied: true } : j,
    );
    setJobs_(updated);
    setJobs(updated);
  }

  const filtered = jobs.filter((j) => {
    if (tab === "saved" && !j.saved) return false;
    if (
      search &&
      !j.title.toLowerCase().includes(search.toLowerCase()) &&
      !j.company.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (
      typeFilter &&
      !j.location.toLowerCase().includes(typeFilter.toLowerCase())
    )
      return false;
    if (levelFilter && j.level !== levelFilter) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-12">
      {/* Search bar */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-4 mb-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job titles or companies"
              className="w-full pl-8 pr-3 py-2 border border-[#C9D2DC] rounded-md text-sm focus:outline-none focus:border-[#0A66C2]"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-[#C9D2DC] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0A66C2] text-[#65707E]"
          >
            <option value="">Work type</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="CA">On-site</option>
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="border border-[#C9D2DC] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0A66C2] text-[#65707E]"
          >
            <option value="">Experience level</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {(["all", "saved"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
              tab === t
                ? "bg-[#0A66C2] text-white"
                : "text-[#65707E] hover:bg-gray-100"
            }`}
          >
            {t === "all"
              ? "All Jobs"
              : `Saved (${jobs.filter((j) => j.saved).length})`}
          </button>
        ))}
      </div>

      {/* Job list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-12 text-center text-[#65707E] text-sm">
            No jobs found
          </div>
        )}
        {filtered.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-5 flex gap-4 hover:shadow-md transition-shadow"
          >
            <div
              className="w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{ backgroundColor: job.companyColor }}
            >
              {job.company[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[#1F2328] hover:text-[#0A66C2] cursor-pointer">
                {job.title}
              </h3>
              <p className="text-sm text-[#65707E]">{job.company}</p>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#8A96A3]">
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {job.posted}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={11} />
                  {job.salary}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                {job.applied ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle size={14} />
                    Applied
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => apply(job.id)}
                    className="bg-[#0A66C2] hover:bg-[#084E96] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
                  >
                    Easy Apply
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toggleSave(job.id)}
                  className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    job.saved
                      ? "border-[#0A66C2] text-[#0A66C2] bg-blue-50"
                      : "border-[#C9D2DC] text-[#65707E] hover:border-[#0A66C2] hover:text-[#0A66C2]"
                  }`}
                >
                  {job.saved ? (
                    <BookmarkCheck size={14} />
                  ) : (
                    <Bookmark size={14} />
                  )}
                  {job.saved ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
