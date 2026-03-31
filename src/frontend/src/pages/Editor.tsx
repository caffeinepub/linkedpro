import { useCallback, useEffect, useReducer, useRef, useState } from "react";

// ---- Types ----
export interface CanvasElement {
  id: string;
  type: "text" | "shape" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  text?: string;
  fill: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
  strokeColor?: string;
  strokeWidth?: number;
  borderRadius?: number;
  opacity: number;
  shapeType?: "rectangle" | "circle" | "triangle" | "star" | "line";
  imageUrl?: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  filter?: string;
}

type Action =
  | { type: "ADD"; element: CanvasElement }
  | { type: "UPDATE"; id: string; changes: Partial<CanvasElement> }
  | { type: "MOVE"; id: string; changes: Partial<CanvasElement> }
  | { type: "COMMIT" }
  | { type: "DELETE"; id: string }
  | { type: "REORDER"; id: string; dir: "up" | "down" }
  | { type: "REORDER_ABSOLUTE"; id: string; position: "front" | "back" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "LOAD"; elements: CanvasElement[] };

interface EditorState {
  elements: CanvasElement[];
  past: CanvasElement[][];
  future: CanvasElement[][];
}

const DEMO_ELEMENTS: CanvasElement[] = [
  {
    id: "bg",
    type: "shape",
    shapeType: "rectangle",
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    rotation: 0,
    fill: "#6D5EF6",
    opacity: 0.12,
    borderRadius: 0,
  },
  {
    id: "title",
    type: "text",
    x: 120,
    y: 220,
    width: 560,
    height: 80,
    rotation: 0,
    text: "Welcome to DesignStudio",
    fill: "#1e1b4b",
    fontSize: 48,
    fontFamily: "Inter",
    fontWeight: "700",
    opacity: 1,
    textAlign: "center",
  },
  {
    id: "circle1",
    type: "shape",
    shapeType: "circle",
    x: 620,
    y: 60,
    width: 120,
    height: 120,
    rotation: 0,
    fill: "#f59e0b",
    opacity: 0.9,
  },
];

function pushHistory(
  past: CanvasElement[][],
  current: CanvasElement[],
): CanvasElement[][] {
  const next = [...past, current];
  return next.length > 50 ? next.slice(next.length - 50) : next;
}

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case "LOAD":
      return { ...state, elements: action.elements };
    case "ADD": {
      const elements = [...state.elements, action.element];
      return {
        elements,
        past: pushHistory(state.past, state.elements),
        future: [],
      };
    }
    case "UPDATE": {
      const elements = state.elements.map((e) =>
        e.id === action.id ? { ...e, ...action.changes } : e,
      );
      return {
        elements,
        past: pushHistory(state.past, state.elements),
        future: [],
      };
    }
    case "DELETE": {
      const elements = state.elements.filter((e) => e.id !== action.id);
      return {
        elements,
        past: pushHistory(state.past, state.elements),
        future: [],
      };
    }
    case "REORDER": {
      const idx = state.elements.findIndex((e) => e.id === action.id);
      if (idx < 0) return state;
      const elements = [...state.elements];
      if (action.dir === "up" && idx < elements.length - 1) {
        [elements[idx], elements[idx + 1]] = [elements[idx + 1], elements[idx]];
      } else if (action.dir === "down" && idx > 0) {
        [elements[idx], elements[idx - 1]] = [elements[idx - 1], elements[idx]];
      }
      return {
        elements,
        past: pushHistory(state.past, state.elements),
        future: [],
      };
    }
    case "UNDO": {
      if (!state.past.length) return state;
      const past = [...state.past];
      const elements = past.pop()!;
      return { elements, past, future: [state.elements, ...state.future] };
    }
    case "REDO": {
      if (!state.future.length) return state;
      const future = [...state.future];
      const elements = future.shift()!;
      return {
        elements,
        past: pushHistory(state.past, state.elements),
        future,
      };
    }
    case "MOVE": {
      const elements = state.elements.map((e) =>
        e.id === action.id ? { ...e, ...action.changes } : e,
      );
      return { ...state, elements };
    }
    case "COMMIT": {
      return {
        elements: state.elements,
        past: pushHistory(state.past, state.elements),
        future: [],
      };
    }
    case "REORDER_ABSOLUTE": {
      const idx = state.elements.findIndex((e) => e.id === action.id);
      if (idx < 0) return state;
      const elements = state.elements.filter((e) => e.id !== action.id);
      const el = state.elements[idx];
      if (action.position === "front") elements.push(el);
      else elements.unshift(el);
      return {
        elements,
        past: pushHistory(state.past, state.elements),
        future: [],
      };
    }
    default:
      return state;
  }
}

// ---- Sidebar config ----
const SIDEBAR_TABS = [
  { id: "templates", label: "Templates", icon: "🗂" },
  { id: "elements", label: "Elements", icon: "▦" },
  { id: "text", label: "Text", icon: "T" },
  { id: "uploads", label: "Uploads", icon: "↑" },
  { id: "photos", label: "Photos", icon: "📷" },
  { id: "icons", label: "Icons", icon: "★" },
  { id: "backgrounds", label: "BG", icon: "🎨" },
];

const SHAPES = [
  { label: "Rectangle", shapeType: "rectangle" as const, icon: "▬" },
  { label: "Circle", shapeType: "circle" as const, icon: "●" },
  { label: "Triangle", shapeType: "triangle" as const, icon: "▲" },
  { label: "Star", shapeType: "star" as const, icon: "★" },
  { label: "Line", shapeType: "line" as const, icon: "─" },
];

const BG_COLORS = [
  "#ffffff",
  "#000000",
  "#EEF1F5",
  "#6D5EF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
  "#14B8A6",
  "linear-gradient(135deg,#6D5EF6,#EC4899)",
  "linear-gradient(135deg,#3B82F6,#06B6D4)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#10B981,#3B82F6)",
];

const FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Playfair Display",
  "Montserrat",
  "Georgia",
  "Arial",
];
const FONT_WEIGHTS = ["400", "500", "600", "700", "800"];
const FONT_WEIGHT_LABELS: Record<string, string> = {
  "400": "Regular",
  "500": "Medium",
  "600": "SemiBold",
  "700": "Bold",
  "800": "ExtraBold",
};

const TEXT_PRESETS = [
  {
    label: "Add a Heading",
    fontSize: 48,
    fontWeight: "700",
    text: "Your Heading Here",
  },
  {
    label: "Add a Subheading",
    fontSize: 32,
    fontWeight: "600",
    text: "Your Subheading Here",
  },
  {
    label: "Add Body Text",
    fontSize: 18,
    fontWeight: "400",
    text: "Add your body text here",
  },
  {
    label: "Add a Caption",
    fontSize: 13,
    fontWeight: "400",
    text: "Caption text",
  },
];

