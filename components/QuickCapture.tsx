"use client";
import { useState } from "react";
import type { CaptureItem } from "@/types";
import { AREAS, AREA_COLORS } from "@/lib/constants";
import { uid, todayStr } from "@/lib/utils";

interface Props {
  onSave: (item: CaptureItem) => void;
}

export default function QuickCapture({ onSave }: Props) {
  const [open, setOpen]   = useState(false);
  const [text, setText]   = useState("");
  const [area, setArea]   = useState<CaptureItem["area"]>("Work / Career");
  const [saved, setSaved] = useState(false);

  function save() {
    if (!text.trim()) return;
    onSave({ id: uid(), text, area, date: todayStr() });
    setText("");
    setSaved(true);
    setTimeout(() => { setSaved(false); setOpen(false); }, 800);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", bottom: 24, right: 20, zIndex: 150,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          border: "none", color: "#fff", fontSize: 26, cursor: "pointer",
          boxShadow: "0 4px 24px #6366f166",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 8px 32px #6366f188"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";   e.currentTarget.style.boxShadow = "0 4px 24px #6366f166"; }}
        title="Quick capture idea"
      >⊕</button>

      {/* Modal */}
      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 400,
          background: "#000b",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          padding: "0 0 80px",
        }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: "100%", maxWidth: 480,
            background: "#13151f", border: "1px solid #252a3a",
            borderRadius: "18px 18px 0 0",
            padding: 20,
            animation: "slideUp 0.3s cubic-bezier(.16,1,.3,1)",
          }}>
            <div style={{ width: 36, height: 4, background: "#252a3a", borderRadius: 2, margin: "0 auto 16px" }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>
              {saved ? "✅ Captured!" : "⊕ Quick Capture"}
            </div>
            <textarea
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's on your mind? Capture it instantly..."
              rows={3}
              style={{
                width: "100%", background: "#0f1118", border: "1px solid #252a3a",
                borderRadius: 10, padding: "12px 14px", color: "#fff",
                fontSize: 15, fontFamily: "inherit", outline: "none",
                resize: "none", lineHeight: 1.6, marginBottom: 10, boxSizing: "border-box",
              }}
              onKeyDown={e => e.key === "Enter" && e.ctrlKey && save()}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select
                value={area}
                onChange={e => setArea(e.target.value as CaptureItem["area"])}
                style={{
                  flex: 1, background: "#0f1118", border: "1px solid #252a3a",
                  borderRadius: 10, padding: "11px 12px", color: "#fff",
                  fontSize: 14, fontFamily: "inherit", outline: "none", WebkitAppearance: "none",
                }}
              >
                {AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
              <button onClick={save} style={{
                background: `linear-gradient(135deg,${AREA_COLORS[area]},${AREA_COLORS[area]}bb)`,
                border: "none", borderRadius: 10, color: "#fff",
                padding: "11px 20px", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
              }}>Capture</button>
            </div>
            <div style={{ fontSize: 11, color: "#3949ab", marginTop: 8, textAlign: "center" }}>Ctrl+Enter to save quickly</div>
          </div>
        </div>
      )}
    </>
  );
}
