import {
  Check,
  Eye,
  MapPin,
  Pencil,
  Plus,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import {
  Education,
  Experience,
  Skill,
  type User,
  getUser,
  setUser,
} from "../data/storage";

export default function Profile() {
  const [user, setUser_] = useState<User>(getUser());
  const [editAbout, setEditAbout] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [editHeadline, setEditHeadline] = useState(false);
  const [headlineText, setHeadlineText] = useState("");

  function save(updated: User) {
    setUser_(updated);
    setUser(updated);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-12 space-y-3">
      {/* Cover + Avatar */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#0F4C75] to-[#0A66C2]" />
        <div className="px-6 pb-5">
          <div className="-mt-12 mb-3 flex items-end justify-between">
            <Avatar
              name={user.name}
              size="xl"
              className="border-4 border-white"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                className="border border-[#0A66C2] text-[#0A66C2] text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-50"
              >
                Connect
              </button>
              <button
                type="button"
                className="bg-[#0A66C2] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#084E96]"
              >
                Message
              </button>
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#1F2328]">{user.name}</h1>
              {editHeadline ? (
                <div className="flex gap-2 mt-1">
                  <input
                    value={headlineText}
                    onChange={(e) => setHeadlineText(e.target.value)}
                    className="border border-[#0A66C2] rounded px-2 py-1 text-sm flex-1 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      save({ ...user, headline: headlineText });
                      setEditHeadline(false);
                    }}
                    className="text-green-600"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditHeadline(false)}
                    className="text-gray-400"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-[#1F2328] mt-0.5">{user.headline}</p>
              )}
              <div className="flex items-center gap-1 text-xs text-[#65707E] mt-1">
                <MapPin size={12} />
                <span>{user.location}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setHeadlineText(user.headline);
                setEditHeadline(true);
              }}
              className="text-[#65707E] hover:text-[#0A66C2] p-1"
            >
              <Pencil size={16} />
            </button>
          </div>
          <div className="flex gap-4 mt-3">
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-[#0A66C2] font-semibold hover:underline"
            >
              <Users size={12} />
              {user.connections} connections
            </button>
          </div>
          <div className="flex gap-6 mt-3">
            <div className="text-xs">
              <span className="font-semibold text-[#1F2328]">
                {user.profileViews}
              </span>{" "}
              <span className="text-[#65707E]">profile views</span>
            </div>
            <div className="text-xs">
              <span className="font-semibold text-[#1F2328]">
                {user.postImpressions}
              </span>{" "}
              <span className="text-[#65707E]">post impressions</span>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1F2328]">About</h2>
          <button
            type="button"
            onClick={() => {
              setAboutText(user.about);
              setEditAbout(true);
            }}
            className="text-[#65707E] hover:text-[#0A66C2]"
          >
            <Pencil size={16} />
          </button>
        </div>
        {editAbout ? (
          <div>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={5}
              className="w-full border border-[#C9D2DC] rounded-lg p-3 text-sm focus:outline-none focus:border-[#0A66C2]"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  save({ ...user, about: aboutText });
                  setEditAbout(false);
                }}
                className="bg-[#0A66C2] text-white text-sm px-4 py-1.5 rounded-full hover:bg-[#084E96]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditAbout(false)}
                className="border border-gray-300 text-sm px-4 py-1.5 rounded-full hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#1F2328] leading-relaxed">{user.about}</p>
        )}
      </div>

      {/* Experience */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#1F2328]">Experience</h2>
          <button type="button" className="text-[#65707E] hover:text-[#0A66C2]">
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-5">
          {user.experience?.map((exp) => (
            <div key={exp.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                {exp.company[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1F2328]">
                  {exp.title}
                </p>
                <p className="text-sm text-[#65707E]">{exp.company}</p>
                <p className="text-xs text-[#8A96A3]">
                  {exp.startDate} – {exp.endDate}
                </p>
                <p className="text-sm text-[#1F2328] mt-1 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#1F2328]">Education</h2>
          <button type="button" className="text-[#65707E] hover:text-[#0A66C2]">
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {user.education?.map((edu) => (
            <div key={edu.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                {edu.school[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1F2328]">
                  {edu.school}
                </p>
                <p className="text-sm text-[#65707E]">
                  {edu.degree} {edu.field}
                </p>
                <p className="text-xs text-[#8A96A3]">
                  {edu.startYear} – {edu.endYear}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E3E8EF] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#1F2328]">Skills</h2>
          <button type="button" className="text-[#65707E] hover:text-[#0A66C2]">
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-3">
          {user.skills?.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1F2328]">
                  {skill.name}
                </p>
                <p className="text-xs text-[#65707E]">
                  {skill.endorsements} endorsements
                </p>
              </div>
              <button
                type="button"
                className="border border-[#0A66C2] text-[#0A66C2] text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-50"
              >
                Endorse
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