const ICONS_SVG = [
  "♥",
  "★",
  "→",
  "✓",
  "●",
  "■",
  "▲",
  "◆",
  "✦",
  "☀",
  "☁",
  "✉",
  "⚡",
  "❄",
  "♠",
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

// ---- TextEditor Component ----
function TextEditor({
  el,
  onDone,
}: { el: CanvasElement; onDone: (text: string) => void }) {
  const [val, setVal] = useState(el.text || "");
  return (
    <textarea
      key={el.id}
      // biome-ignore lint/a11y/noAutofocus: textarea needs focus for inline text editing
      autoFocus
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => onDone(val)}
      onKeyDown={(e) => {
        if (e.key === "Escape") onDone(val);
        e.stopPropagation();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: el.x,
        top: el.y,
        width: el.width,
        minHeight: el.height,
        opacity: el.opacity,
        transform: `rotate(${el.rotation}deg)`,
        color: el.fill,
        fontSize: el.fontSize || 18,
        fontFamily: el.fontFamily || "Inter",
        fontWeight: el.fontWeight || "400",
        fontStyle: el.fontStyle || "normal",
        textDecoration: el.textDecoration || "none",
        textAlign: (el.textAlign as React.CSSProperties["textAlign"]) || "left",
        lineHeight: 1.4,
        padding: 4,
        boxSizing: "border-box",
        outline: "2px solid #3B82F6",
        background: "rgba(255,255,255,0.85)",
        border: "none",
        resize: "none",
        zIndex: 100,
        overflow: "hidden",
      }}
    />
  );
}

