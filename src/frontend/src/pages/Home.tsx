import { useEffect, useState } from "react";

const TEMPLATES = [
  {
    id: "1",
    name: "Instagram Post",
    category: "Social Media",
    dims: "1080×1080",
    color: "#6D5EF6",
    textColor: "#fff",
  },
  {
    id: "2",
    name: "Facebook Cover",
    category: "Social Media",
    dims: "820×312",
    color: "#3B82F6",
    textColor: "#fff",
  },
  {
    id: "3",
    name: "Twitter Header",
    category: "Social Media",
    dims: "1500×500",
    color: "#06B6D4",
    textColor: "#fff",
  },
  {
    id: "4",
    name: "LinkedIn Banner",
    category: "Social Media",
    dims: "1584×396",
    color: "#0EA5E9",
    textColor: "#fff",
  },
  {
    id: "5",
    name: "Presentation 16:9",
    category: "Presentations",
    dims: "1920×1080",
    color: "#8B5CF6",
    textColor: "#fff",
  },
  {
    id: "6",
    name: "Pitch Deck",
    category: "Presentations",
    dims: "1280×720",
    color: "#EC4899",
    textColor: "#fff",
  },
  {
    id: "7",
    name: "Event Poster",
    category: "Posters",
    dims: "794×1123",
    color: "#F59E0B",
    textColor: "#fff",
  },
  {
    id: "8",
    name: "Movie Poster",
    category: "Posters",
    dims: "794×1123",
    color: "#EF4444",
    textColor: "#fff",
  },
  {
    id: "9",
    name: "Flyer",
    category: "Posters",
    dims: "794×1123",
    color: "#10B981",
    textColor: "#fff",
  },
  {
    id: "10",
    name: "Business Card",
    category: "Marketing",
    dims: "1050×600",
    color: "#1E293B",
    textColor: "#fff",
  },
  {
    id: "11",
    name: "Email Header",
    category: "Marketing",
    dims: "600×200",
    color: "#7C3AED",
    textColor: "#fff",
  },
  {
    id: "12",
    name: "Ad Banner",
    category: "Marketing",
    dims: "728×90",
    color: "#059669",
    textColor: "#fff",
  },
  {
    id: "13",
    name: "A4 Document",
    category: "Print",
    dims: "794×1123",
    color: "#374151",
    textColor: "#fff",
  },
  {
    id: "14",
    name: "Resume",
    category: "Print",
    dims: "794×1123",
    color: "#4B5563",
    textColor: "#fff",
  },
  {
    id: "15",
    name: "Certificate",
    category: "Print",
    dims: "1123×794",
    color: "#B45309",
    textColor: "#fff",
  },
];

const CATEGORIES = [
  "All",
  "Social Media",
  "Presentations",
  "Posters",
  "Marketing",
  "Print",
];

const ONBOARDING_STEPS = [
  {
    title: "Welcome to DesignStudio 🎨",
    desc: "Create stunning designs for social media, presentations, posters, and more — no design experience needed.",
    icon: "🎨",
  },
  {
    title: "How it works",
    desc: "Pick a template or start from scratch. Drag and drop elements, edit text, and customize every detail in the editor.",
    icon: "✏️",
  },
  {
    title: "You're ready!",
    desc: 'Start with a template below or click "New Design" to open a blank canvas. Your work is saved automatically.',
    icon: "🚀",
  },
];