// ---- UploadPane Component ----
function UploadPane({
  onAddElement,
}: {
  onAddElement: (
    p: Partial<CanvasElement> & { type: CanvasElement["type"] },
  ) => void;
}) {
  const [uploads, setUploads] = useState<
    Array<{ id: string; name: string; dataUrl: string }>
  >(() => {
    try {
      return JSON.parse(localStorage.getItem("ds_uploads") || "[]");
    } catch {
      return [];
    }
  });
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newUpload = {
          id: Math.random().toString(36).slice(2),
          name: file.name,
          dataUrl,
        };
        setUploads((prev) => {
          const next = [newUpload, ...prev];
          localStorage.setItem("ds_uploads", JSON.stringify(next));
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        data-ocid="uploads.dropzone"
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = "#6D5EF6";
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.borderColor = "#D1D5DB";
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = "#D1D5DB";
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          border: "2px dashed #D1D5DB",
          borderRadius: 10,
          padding: "24px 16px",
          cursor: "pointer",
          textAlign: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#6D5EF6";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#D1D5DB";
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>⬆</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
          Upload files
        </div>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
          PNG, JPG, GIF, SVG
        </div>
      </button>
      {uploads.length > 0 && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
        >
          {uploads.map((u) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: upload card, keyboard handled via global shortcuts
            <div
              key={u.id}
              onClick={() =>
                onAddElement({
                  type: "image",
                  imageUrl: u.dataUrl,
                  width: 200,
                  height: 150,
                  fill: "transparent",
                })
              }
              style={{
                height: 80,
                borderRadius: 8,
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid #E5E7EB",
                background: "#F9FAFB",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6D5EF6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB";
              }}
            >
              <img
                src={u.dataUrl}
                alt={u.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Main Editor ----
export default function Editor({ onGoHome }: { onGoHome: () => void }) {
  const [state, dispatch] = useReducer(reducer, {
    elements: DEMO_ELEMENTS,
    past: [],
    future: [],
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const clipboardRef = useRef<CanvasElement | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [projectName, setProjectName] = useState(
    () => localStorage.getItem("ds_project_name") || "Untitled Design",
  );
  const [editingName, setEditingName] = useState(false);
  const [dragging, setDragging] = useState<{
    id: string;
    ox: number;
    oy: number;
  } | null>(null);
  const [resizing, setResizing] = useState<{
    id: string;
    handle: string;
    startX: number;
    startY: number;
    startEl: CanvasElement;
  } | null>(null);
  const [rotating, setRotating] = useState<{
    id: string;
    cx: number;
    cy: number;
  } | null>(null);
  const [fileMenu, setFileMenu] = useState<string | null>(null);
  const [canvasBg, setCanvasBg] = useState("#ffffff");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(3);
  const [artboardW, setArtboardW] = useState(800);
  const [artboardH, setArtboardH] = useState(600);
  const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);
  const artboardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const selected = state.elements.find((e) => e.id === selectedId) || null;

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ds_canvas_elements");
    if (saved) {
      try {
        const els = JSON.parse(saved);
        if (els?.length) dispatch({ type: "LOAD", elements: els });
      } catch {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("ds_canvas_elements", JSON.stringify(state.elements));
  }, [state.elements]);

  useEffect(() => {
    localStorage.setItem("ds_project_name", projectName);
  }, [projectName]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId) {
          dispatch({ type: "DELETE", id: selectedId });
          setSelectedId(null);
        }
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
          e.preventDefault();
          dispatch({ type: "UNDO" });
        }
        if (e.key === "y" || (e.shiftKey && e.key === "z")) {
          e.preventDefault();
          dispatch({ type: "REDO" });
        }
        if (e.key === "d") {
          e.preventDefault();
          if (selected) {
            dispatch({
              type: "ADD",
              element: {
                ...selected,
                id: genId(),
                x: selected.x + 20,
                y: selected.y + 20,
              },
            });
          }
        }
        if (e.key === "c") {
          e.preventDefault();
          if (selected) {
            clipboardRef.current = { ...selected };
          }
        }
        if (e.key === "x") {
          e.preventDefault();
          if (selected && selectedId) {
            clipboardRef.current = { ...selected };
            dispatch({ type: "DELETE", id: selectedId });
            setSelectedId(null);
            setSelectedIds([]);
          }
        }
        if (e.key === "v") {
          e.preventDefault();
          if (clipboardRef.current) {
            const newId = genId();
            dispatch({
              type: "ADD",
              element: {
                ...clipboardRef.current,
                id: newId,
                x: clipboardRef.current.x + 20,
                y: clipboardRef.current.y + 20,
              },
            });
            setSelectedId(newId);
            setSelectedIds([]);
          }
        }
        if (e.key === "a") {
          e.preventDefault();
          setSelectedIds(state.elements.map((el) => el.id));
          setSelectedId(null);
        }
      }
      if (selectedId) {
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          dispatch({
            type: "UPDATE",
            id: selectedId,
            changes: { x: (selected?.x || 0) - step },
          });
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          dispatch({
            type: "UPDATE",
            id: selectedId,
            changes: { x: (selected?.x || 0) + step },
          });
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          dispatch({
            type: "UPDATE",
            id: selectedId,
            changes: { y: (selected?.y || 0) - step },
          });
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          dispatch({
            type: "UPDATE",
            id: selectedId,
            changes: { y: (selected?.y || 0) + step },
          });
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, selected, state.elements]);

  // Global mouse move / up for drag, resize, rotate
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (dragging && artboardRef.current) {
        const rect = artboardRef.current.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / zoom - dragging.ox;
        const ny = (e.clientY - rect.top) / zoom - dragging.oy;
        dispatch({
          type: "MOVE",
          id: dragging.id,
          changes: { x: Math.round(nx / 8) * 8, y: Math.round(ny / 8) * 8 },
        });
      }
      if (resizing && artboardRef.current) {
        const dx = (e.clientX - resizing.startX) / zoom;
        const dy = (e.clientY - resizing.startY) / zoom;
        const el = resizing.startEl;
        const h = resizing.handle;
        let nx = el.x;
        let ny = el.y;
        let nw = el.width;
        let nh = el.height;
        if (h.includes("e")) nw = Math.max(20, el.width + dx);
        if (h.includes("s")) nh = Math.max(20, el.height + dy);
        if (h.includes("w")) {
          nw = Math.max(20, el.width - dx);
          nx = el.x + (el.width - nw);
        }
        if (h.includes("n")) {
          nh = Math.max(20, el.height - dy);
          ny = el.y + (el.height - nh);
        }
        dispatch({
          type: "MOVE",
          id: resizing.id,
          changes: { x: nx, y: ny, width: nw, height: nh },
        });
      }
      if (rotating && selected && artboardRef.current) {
        const rect = artboardRef.current.getBoundingClientRect();
        const cx = rect.left + rotating.cx * zoom;
        const cy = rect.top + rotating.cy * zoom;
        const angle =
          Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90;
        dispatch({
          type: "MOVE",
          id: rotating.id,
          changes: { rotation: Math.round(angle) },
        });
      }
    }
    function onUp() {
      if (dragging || resizing || rotating) {
        dispatch({ type: "COMMIT" });
      }
      setDragging(null);
      setResizing(null);
      setRotating(null);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, resizing, rotating, zoom, selected]);

  function addElement(
    partial: Partial<CanvasElement> & { type: CanvasElement["type"] },
  ) {
    const el: CanvasElement = {
      id: genId(),
      x: 200,
      y: 200,
      width: 200,
      height: 80,
      rotation: 0,
      fill: "#6D5EF6",
      opacity: 1,
      ...partial,
    };
    dispatch({ type: "ADD", element: el });
    setSelectedId(el.id);
    setSelectedIds([]);
  }

  function renderShape(el: CanvasElement) {
    const style: React.CSSProperties = {
      position: "absolute",
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      opacity: el.opacity,
      transform: `rotate(${el.rotation}deg)`,
      cursor: dragging?.id === el.id ? "grabbing" : "grab",
      boxSizing: "border-box",
    };
    const isSelected = el.id === selectedId || selectedIds.includes(el.id);
    if (el.strokeColor && el.strokeWidth) {
      style.outline = `${el.strokeWidth}px solid ${el.strokeColor}`;
    }
    if (isSelected) {
      style.outline = "2px solid #3B82F6";
    }

    if (el.shapeType === "circle") {
      return (
        <div
          key={el.id}
          style={{ ...style, borderRadius: "50%", background: el.fill }}
          onMouseDown={(e) => startDrag(e, el)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(el.id);
            setSelectedIds([]);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelectedId(el.id);
              setSelectedIds([]);
            }
          }}
        >
          {isSelected && renderHandles(el)}
        </div>
      );
    }
    if (el.shapeType === "triangle") {
      return (
        <div
          key={el.id}
          style={{ ...style, background: "transparent", overflow: "hidden" }}
          onMouseDown={(e) => startDrag(e, el)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(el.id);
            setSelectedIds([]);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelectedId(el.id);
              setSelectedIds([]);
            }
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${el.width / 2}px solid transparent`,
              borderRight: `${el.width / 2}px solid transparent`,
              borderBottom: `${el.height}px solid ${el.fill}`,
            }}
          />
          {isSelected && renderHandles(el)}
        </div>
      );
    }
    if (el.shapeType === "star") {
      return (
        <div
          key={el.id}
          style={{
            ...style,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: Math.min(el.width, el.height) * 0.8,
            color: el.fill,
            background: "transparent",
          }}
          onMouseDown={(e) => startDrag(e, el)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(el.id);
            setSelectedIds([]);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelectedId(el.id);
              setSelectedIds([]);
            }
          }}
        >
          ★{isSelected && renderHandles(el)}
        </div>
      );
    }
    if (el.shapeType === "line") {
      return (
        <div
          key={el.id}
          style={{
            ...style,
            height: el.strokeWidth || 4,
            background: el.fill,
            borderRadius: 2,
            top: el.y + el.height / 2,
          }}
          onMouseDown={(e) => startDrag(e, el)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(el.id);
            setSelectedIds([]);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelectedId(el.id);
              setSelectedIds([]);
            }
          }}
        >
          {isSelected && renderHandles(el)}
        </div>
      );
    }
    // rectangle
    return (
      <div
        key={el.id}
        style={{
          ...style,
          background: el.fill,
          borderRadius: el.borderRadius ? `${el.borderRadius}px` : 0,
        }}
        onMouseDown={(e) => startDrag(e, el)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(el.id);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setSelectedId(el.id);
          }
        }}
      >
        {isSelected && renderHandles(el)}
      </div>
    );
  }

  function renderText(el: CanvasElement) {
    const isSelected = el.id === selectedId || selectedIds.includes(el.id);
    const isEditing = editingTextId === el.id;

    if (isEditing) {
      return (
        <TextEditor
          key={el.id}
          el={el}
          onDone={(text) => {
            dispatch({ type: "UPDATE", id: el.id, changes: { text } });
            setEditingTextId(null);
          }}
        />
      );
    }

    return (
      <div
        key={el.id}
        style={{
          position: "absolute",
          left: el.x,
          top: el.y,
          width: el.width,
          minHeight: el.height,
          opacity: el.opacity,
          transform: `rotate(${el.rotation}deg)`,
          cursor: isSelected ? "text" : "grab",
          color: el.fill,
          fontSize: el.fontSize || 18,
          fontFamily: el.fontFamily || "Inter",
          fontWeight: el.fontWeight || "400",
          fontStyle: el.fontStyle || "normal",
          textDecoration: el.textDecoration || "none",
          textAlign:
            (el.textAlign as React.CSSProperties["textAlign"]) || "left",
          lineHeight: 1.4,
          wordBreak: "break-word",
          outline: isSelected ? "2px solid #3B82F6" : "none",
          padding: 4,
          boxSizing: "border-box",
        }}
        onMouseDown={(e) => startDrag(e, el)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(el.id);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setSelectedId(el.id);
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setEditingTextId(el.id);
        }}
      >
        {el.text || "Text"}
        {isSelected && renderHandles(el)}
      </div>
    );
  }

  function renderImage(el: CanvasElement) {
    const isSelected = el.id === selectedId || selectedIds.includes(el.id);
    const style: React.CSSProperties = {
      position: "absolute",
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      opacity: el.opacity,
      transform: `rotate(${el.rotation}deg)`,
      cursor: dragging?.id === el.id ? "grabbing" : "grab",
      boxSizing: "border-box",
      outline: isSelected ? "2px solid #3B82F6" : "none",
      overflow: "hidden",
      borderRadius: el.borderRadius ? `${el.borderRadius}px` : 0,
    };
    return (
      <div
        key={el.id}
        style={style}
        onMouseDown={(e) => startDrag(e, el)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(el.id);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setSelectedId(el.id);
          }
        }}
      >
        <img
          src={el.imageUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        {isSelected && renderHandles(el)}
      </div>
    );
  }

  function renderHandles(el: CanvasElement) {
    const handles = [
      { id: "nw", style: { top: -5, left: -5, cursor: "nw-resize" } },
      {
        id: "n",
        style: { top: -5, left: "50%", marginLeft: -4, cursor: "n-resize" },
      },
      { id: "ne", style: { top: -5, right: -5, cursor: "ne-resize" } },
      {
        id: "w",
        style: { top: "50%", left: -5, marginTop: -4, cursor: "w-resize" },
      },
      {
        id: "e",
        style: { top: "50%", right: -5, marginTop: -4, cursor: "e-resize" },
      },
      { id: "sw", style: { bottom: -5, left: -5, cursor: "sw-resize" } },
      {
        id: "s",
        style: { bottom: -5, left: "50%", marginLeft: -4, cursor: "s-resize" },
      },
      { id: "se", style: { bottom: -5, right: -5, cursor: "se-resize" } },
    ];
    return (
      <>
        {/* Rotation handle */}
        <div
          style={{
            position: "absolute",
            top: -24,
            left: "50%",
            marginLeft: -6,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#fff",
            border: "2px solid #3B82F6",
            cursor: "crosshair",
            zIndex: 10,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setRotating({
              id: el.id,
              cx: el.x + el.width / 2,
              cy: el.y + el.height / 2,
            });
          }}
        />
        {handles.map((h) => (
          <div
            key={h.id}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#fff",
              border: "2px solid #3B82F6",
              zIndex: 10,
              ...h.style,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setResizing({
                id: el.id,
                handle: h.id,
                startX: e.clientX,
                startY: e.clientY,
                startEl: { ...el },
              });
            }}
          />
        ))}
      </>
    );
  }

  function startDrag(e: React.MouseEvent, el: CanvasElement) {
    e.stopPropagation();
    if (!artboardRef.current) return;
    const rect = artboardRef.current.getBoundingClientRect();
    const ox = (e.clientX - rect.left) / zoom - el.x;
    const oy = (e.clientY - rect.top) / zoom - el.y;
    setDragging({ id: el.id, ox, oy });
  }

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
      onClick={() => setFileMenu(null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setFileMenu(null);
      }}
    >
      {/* TOP NAV */}
      <TopNav
        projectName={projectName}
        editingName={editingName}
        setEditingName={setEditingName}
        nameRef={nameRef}
        onSaveName={(n: string) => {
          setProjectName(n);
          setEditingName(false);
        }}
        onUndo={() => dispatch({ type: "UNDO" })}
        onRedo={() => dispatch({ type: "REDO" })}
        canUndo={canUndo}
        canRedo={canRedo}
        onGoHome={onGoHome}
      />
      {/* MENU BAR */}
      <MenuBar
        fileMenu={fileMenu}
        setFileMenu={setFileMenu}
        menuActions={{
          onUndo: () => dispatch({ type: "UNDO" }),
          onRedo: () => dispatch({ type: "REDO" }),
          onDelete: () => {
            if (selectedId) {
              dispatch({ type: "DELETE", id: selectedId });
              setSelectedId(null);
            }
          },
          onSelectAll: () => {
            setSelectedIds(state.elements.map((e) => e.id));
            setSelectedId(null);
          },
          onCopy: () => {
            if (selected) {
              clipboardRef.current = { ...selected };
            }
          },
          onCut: () => {
            if (selected && selectedId) {
              clipboardRef.current = { ...selected };
              dispatch({ type: "DELETE", id: selectedId });
              setSelectedId(null);
              setSelectedIds([]);
            }
          },
          onPaste: () => {
            if (clipboardRef.current) {
              const newId = genId();
              dispatch({
                type: "ADD",
                element: {
                  ...clipboardRef.current,
                  id: newId,
                  x: clipboardRef.current.x + 20,
                  y: clipboardRef.current.y + 20,
                },
              });
              setSelectedId(newId);
              setSelectedIds([]);
            }
          },
          onDuplicate: () => {
            if (selected)
              dispatch({
                type: "ADD",
                element: {
                  ...selected,
                  id: genId(),
                  x: selected.x + 20,
                  y: selected.y + 20,
                },
              });
          },
          onZoomIn: () => setZoom(Math.min(4, zoom + 0.25)),
          onZoomOut: () => setZoom(Math.max(0.1, zoom - 0.25)),
          onZoomFit: () => setZoom(1),
          onZoomActual: () => setZoom(1),
          onBringToFront: () => {
            if (selectedId)
              dispatch({
                type: "REORDER_ABSOLUTE",
                id: selectedId,
                position: "front",
              });
          },
          onBringForward: () => {
            if (selectedId)
              dispatch({ type: "REORDER", id: selectedId, dir: "up" });
          },
          onSendBackward: () => {
            if (selectedId)
              dispatch({ type: "REORDER", id: selectedId, dir: "down" });
          },
          onSendToBack: () => {
            if (selectedId)
              dispatch({
                type: "REORDER_ABSOLUTE",
                id: selectedId,
                position: "back",
              });
          },
          onNewDesign: () => {
            if (
              window.confirm("Start a new design? This will clear the canvas.")
            ) {
              dispatch({ type: "LOAD", elements: [] });
              setSelectedId(null);
            }
          },
          onResizePreset: (w, h) => {
            setArtboardW(w);
            setArtboardH(h);
          },
          onCustomSize: () => setShowCustomSizeModal(true),
        }}
      />
      {/* MAIN */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR RAIL */}
        <SidebarRail activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* CONTENT PANE */}
        {activeTab && (
          <ContentPane
            activeTab={activeTab}
            onAddElement={addElement}
            onChangeCanvasBg={setCanvasBg}
          />
        )}
        {/* CANVAS */}
        <CanvasArea
          elements={state.elements}
          setSelectedId={setSelectedId}
          zoom={zoom}
          setZoom={setZoom}
          artboardRef={artboardRef}
          renderShape={renderShape}
          renderText={renderText}
          renderImage={renderImage}
          canvasBg={canvasBg}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageCount={pageCount}
          setPageCount={setPageCount}
          artboardW={artboardW}
          artboardH={artboardH}
        />
        {showCustomSizeModal && (
          <CustomSizeModal
            onApply={(w, h) => {
              setArtboardW(w);
              setArtboardH(h);
              setShowCustomSizeModal(false);
            }}
            onClose={() => setShowCustomSizeModal(false)}
          />
        )}
        {/* RIGHT PANEL */}
        <PropertiesPanel
          selected={selected}
          canvasBg={canvasBg}
          setCanvasBg={setCanvasBg}
          onUpdate={(changes) => {
            if (selectedId)
              dispatch({ type: "UPDATE", id: selectedId, changes });
          }}
          onDelete={() => {
            if (selectedId) {
              dispatch({ type: "DELETE", id: selectedId });
              setSelectedId(null);
            }
          }}
          onReorder={(dir) => {
            if (selectedId) dispatch({ type: "REORDER", id: selectedId, dir });
          }}
        />
      </div>
    </div>
  );
}

// ---- TopNav ----
function TopNav({
  projectName,
  editingName,
  setEditingName,
  nameRef,
  onSaveName,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onGoHome,
}: {
  projectName: string;
  editingName: boolean;
  setEditingName: (v: boolean) => void;
  nameRef: React.RefObject<HTMLInputElement | null>;
  onSaveName: (n: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onGoHome: () => void;
}) {
  const [name, setName] = useState(projectName);
  useEffect(() => setName(projectName), [projectName]);

  const COLLAB = [
    { initials: "AK", color: "#10B981" },
    { initials: "SM", color: "#F59E0B" },
    { initials: "JR", color: "#EC4899" },
  ];

  return (
    <div
      style={{
        height: 56,
        background: "#2B2F36",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 12,
        flexShrink: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {/* Logo */}
      <button
        type="button"
        onClick={onGoHome}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
          border: "none",
          background: "transparent",
          color: "#6D5EF6",
          padding: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "#6D5EF6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <title>DesignStudio</title>
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
          style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.2px" }}
        >
          DesignStudio
        </span>
      </button>

      {/* Project name */}
      <div
        style={{ height: 24, width: 1, background: "#4B5563", margin: "0 4px" }}
      />
      {editingName ? (
        <input
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => onSaveName(name)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSaveName(name);
          }}
          style={{
            background: "#3B404A",
            border: "1px solid #6D5EF6",
            color: "#F9FAFB",
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 14,
            outline: "none",
            width: 200,
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingName(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setEditingName(true);
          }}
          style={{
            color: "#F3F4F6",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: 6,
            transition: "background 0.15s",
            border: "none",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#3B404A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {projectName}{" "}
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>✎</span>
        </button>
      )}

      <div style={{ flex: 1 }} />

      {/* Undo/Redo */}
      {[
        { fn: onUndo, label: "↩", enabled: canUndo, title: "Undo (Ctrl+Z)" },
        { fn: onRedo, label: "↪", enabled: canRedo, title: "Redo (Ctrl+Y)" },
      ].map((btn) => (
        <button
          type="button"
          key={btn.title}
          title={btn.title}
          onClick={btn.fn}
          disabled={!btn.enabled}
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            border: "none",
            background: "transparent",
            color: btn.enabled ? "#F3F4F6" : "#4B5563",
            fontSize: 18,
            cursor: btn.enabled ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            if (btn.enabled) e.currentTarget.style.background = "#3B404A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {btn.label}
        </button>
      ))}

      <div
        style={{ width: 1, height: 24, background: "#4B5563", margin: "0 8px" }}
      />

      {/* Collab avatars */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {COLLAB.map((c, i) => (
          <div
            key={c.initials}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: c.color,
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: i > 0 ? -8 : 0,
              border: "2px solid #2B2F36",
              position: "relative",
              zIndex: 3 - i,
            }}
          >
            {c.initials}
            {i === 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22C55E",
                  border: "1px solid #2B2F36",
                  animation: "pulse-ring 1.5s ease-in-out infinite",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <span style={{ color: "#9CA3AF", fontSize: 12, marginLeft: 4 }}>
        All saved
      </span>

      <button
        type="button"
        style={{
          padding: "6px 16px",
          borderRadius: 6,
          border: "1px solid #6B7280",
          background: "transparent",
          color: "#F3F4F6",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#9CA3AF";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#6B7280";
        }}
      >
        Share
      </button>

      <button
        type="button"
        style={{
          padding: "6px 16px",
          borderRadius: 6,
          border: "none",
          background: "#6D5EF6",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(109,94,246,0.4)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#5B4FD4";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#6D5EF6";
        }}
      >
        ⬇ Download
      </button>

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
          cursor: "pointer",
          marginLeft: 4,
        }}
      >
        U
      </div>
    </div>
  );
}

// ---- MenuBar ----
const MENU_ITEMS: Record<string, string[]> = {
  File: [
    "New Design",
    "Open...",
    "Save (Ctrl+S)",
    "Duplicate",
    "─",
    "Download as PNG",
    "Download as PDF",
    "─",
    "Print",
  ],
  Edit: [
    "Undo (Ctrl+Z)",
    "Redo (Ctrl+Y)",
    "─",
    "Cut",
    "Copy",
    "Paste",
    "Duplicate (Ctrl+D)",
    "─",
    "Select All",
    "Delete",
  ],
  View: [
    "Zoom In",
    "Zoom Out",
    "Fit Page",
    "Actual Size",
    "─",
    "Show Rulers",
    "Show Grid",
    "Snap to Grid",
  ],
  Resize: [
    "Custom Size...",
    "─",
    "Instagram Post (1080×1080)",
    "Presentation (1920×1080)",
    "A4 Document (794×1123)",
    "Twitter Header (1500×500)",
    "Facebook Cover (820×312)",
  ],
  Arrangement: [
    "Bring to Front",
    "Bring Forward",
    "Send Backward",
    "Send to Back",
    "─",
    "Group",
    "Ungroup",
    "─",
    "Align Left",
    "Align Center",
    "Align Right",
  ],
};

interface MenuActions {
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  onDuplicate: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onZoomActual: () => void;
  onBringToFront: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onSendToBack: () => void;
  onNewDesign: () => void;
  onResizePreset: (w: number, h: number) => void;
  onCustomSize: () => void;
}

// ---- Custom Size Modal ----
const PRESETS = [
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Facebook Cover", w: 820, h: 312 },
  { label: "A4 Document", w: 794, h: 1123 },
  { label: "Presentation", w: 1920, h: 1080 },
  { label: "Twitter Header", w: 1500, h: 500 },
  { label: "YouTube Thumbnail", w: 1280, h: 720 },
];

function CustomSizeModal({
  onApply,
  onClose,
}: {
  onApply: (w: number, h: number) => void;
  onClose: () => void;
}) {
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          padding: "28px 32px",
          minWidth: 380,
          maxWidth: 460,
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: "0 0 18px",
            fontSize: 18,
            fontWeight: 700,
            color: "#1a1a2e",
          }}
        >
          Custom Canvas Size
        </h2>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label
              htmlFor="cs-width"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#6B7280",
                display: "block",
                marginBottom: 6,
              }}
            >
              WIDTH (px)
            </label>
            <input
              id="cs-width"
              type="number"
              value={w}
              min={1}
              max={9999}
              onChange={(e) =>
                setW(Math.max(1, Number.parseInt(e.target.value) || 1))
              }
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1.5px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
              }}
              data-ocid="custom_size.input"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              htmlFor="cs-height"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#6B7280",
                display: "block",
                marginBottom: 6,
              }}
            >
              HEIGHT (px)
            </label>
            <input
              id="cs-height"
              type="number"
              value={h}
              min={1}
              max={9999}
              onChange={(e) =>
                setH(Math.max(1, Number.parseInt(e.target.value) || 1))
              }
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1.5px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6B7280",
              margin: "0 0 8px",
            }}
          >
            QUICK PRESETS
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {PRESETS.map((p) => (
              <button
                type="button"
                key={p.label}
                onClick={() => {
                  setW(p.w);
                  setH(p.h);
                }}
                style={{
                  padding: "4px 10px",
                  borderRadius: 20,
                  border: "1.5px solid #E5E7EB",
                  background: w === p.w && h === p.h ? "#6366F1" : "#F9FAFB",
                  color: w === p.w && h === p.h ? "#fff" : "#374151",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.15s",
                }}
                data-ocid="custom_size.button"
              >
                {p.label} ({p.w}×{p.h})
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1.5px solid #E5E7EB",
              background: "#fff",
              color: "#374151",
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 500,
            }}
            data-ocid="custom_size.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApply(w, h)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#6366F1",
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 600,
            }}
            data-ocid="custom_size.confirm_button"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuBar({
  fileMenu,
  setFileMenu,
  menuActions,
}: {
  fileMenu: string | null;
  setFileMenu: (v: string | null) => void;
  menuActions: MenuActions;
}) {
  const ACTION_MAP: Record<string, () => void> = {
    "Undo (Ctrl+Z)": menuActions.onUndo,
    "Redo (Ctrl+Y)": menuActions.onRedo,
    Delete: menuActions.onDelete,
    "Select All": menuActions.onSelectAll,
    "Duplicate (Ctrl+D)": menuActions.onDuplicate,
    Copy: menuActions.onCopy,
    Cut: menuActions.onCut,
    Paste: menuActions.onPaste,
    "New Design": menuActions.onNewDesign,
    "Zoom In": menuActions.onZoomIn,
    "Zoom Out": menuActions.onZoomOut,
    "Fit Page": menuActions.onZoomFit,
    "Actual Size": menuActions.onZoomActual,
    "Bring to Front": menuActions.onBringToFront,
    "Bring Forward": menuActions.onBringForward,
    "Send Backward": menuActions.onSendBackward,
    "Send to Back": menuActions.onSendToBack,
    "Instagram Post (1080×1080)": () => menuActions.onResizePreset(1080, 1080),
    "Presentation (1920×1080)": () => menuActions.onResizePreset(1920, 1080),
    "A4 Document (794×1123)": () => menuActions.onResizePreset(794, 1123),
    "Twitter Header (1500×500)": () => menuActions.onResizePreset(1500, 500),
    "Facebook Cover (820×312)": () => menuActions.onResizePreset(820, 312),
    "Custom Size...": () => menuActions.onCustomSize(),
  };

  return (
    <div
      style={{
        height: 34,
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        gap: 2,
        flexShrink: 0,
        position: "relative",
        zIndex: 40,
      }}
    >
      {Object.keys(MENU_ITEMS).map((label) => (
        <div key={label} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFileMenu(fileMenu === label ? null : label);
            }}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              border: "none",
              background: fileMenu === label ? "#F3F4F6" : "transparent",
              color: "#374151",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F3F4F6";
            }}
            onMouseLeave={(e) => {
              if (fileMenu !== label)
                e.currentTarget.style.background = "transparent";
            }}
          >
            {label}
          </button>
          {fileMenu === label && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                minWidth: 220,
                padding: "4px 0",
                zIndex: 100,
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {MENU_ITEMS[label].map((item) =>
                item === "─" ? (
                  <div
                    key="separator"
                    style={{
                      height: 1,
                      background: "#E5E7EB",
                      margin: "4px 0",
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    key={item}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "7px 16px",
                      border: "none",
                      background: "transparent",
                      color: "#374151",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#F3F4F6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                    onClick={() => {
                      ACTION_MAP[item]?.();
                      setFileMenu(null);
                    }}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---- SidebarRail ----
function SidebarRail({
  activeTab,
  setActiveTab,
}: { activeTab: string | null; setActiveTab: (v: string | null) => void }) {
  return (
    <div
      style={{
        width: 68,
        background: "#F5F6F8",
        borderRight: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 8,
        flexShrink: 0,
        overflowY: "auto",
      }}
    >
      {SIDEBAR_TABS.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
          title={tab.label}
          style={{
            width: 56,
            padding: "10px 4px",
            borderRadius: 8,
            border: "none",
            background: activeTab === tab.id ? "#EEE9FF" : "transparent",
            color: activeTab === tab.id ? "#6D5EF6" : "#6B7280",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
            borderLeft:
              activeTab === tab.id
                ? "3px solid #6D5EF6"
                : "3px solid transparent",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id)
              e.currentTarget.style.background = "#EBEBEB";
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id)
              e.currentTarget.style.background = "transparent";
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{tab.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 500 }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// ---- ContentPane ----
function ContentPane({
  activeTab,
  onAddElement,
  onChangeCanvasBg,
}: {
  activeTab: string;
  onAddElement: (
    partial: Partial<CanvasElement> & { type: CanvasElement["type"] },
  ) => void;
  onChangeCanvasBg: (color: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [paneWidth, setPaneWidth] = useState(240);
  const isDraggingPane = useRef(false);

  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingPane.current = true;
    const startX = e.clientX;
    const startW = paneWidth;
    const onMove = (ev: MouseEvent) => {
      if (!isDraggingPane.current) return;
      const newW = Math.min(480, Math.max(160, startW + ev.clientX - startX));
      setPaneWidth(newW);
    };
    const onUp = () => {
      isDraggingPane.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      style={{
        width: paneWidth,
        background: "#fff",
        borderRight: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflowY: "hidden",
        position: "relative",
      }}
    >
      {/* Resize handle */}
      <div
        onMouseDown={onResizeMouseDown}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 5,
          height: "100%",
          cursor: "col-resize",
          zIndex: 10,
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(109,94,246,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      />
      {/* Search */}
      <div style={{ padding: "12px 12px 8px", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
              background: "#F9FAFB",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#6D5EF6";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
              fontSize: 14,
            }}
          >
            🔍
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
        {/* TEMPLATES */}
        {activeTab === "templates" && (
          <div>
            <SectionHead>Recent</SectionHead>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[
                "#6D5EF6",
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EC4899",
                "#EF4444",
              ].map((c) => (
                <div
                  key={c}
                  style={{
                    height: 80,
                    background: c,
                    borderRadius: 8,
                    cursor: "pointer",
                    opacity: 0.8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                  }}
                />
              ))}
            </div>
            <SectionHead>Social Media</SectionHead>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {["#0EA5E9", "#8B5CF6", "#14B8A6", "#F97316"].map((c) => (
                <div
                  key={c}
                  style={{
                    height: 80,
                    background: c,
                    borderRadius: 8,
                    cursor: "pointer",
                    opacity: 0.8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ELEMENTS */}
        {activeTab === "elements" && (
          <div>
            <SectionHead>Shapes</SectionHead>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
              }}
            >
              {SHAPES.map((s) => (
                <button
                  type="button"
                  key={s.shapeType}
                  onClick={() =>
                    onAddElement({
                      type: "shape",
                      shapeType: s.shapeType,
                      fill: "#6D5EF6",
                      width: 120,
                      height: 120,
                    })
                  }
                  style={{
                    height: 60,
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background: "#F9FAFB",
                    cursor: "pointer",
                    fontSize: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#EEE9FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F9FAFB";
                  }}
                >
                  <span>{s.icon}</span>
                  <span style={{ fontSize: 10, color: "#6B7280" }}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TEXT */}
        {activeTab === "text" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TEXT_PRESETS.map((p) => (
              <button
                type="button"
                key={p.label}
                onClick={() =>
                  onAddElement({
                    type: "text",
                    text: p.text,
                    fontSize: p.fontSize,
                    fontWeight: p.fontWeight,
                    fill: "#111827",
                    width: 400,
                    height: p.fontSize * 2,
                  })
                }
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  background: "#fff",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F9FAFB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                <span
                  style={{
                    fontSize: Math.min(p.fontSize * 0.5, 22),
                    fontWeight: p.fontWeight,
                    color: "#111827",
                  }}
                >
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* UPLOADS */}
        {activeTab === "uploads" && <UploadPane onAddElement={onAddElement} />}

        {/* PHOTOS */}
        {activeTab === "photos" && (
          <div>
            <SectionHead>Stock Photos</SectionHead>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
              }}
            >
              {[
                "#CBD5E1",
                "#BAE6FD",
                "#BBF7D0",
                "#FDE68A",
                "#FECACA",
                "#DDD6FE",
                "#FBD38D",
                "#A7F3D0",
              ].map((c, i) => (
                <div
                  key={c}
                  onClick={() =>
                    onAddElement({
                      type: "shape",
                      shapeType: "rectangle",
                      fill: c,
                      width: 200,
                      height: 150,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      onAddElement({
                        type: "shape",
                        shapeType: "rectangle",
                        fill: c,
                        width: 200,
                        height: 150,
                      });
                  }}
                  style={{
                    height: 80,
                    background: c,
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: "#6B7280",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Photo {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ICONS */}
        {activeTab === "icons" && (
          <div>
            <SectionHead>Icons</SectionHead>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 6,
              }}
            >
              {ICONS_SVG.map((icon) => (
                <button
                  type="button"
                  key={icon}
                  onClick={() =>
                    onAddElement({
                      type: "text",
                      text: icon,
                      fontSize: 40,
                      fill: "#374151",
                      width: 60,
                      height: 60,
                    })
                  }
                  style={{
                    height: 40,
                    borderRadius: 6,
                    border: "1px solid #E5E7EB",
                    background: "#F9FAFB",
                    cursor: "pointer",
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#EEE9FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F9FAFB";
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BACKGROUNDS */}
        {activeTab === "backgrounds" && (
          <div>
            <SectionHead>Solid Colors</SectionHead>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 6,
              }}
            >
              {BG_COLORS.slice(0, 12).map((c) => (
                <div
                  key={c}
                  onClick={() => onChangeCanvasBg(c)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onChangeCanvasBg(c);
                  }}
                  style={{
                    height: 40,
                    background: c,
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "1px solid #E5E7EB",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                  }}
                />
              ))}
            </div>
            <SectionHead>Gradients</SectionHead>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
              }}
            >
              {BG_COLORS.slice(12).map((c) => (
                <div
                  key={c}
                  onClick={() => onChangeCanvasBg(c)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onChangeCanvasBg(c);
                  }}
                  style={{
                    height: 60,
                    background: c,
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginTop: 16,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

// ---- Canvas Area ----
function CanvasArea({
  elements,
  setSelectedId,
  zoom,
  setZoom,
  artboardRef,
  renderShape,
  renderText,
  renderImage,
  canvasBg,
  currentPage,
  setCurrentPage,
  pageCount,
  setPageCount,
  artboardW,
  artboardH,
}: {
  elements: CanvasElement[];
  setSelectedId: (id: string | null) => void;
  zoom: number;
  setZoom: (z: number) => void;
  artboardRef: React.RefObject<HTMLDivElement | null>;
  renderShape: (el: CanvasElement) => React.ReactNode;
  renderText: (el: CanvasElement) => React.ReactNode;
  renderImage: (el: CanvasElement) => React.ReactNode;
  canvasBg: string;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageCount: number;
  setPageCount: (n: number) => void;
  artboardW: number;
  artboardH: number;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#EEF1F5",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Rulers */}
      <div style={{ display: "flex", flexShrink: 0 }}>
        <div
          style={{
            width: 30,
            height: 30,
            background: "#F5F6F8",
            borderRight: "1px solid #E5E7EB",
            borderBottom: "1px solid #E5E7EB",
            flexShrink: 0,
          }}
        />
        <Ruler orientation="h" length={artboardW} zoom={zoom} />
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Ruler orientation="v" length={artboardH} zoom={zoom} />
        {/* Canvas scroll area */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
          onClick={() => setSelectedId(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedId(null);
          }}
        >
          <div
            ref={artboardRef}
            style={{
              width: artboardW * zoom,
              height: artboardH * zoom,
              background: canvasBg,
              position: "relative",
              boxShadow: "0 4px 40px rgba(0,0,0,0.15)",
              borderRadius: 2,
              flexShrink: 0,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {elements.map((el) =>
              el.type === "text"
                ? renderText(el)
                : el.type === "image"
                  ? renderImage(el)
                  : renderShape(el),
            )}
          </div>
        </div>
      </div>

      {/* Bottom toolbar */}
      <div
        style={{
          height: 40,
          background: "#fff",
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          flexShrink: 0,
        }}
      >
        {/* Zoom */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            type="button"
            style={BtnStyle}
            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
          >
            −
          </button>
          <span
            style={{
              fontSize: 13,
              color: "#374151",
              minWidth: 40,
              textAlign: "center",
            }}
          >
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            style={BtnStyle}
            onClick={() => setZoom(Math.min(4, zoom + 0.1))}
          >
            +
          </button>
          <button
            type="button"
            style={{ ...BtnStyle, fontSize: 12, padding: "4px 8px" }}
            onClick={() => setZoom(1)}
          >
            Fit
          </button>
        </div>
        {/* Page nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {Array.from({ length: pageCount }, (_, i) => i).map((i) => (
            <div
              key={`page-${i}`}
              onClick={() => setCurrentPage(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setCurrentPage(i);
              }}
              style={{
                width: i === currentPage ? 20 : 8,
                height: 8,
                borderRadius: 4,
                background: i === currentPage ? "#6D5EF6" : "#D1D5DB",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
          <button
            type="button"
            style={{ ...BtnStyle, fontSize: 12 }}
            onClick={() => setPageCount(pageCount + 1)}
          >
            + Page
          </button>
        </div>
        <div style={{ fontSize: 12, color: "#9CA3AF" }}>
          Page {currentPage + 1} of {pageCount}
        </div>
      </div>
    </div>
  );
}

const BtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: "1px solid #E5E7EB",
  background: "#fff",
  color: "#374151",
  fontSize: 16,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function Ruler({
  orientation,
  length,
  zoom,
}: { orientation: "h" | "v"; length: number; zoom: number }) {
  const ticks: number[] = [];
  for (let i = 0; i <= length; i += 50) {
    ticks.push(i);
  }
  if (orientation === "h") {
    return (
      <div
        style={{
          height: 30,
          flex: 1,
          background: "#F5F6F8",
          borderBottom: "1px solid #E5E7EB",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {ticks.map((t) => (
          <div
            key={t}
            style={{
              position: "absolute",
              left: t * zoom + 40,
              top: 0,
              height: "100%",
              borderLeft: "1px solid #D1D5DB",
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: "#9CA3AF",
                paddingLeft: 2,
                lineHeight: "12px",
                display: "block",
              }}
            >
              {t}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div
      style={{
        width: 30,
        background: "#F5F6F8",
        borderRight: "1px solid #E5E7EB",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {ticks.map((t) => (
        <div
          key={t}
          style={{
            position: "absolute",
            top: t * zoom + 40,
            left: 0,
            width: "100%",
            borderTop: "1px solid #D1D5DB",
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: "#9CA3AF",
              writingMode: "vertical-rl",
              display: "block",
              paddingTop: 2,
            }}
          >
            {t}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---- Properties Panel ----
function PropertiesPanel({
  selected,
  canvasBg,
  setCanvasBg,
  onUpdate,
  onDelete,
  onReorder,
}: {
  selected: CanvasElement | null;
  canvasBg: string;
  setCanvasBg: (c: string) => void;
  onUpdate: (changes: Partial<CanvasElement>) => void;
  onDelete: () => void;
  onReorder: (dir: "up" | "down") => void;
}) {
  return (
    <div
      style={{
        width: 280,
        background: "#fff",
        borderLeft: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflowY: "auto",
      }}
    >
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
          {selected
            ? selected.type === "text"
              ? "📝 Text"
              : selected.type === "shape"
                ? "🔷 Shape"
                : "🖼 Image"
            : "🎨 Canvas"}
        </span>
      </div>

      <div style={{ padding: "12px 16px", flex: 1, overflowY: "auto" }}>
        {!selected && (
          <>
            <PropLabel>Background</PropLabel>
            <ColorRow value={canvasBg} onChange={setCanvasBg} />
            <PropLabel style={{ marginTop: 16 }}>Canvas Size</PropLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <PropInput label="Width" value="800" onChange={() => {}} />
              <PropInput label="Height" value="600" onChange={() => {}} />
            </div>
          </>
        )}

        {selected?.type === "text" && (
          <>
            <PropLabel>Font</PropLabel>
            <select
              value={selected.fontFamily || "Inter"}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              style={SelectStyle}
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 8,
              }}
            >
              <div>
                <PropLabel>Weight</PropLabel>
                <select
                  value={selected.fontWeight || "400"}
                  onChange={(e) => onUpdate({ fontWeight: e.target.value })}
                  style={SelectStyle}
                >
                  {FONT_WEIGHTS.map((w) => (
                    <option key={w} value={w}>
                      {FONT_WEIGHT_LABELS[w]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <PropLabel>Size</PropLabel>
                <input
                  type="number"
                  value={selected.fontSize || 18}
                  onChange={(e) =>
                    onUpdate({
                      fontSize: Number.parseInt(e.target.value) || 18,
                    })
                  }
                  style={InputStyle}
                />
              </div>
            </div>

            <PropLabel style={{ marginTop: 12 }}>Color</PropLabel>
            <ColorRow
              value={selected.fill}
              onChange={(c) => onUpdate({ fill: c })}
            />

            <PropLabel style={{ marginTop: 12 }}>Alignment</PropLabel>
            <div style={{ display: "flex", gap: 4 }}>
              {["left", "center", "right", "justify"].map((align) => (
                <button
                  type="button"
                  key={align}
                  onClick={() => onUpdate({ textAlign: align })}
                  style={{
                    flex: 1,
                    height: 32,
                    borderRadius: 6,
                    border: "1px solid #E5E7EB",
                    background:
                      selected.textAlign === align ? "#EEE9FF" : "#fff",
                    color: selected.textAlign === align ? "#6D5EF6" : "#374151",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  {{ left: "⬱", center: "☰", right: "⬲", justify: "≡" }[align]}
                </button>
              ))}
            </div>

            <PropLabel style={{ marginTop: 12 }}>Style</PropLabel>
            <div style={{ display: "flex", gap: 4 }}>
              {[
                {
                  label: "B",
                  style: "fontWeight",
                  on: "700",
                  off: "400",
                  active: selected.fontWeight === "700",
                },
                {
                  label: "I",
                  style: "fontStyle",
                  on: "italic",
                  off: "normal",
                  active: selected.fontStyle === "italic",
                },
                {
                  label: "U",
                  style: "textDecoration",
                  on: "underline",
                  off: "none",
                  active: selected.textDecoration === "underline",
                },
              ].map((s) => (
                <button
                  type="button"
                  key={s.label}
                  onClick={() =>
                    onUpdate({
                      [s.style]: s.active ? s.off : s.on,
                    } as Partial<CanvasElement>)
                  }
                  style={{
                    width: 36,
                    height: 32,
                    borderRadius: 6,
                    border: "1px solid #E5E7EB",
                    background: s.active ? "#EEE9FF" : "#fff",
                    color: s.active ? "#6D5EF6" : "#374151",
                    cursor: "pointer",
                    fontWeight: s.label === "B" ? 700 : 400,
                    fontStyle: s.label === "I" ? "italic" : "normal",
                    textDecoration: s.label === "U" ? "underline" : "none",
                    fontSize: 14,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <OpacityRow
              value={selected.opacity}
              onChange={(v) => onUpdate({ opacity: v })}
            />
            <PositionSize el={selected} onUpdate={onUpdate} />
          </>
        )}

        {selected?.type === "shape" && (
          <>
            <PropLabel>Fill Color</PropLabel>
            <ColorRow
              value={selected.fill}
              onChange={(c) => onUpdate({ fill: c })}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 12,
              }}
            >
              <div>
                <PropLabel>Stroke</PropLabel>
                <ColorRow
                  value={selected.strokeColor || "#000000"}
                  onChange={(c) => onUpdate({ strokeColor: c })}
                />
              </div>
              <div>
                <PropLabel>Width</PropLabel>
                <input
                  type="number"
                  value={selected.strokeWidth || 0}
                  onChange={(e) =>
                    onUpdate({
                      strokeWidth: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  style={InputStyle}
                />
              </div>
            </div>

            {selected.shapeType === "rectangle" && (
              <>
                <PropLabel style={{ marginTop: 12 }}>Border Radius</PropLabel>
                <input
                  type="number"
                  value={selected.borderRadius || 0}
                  onChange={(e) =>
                    onUpdate({
                      borderRadius: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  style={InputStyle}
                />
              </>
            )}

            <OpacityRow
              value={selected.opacity}
              onChange={(v) => onUpdate({ opacity: v })}
            />
            <PositionSize el={selected} onUpdate={onUpdate} />

            <PropLabel style={{ marginTop: 12 }}>Layer</PropLabel>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => onReorder("up")}
                style={{ ...SmallBtnStyle }}
              >
                ▲ Forward
              </button>
              <button
                type="button"
                onClick={() => onReorder("down")}
                style={{ ...SmallBtnStyle }}
              >
                ▼ Backward
              </button>
            </div>
          </>
        )}

        {selected?.type === "image" && (
          <>
            <OpacityRow
              value={selected.opacity}
              onChange={(v) => onUpdate({ opacity: v })}
            />
            <PositionSize el={selected} onUpdate={onUpdate} />
            <PropLabel style={{ marginTop: 12 }}>Layer</PropLabel>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => onReorder("up")}
                style={{ ...SmallBtnStyle }}
              >
                ▲ Forward
              </button>
              <button
                type="button"
                onClick={() => onReorder("down")}
                style={{ ...SmallBtnStyle }}
              >
                ▼ Backward
              </button>
            </div>
          </>
        )}

        {selected && (
          <button
            type="button"
            onClick={onDelete}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "8px",
              borderRadius: 8,
              border: "1px solid #FCA5A5",
              background: "#FEF2F2",
              color: "#EF4444",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FEE2E2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FEF2F2";
            }}
          >
            🗑 Delete Element
          </button>
        )}
      </div>
    </div>
  );
}

const SelectStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #E5E7EB",
  fontSize: 13,
  outline: "none",
  background: "#fff",
  color: "#374151",
  cursor: "pointer",
};

const InputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #E5E7EB",
  fontSize: 13,
  outline: "none",
  background: "#fff",
  color: "#374151",
  boxSizing: "border-box",
};

const SmallBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: "6px",
  borderRadius: 6,
  border: "1px solid #E5E7EB",
  background: "#F9FAFB",
  color: "#374151",
  fontSize: 12,
  cursor: "pointer",
};

function PropLabel({
  children,
  style,
}: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 6,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ColorRow({
  value,
  onChange,
}: { value: string; onChange: (v: string) => void }) {
  const isGradient = value.startsWith("linear");
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <label
        htmlFor="color-picker-input"
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          cursor: "pointer",
          flexShrink: 0,
          background: value,
        }}
      >
        {!isGradient && (
          <input
            id="color-picker-input"
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ opacity: 0, width: 1, height: 1 }}
          />
        )}
      </label>
      <input
        value={isGradient ? "Gradient" : value}
        readOnly={isGradient}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...InputStyle }}
      />
    </div>
  );
}

function OpacityRow({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ marginTop: 12 }}>
      <PropLabel>Opacity: {Math.round(value * 100)}%</PropLabel>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#6D5EF6" }}
      />
    </div>
  );
}

function PositionSize({
  el,
  onUpdate,
}: { el: CanvasElement; onUpdate: (c: Partial<CanvasElement>) => void }) {
  return (
    <>
      <div style={{ height: 1, background: "#E5E7EB", margin: "16px 0" }} />
      <PropLabel>Position</PropLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <PropInput
          label="X"
          value={String(Math.round(el.x))}
          onChange={(v) => onUpdate({ x: Number.parseInt(v) || 0 })}
        />
        <PropInput
          label="Y"
          value={String(Math.round(el.y))}
          onChange={(v) => onUpdate({ y: Number.parseInt(v) || 0 })}
        />
      </div>
      <PropLabel>Size</PropLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <PropInput
          label="W"
          value={String(Math.round(el.width))}
          onChange={(v) => onUpdate({ width: Number.parseInt(v) || 20 })}
        />
        <PropInput
          label="H"
          value={String(Math.round(el.height))}
          onChange={(v) => onUpdate({ height: Number.parseInt(v) || 20 })}
        />
      </div>
      <PropLabel>Rotation</PropLabel>
      <input
        type="number"
        value={Math.round(el.rotation)}
        onChange={(e) =>
          onUpdate({ rotation: Number.parseInt(e.target.value) || 0 })
        }
        style={InputStyle}
      />
    </>
  );
}

function PropInput({
  label,
  value,
  onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 3 }}>
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={InputStyle}
      />
    </div>
  );
}