export default function Home({ onOpenEditor }: { onOpenEditor: () => void }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [onboarding, setOnboarding] = useState(
    () => !localStorage.getItem("ds_onboarded"),
  );
  const [step, setStep] = useState(0);

  const filtered = TEMPLATES.filter(
    (t) =>
      (category === "All" || t.category === category) &&
      t.name.toLowerCase().includes(search.toLowerCase()),
  );

  function finishOnboarding() {
    localStorage.setItem("ds_onboarded", "1");
    setOnboarding(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F9FC",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #E5E7EB",
          height: 60,
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          gap: 16,
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginRight: "auto",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#6D5EF6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
              <rect
                x="9"
                y="2"
                width="5"
                height="5"
                rx="1"
                fill="white"
                opacity="0.7"
              />
              <rect
                x="2"
                y="9"
                width="5"
                height="5"
                rx="1"
                fill="white"
                opacity="0.7"
              />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "#6D5EF6",
              letterSpacing: "-0.3px",
            }}
          >
            DesignStudio
          </span>
        </div>
        <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {["Features", "Templates", "Pricing", "Learn"].map((l) => (
            <button
              key={l}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: "transparent",
                color: "#6B7280",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F3F4F6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {l}
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#6D5EF6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            U
          </div>
          <button
            onClick={onOpenEditor}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#6D5EF6",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(109,94,246,0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#5B4FD4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#6D5EF6")}
          >
            + New Design
          </button>
        </div>
      </header>

      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #6D5EF6 0%, #8B5CF6 50%, #EC4899 100%)",
          padding: "60px 32px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            margin: "0 0 12px",
            letterSpacing: "-1px",
          }}
        >
          Design anything. Share everywhere.
        </h1>
        <p style={{ fontSize: 18, opacity: 0.85, margin: "0 0 28px" }}>
          Choose from thousands of templates or start from scratch.
        </p>
        <div
          style={{
            maxWidth: 500,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            style={{
              width: "100%",
              padding: "14px 20px 14px 44px",
              borderRadius: 12,
              border: "none",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
              fontSize: 18,
            }}
          >
            🔍
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Blank canvas CTA */}
        <div
          style={{
            background: "#fff",
            border: "2px dashed #D1D5DB",
            borderRadius: 12,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
            cursor: "pointer",
            transition: "border-color 0.2s",
          }}
          onClick={onOpenEditor}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#6D5EF6";
            e.currentTarget.style.background = "#FAFAFA";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#D1D5DB";
            e.currentTarget.style.background = "#fff";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              +
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "#111827", fontSize: 15 }}>
                Create blank canvas
              </div>
              <div style={{ color: "#6B7280", fontSize: 13 }}>
                Start from scratch with a custom size
              </div>
            </div>
          </div>
          <span style={{ color: "#6D5EF6", fontWeight: 600, fontSize: 14 }}>
            Open Editor →
          </span>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "8px 18px",
                borderRadius: 20,
                border: category === c ? "none" : "1px solid #E5E7EB",
                background: category === c ? "#6D5EF6" : "#fff",
                color: category === c ? "#fff" : "#374151",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {filtered.map((t) => (
            <div
              key={t.id}
              onClick={onOpenEditor}
              style={{
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "transform 0.2s, box-shadow 0.2s",
                background: "#fff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-4px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              }}
            >
              <div
                style={{
                  background: t.color,
                  height: 140,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    color: t.textColor,
                    fontWeight: 700,
                    fontSize: 14,
                    textAlign: "center",
                    padding: "0 12px",
                  }}
                >
                  {t.name}
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.3)",
                    color: "#fff",
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontWeight: 500,
                  }}
                >
                  {t.dims}
                </span>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}
                >
                  {t.name}
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                  {t.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding Modal */}
      {onboarding && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 40,
              maxWidth: 460,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>
              {ONBOARDING_STEPS[step].icon}
            </div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 12,
              }}
            >
              {ONBOARDING_STEPS[step].title}
            </h2>
            <p
              style={{
                color: "#6B7280",
                fontSize: 15,
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              {ONBOARDING_STEPS[step].desc}
            </p>
            {/* Step dots */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 6,
                marginBottom: 24,
              }}
            >
              {ONBOARDING_STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === step ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === step ? "#6D5EF6" : "#E5E7EB",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                    color: "#374151",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
              )}
              {step < ONBOARDING_STEPS.length - 1 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 8,
                    border: "none",
                    background: "#6D5EF6",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={finishOnboarding}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 8,
                    border: "none",
                    background: "#6D5EF6",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Get Started 🎉
                </button>
              )}
              <button
                onClick={finishOnboarding}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "transparent",
                  color: "#9CA3AF",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
